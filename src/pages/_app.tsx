import "../styles/globals.css";
import type { AppProps } from "next/app";
import PlausibleProvider from "next-plausible";
import Head from "next/head";
import { DefaultSeo } from "components/SEO";
import { SessionProvider } from "next-auth/react";
import LogRocket from "logrocket";
import LogRocketWrapper from "components/LogRocket";
import { withTRPC } from "@trpc/next";
import { AppRouter } from "./api/trpc/[trpc]";

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET!);

  return (
    <PlausibleProvider domain="unsub.email">
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DefaultSeo />
      <SessionProvider session={session}>
        <LogRocketWrapper>
          <Component {...pageProps} />
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
