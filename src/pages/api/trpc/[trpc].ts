import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";
import { google } from "googleapis";
import { PrismaClient } from "@prisma/client";
import { getCurrentTokens, getGoogleUrl } from "libs/auth/google";
import { TRPCError } from "@trpc/server";
import { parse } from "node-html-parser";

const prisma = new PrismaClient();

const gmail = google.gmail({
  version: "v1",
});

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_ID,
  process.env.GOOGLE_SECRET,
  "http://localhost:3000/api/auth/callback/google"
);

const appRouter = trpc
  .router()
  .mutation("getEmails", {
    input: z.object({
      email: z.string(),
    }),
    async resolve({ input }) {
      await prisma.subscription.deleteMany({
        where: {
          userEmail: input.email,
        },
      });

      await prisma.subscriptionBatch.deleteMany({
        where: {
          userEmail: input.email,
        },
      });

      try {
        const labels = ["CATEGORY_SOCIAL", "CATEGORY_PROMOTIONS", "SPAM"];
        let links: Array<string> = [];
        let nolinks: Array<any> = [];
        let companies: Array<string> = [];
        let valid_emails: Array<string> = [];

        const userInfo = await prisma.account.findUnique({
          where: {
            email: input.email,
          },
        });

        let tokens = {
          refresh_token: userInfo!.refresh_token!,
          access_token: userInfo!.access_token!,
        };

        if (userInfo!.expires_at! * 1000 < Date.now()) {
          try {
            tokens = await getCurrentTokens(input.email, tokens.refresh_token);
          } catch (e) {
            console.error(e);
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Your account token as expired",
              cause: e,
            });
          }
        }

        oauth2Client.setCredentials({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
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
                maxResults: 1,
              });

              if (!list.data.messages) {
                paginate = false;
                break;
              }

              let message = await gmail.users.messages.get({
                userId: "me",
                auth: oauth2Client,
                id: list.data.messages![0].id!,
                // fields: "payload/headers",
                format: "full",
              });

              let from = message.data.payload?.headers?.filter(
                (obj) => obj.name == "From"
              )[0].value;

              let unsub = message.data.payload?.headers?.filter(
                (obj) => obj.name == "List-Unsubscribe"
              )[0];

              let email;
              if (from!.includes("<")) {
                email = from!.substring(
                  from!.indexOf("<") + 1,
                  from!.indexOf(">")
                );
              } else {
                email = from!;
              }
              query += `${email} ,`;

              let company = from!.substring(0, from!.indexOf("<") - 1);
              let link;

              if (unsub?.value) {
                link = unsub.value.substring(
                  unsub.value.indexOf("<") + 1,
                  unsub.value.indexOf(">")
                );
              } else {
                let baseMessage;

                if (message.data.payload?.mimeType?.includes("multipart")) {
                  let foundText = message.data.payload.parts?.filter(
                    (mes) => mes.mimeType == "text/html"
                  );

                  if (foundText!.length > 0) {
                    baseMessage = foundText![0].body!.data!;
                  }

                  if (!baseMessage) {
                    nolinks.push({
                      company: company,
                      originEmail: from,
                      noLink: true,
                    });
                  }
                } else if (message.data.payload?.mimeType == "text/html") {
                  baseMessage = message.data.payload.body?.data;
                }

                if (baseMessage) {
                  let messageBuffer = Buffer.from(
                    baseMessage,
                    "base64"
                  ).toString();

                  let htmlMessage = parse(messageBuffer);
                  let aTags = htmlMessage.querySelectorAll("a");
                  let unsubscribeLinks = aTags.filter((a) =>
                    a.toString().includes("Unsubscribe")
                  );

                  if (unsubscribeLinks.length < 1) {
                    nolinks.push({
                      company: company,
                      originEmail: from,
                      noLink: true,
                    });
                  } else {
                    link = unsubscribeLinks[0].attributes.href;
                  }
                }
              }
              if (link) {
                links.push(link);
                valid_emails.push(email);
                companies.push(company);
              }
            } while (paginate);
          }
        })(labels);

        const batch = await prisma.subscriptionBatch.create({
          data: {
            userEmail: userInfo!.email!,
            userId: userInfo!.id!,
          },
        });

        let data = links.map((link, idx) => {
          return {
            userId: userInfo!.id,
            company: companies[idx],
            originEmail: valid_emails[idx],
            userEmail: userInfo!.email!,
            unsubscribe: link,
            batchId: batch.id,
          };
        });

        if (nolinks.length > 0) {
          data = data.concat(
            nolinks.map((nl) => {
              return {
                ...nl,
                batchId: batch.id,
                userId: userInfo!.id,
                userEmail: userInfo!.email,
              };
            })
          );
        }

        console.log("nolinks length", nolinks.length);

        const result = await prisma.subscription.createMany({
          data: data,
        });

        console.log(result);
      } catch (e) {
        console.error(e);
        throw e;
      }

      return {
        test: "Hello!",
      };
    },
  })
  .query("getAccounts", {
    input: z.object({
      email: z.string(),
    }),
    async resolve({ ctx, input }) {
      const user = await prisma.user.findFirst({
        where: {
          email: input.email,
        },
        include: {
          accounts: true,
        },
      });

      return { data: user!.accounts };
    },
  })
  .mutation("getURL", {
    input: z.object({
      emailProvider: z.string(),
    }),
    resolve({ input }) {
      if (input.emailProvider == "google") {
        const url = getGoogleUrl();
        return { url: url };
      }
    },
  })
  .query("getSubs", {
    input: z.object({
      email: z.string(),
      skip: z.number(),
      take: z.number(),
    }),
    async resolve({ input }) {
      const count = await prisma.subscription.count({
        where: {
          userEmail: input.email,
        },
      });

      const subscriptions = await prisma.subscription.findMany({
        where: {
          userEmail: input.email,
        },
        select: {
          company: true,
          originEmail: true,
          unsubscribe: true,
          noLink: true,
        },
        skip: input.skip,
        take: input.take,
      });
      return { count: count, subscriptions: subscriptions };
    },
  })
  .mutation("disconnectAccount", {
    input: z.object({
      email: z.string(),
    }),
    resolve({ input }) {
      prisma.account.delete({
        where: {
          email: input.email,
        },
      });
    },
  });

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
