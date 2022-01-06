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
    let emails: Array<string> = [];
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

    let no_header = 0;
    await (async function (labels: Array<string>, emails: Array<string>) {
      for (const label of labels) {
        let paginate = true;
        do {
          let query = "-{";
          emails.forEach((email) => (query += ` from:${email}, `));
          query += "}";

          let list = await gmail.users.messages.list({
            userId: "me",
            auth: oauth2Client,
            labelIds: [label],
            q: query,
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

          // console.log(message.data.payload?.headers);

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
          } else {
            no_header++;
          }

          emails.push(email);
          // valid_emails.push(email);
        } while (paginate);
      }
    })(labels, emails);
    console.log(emails);
    console.log(links);
    console.log(valid_emails);
    console.log(companies);
    console.log(no_header);

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
