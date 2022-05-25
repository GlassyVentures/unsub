import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { google } from "googleapis";
import { z } from "zod";
import { prisma } from "@/libs/prisma";
import { TRPCError } from "@trpc/server";

type Email = {
  companyName: string;
  companyEmail: string;
  userId: string;
};

const gmail = google.gmail({
  version: "v1",
});

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_ID,
  process.env.GOOGLE_SECRET,
  "http://localhost:3000/api/auth/callback/google"
);

//TODO make protected routes
export const appRouter = trpc
  .router()
  .query("hello", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `hello ${input?.text ?? "world"}`,
      };
    },
  })
  .mutation("scan-email", {
    input: z.object({
      email: z.string(),
    }),
    async resolve({ input }) {
      try {
        const labels = ["CATEGORY_SOCIAL", "CATEGORY_PROMOTIONS", "SPAM"];

        let scanned_emails: Array<Email> = [];

        // This is the beginning of a gmail query.
        let query = "-{";

        const user = await prisma.user.findUnique({
          where: {
            email: input.email!,
          },
          include: {
            accounts: true,
          },
        });

        if (!user) return { message: "User not found" };

        const accountInfo = user.accounts.filter(
          (account) => account.provider === "google"
        )[0]; // Email is unique per each provider.

        if (!accountInfo) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Your account does not exist.",
          });
        }

        oauth2Client.setCredentials({
          refresh_token: accountInfo.refresh_token,
          access_token: accountInfo.access_token,
        });

        // Delete all existing scanned emails from db (Temporary)
        await prisma.emailSubscription.deleteMany({
          where: {
            userId: user.id,
          },
        });

        for (const label of labels) {
          let paginate = true;
          do {
            const list = await gmail.users.messages.list({
              userId: "me",
              auth: oauth2Client,
              labelIds: [label],
              q: query + "}", // appending "}" closes the query.
              maxResults: 1,
            });

            if (!list.data.messages) {
              paginate = false;
              break;
            }

            const message = await gmail.users.messages.get({
              userId: "me",
              auth: oauth2Client,
              id: list.data.messages[0]!.id!,
              format: "full",
            });

            const from = message.data.payload?.headers?.filter(
              (obj) => obj.name === "From" || obj.name === "from"
            )[0]?.value;

            const companyEmail = from!.includes("<")
              ? from!.substring(from!.indexOf("<") + 1, from!.indexOf(">"))
              : from!;

            query += `${companyEmail} ,`;

            const companyName = from!.substring(0, from!.indexOf("<") - 1);

            scanned_emails.push({
              companyName,
              companyEmail,
              userId: user.id,
            });
          } while (paginate);
        }

        scanned_emails.length > 0 &&
          (await prisma.emailSubscription.createMany({
            data: scanned_emails,
          }));
      } catch (e) {
        console.error(e);
      }
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
