import next, { NextComponentType, NextPageContext } from "next";
import NextAuth from "next-auth";
import { AppProps } from "next/dist/shared/lib/router/router";

declare module "next-auth" {
  interface Session {
    early_access: boolean;
  }
}

export type NextComponentWithAuth = NextComponentType<
  NextPageContext,
  any,
  {}
> & {
  auth: boolean;
};

export type ProtectedAppProps = AppProps & { Component: NextComponentWithAuth };
