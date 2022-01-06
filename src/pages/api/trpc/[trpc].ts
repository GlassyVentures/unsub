import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";
import { google } from "googleapis";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const gmail = google.gmail({
  version: "v1",
});

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_ID,
  process.env.GOOGLE_SECRET,
  "http://localhost:3000/api/auth/callback/google"
);

const appRouter = trpc.router().mutation("getEmails", {
  input: z.object({
    email: z.string(),
  }),
  async resolve({ input }) {
    const labels = ["CATEGORY_SOCIAL", "CATEGORY_PROMOTIONS", "SPAM"];
    let links: Array<string> = [];
    let companies: Array<string> = [];
    let valid_emails: Array<string> = [];

    const userInfo = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
      include: {
        accounts: true,
      },
    });

    oauth2Client.setCredentials({
      access_token: userInfo?.accounts[0].access_token,
      refresh_token: userInfo?.accounts[0].refresh_token,
    });

    await (async function (labels: Array<string>) {
      let query = "-{";
      for (const label of labels) {
        let paginate = true;
        do {
          let list = await gmail.users.messages.list({
            userId: "me",
            auth: oauth2Client,
            labelIds: [label],
            q: query + "}",
          });

          if (list.data.resultSizeEstimate === 0) {
            paginate = false;
            break;
          }

          let message = await gmail.users.messages.get({
            userId: "me",
            auth: oauth2Client,
            id: list.data.messages![0].id!,
            fields: "payload/headers",
          });

          let from = message.data.payload?.headers?.filter(
            (obj) => obj.name == "From"
          )[0].value;

          let unsub = message.data.payload?.headers?.filter(
            (obj) => obj.name == "List-Unsubscribe"
          )[0];

          let email = from!.substring(
            from!.indexOf("<") + 1,
            from!.indexOf(">")
          );

          let company = from!.substring(0, from!.indexOf("<") - 1);

          if (unsub?.value) {
            let link = unsub.value.substring(
              unsub.value.indexOf("<") + 1,
              unsub.value.indexOf(">")
            );

            links.push(link);
            valid_emails.push(email);
            companies.push(company);
          }

          query += `${email}, `;
        } while (paginate);
      }
    })(labels);

    const batch = await prisma.subscriptionBatch.create({
      data: {
        userEmail: userInfo!.email!,
        userId: userInfo!.id!,
      },
    });

    const data = links.map((link, idx) => {
      return {
        userId: userInfo!.id,
        company: companies[idx],
        originEmail: valid_emails[idx],
        userEmail: userInfo!.email!,
        unsubscribe: link,
        batchId: batch.id,
      };
    });

    const result = await prisma.subscription.createMany({
      data: data,
    });

    console.log(result);

    return {
      test: "Hello!",
    };
  },
});

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
