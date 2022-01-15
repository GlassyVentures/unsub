import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    early_access: boolean;
  }
}
