import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/libs/prisma";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          scope:
            "openid profile email https://www.googleapis.com/auth/gmail.readonly",
          access_type: "offline",
          response_type: "code",
          prompt: "consent",
        },
      },
    }),
  ],
  secret: process.env.SECRET!,
  callbacks: {
    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      else if (url.startsWith("https://buy.stripe.com")) return url;
      return baseUrl;
    },
    async session({ user, session }) {
      const onboard = await prisma.onboard.findUnique({
        where: {
          email: user.email!,
        },
      });

      if (onboard) {
        await prisma.user.update({
          where: {
            email: user.email!,
          },
          data: {
            earlyAccess: true,
          },
        });
        await prisma.onboard.update({
          where: {
            email: user.email!,
          },
          data: {
            onboarded: true,
          },
        });
      }

      const result = await prisma.user.findUnique({
        where: {
          email: user.email!,
        },
      });

      if (result?.earlyAccess) session.early_access = true;
      else session.early_access = false;

      return session;
    },
  },
});
