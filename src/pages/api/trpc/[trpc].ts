import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { string, z } from "zod";
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
    let emails: Array<string> = [];
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

    let paginate = true;

    do {
      try {
        let query = "-{";
        emails.forEach((email) => (query += ` from:${email}, `));
        query += "}";
        console.log(query);

        let list = await gmail.users.messages.list({
          userId: "me",
          auth: oauth2Client,
          // labelIds: ["CATEGORY_SOCIAL", "CATEGORY_PROMOTIONS"],
          // // labelIds: ["CATEGORY_SOCIAL"],
          labelIds: ["CATEGORY_PROMOTIONS"],
          q: query,
          // labelIds: ["SPAM"],
        });
        // list.data.nextPageToken === null ? (paginate = false) : null;
        // list.data.resultSizeEstimate === 0 ? (paginate = false) : null;
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
        console.log(message.data.payload?.headers);
        let from = message.data.payload?.headers?.filter(
          (obj) => obj.name == "From"
        )[0].value;
        let email = from!.substring(from!.indexOf("<") + 1, from!.indexOf(">"));
        console.log(email);
        emails.push(email);
      } catch (err) {
        console.log(err);
      }
    } while (paginate);
    // return {
    //   test: "Hello!",
    // };
  },
});

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
