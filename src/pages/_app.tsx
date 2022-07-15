import "../styles/globals.css";
import type { AppProps } from "next/app";
import PlausibleProvider from "next-plausible";
import Head from "next/head";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import LogRocket from "logrocket";
import { withTRPC } from "@trpc/next";
import { AppRouter } from "./api/trpc/[trpc]";
import type { NextPageWithAuth } from "../lib/types";
import { DefaultSeo } from "components/SEO";
import LogRocketWrapper from "components/LogRocket";
import { useEffect } from "react";

type AppPropsWithAuth = AppProps & {
  Component: NextPageWithAuth;
};

const Auth = ({ children }: { children: any }) => {
  const { data: session, status } = useSession();
  const isUser = !!session?.user;

  useEffect(() => {
    if (status === "loading") return;
    if (!isUser) {
      signIn("google", {
        callbackUrl: process.env.NEXT_PUBLIC_PAYMENT_LINK!,
      });
    }
  }, [isUser, status]);

  if (isUser) {
    return <>{children}</>;
  }

  return null;
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithAuth) => {
  LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET!);

  return (
    <PlausibleProvider domain="unsub.email">
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DefaultSeo />
      <SessionProvider session={session}>
        <LogRocketWrapper>
          {Component.auth ? (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </LogRocketWrapper>
      </SessionProvider>
    </PlausibleProvider>
  );
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return {
      url,
    };
  },
  ssr: true,
})(MyApp);
