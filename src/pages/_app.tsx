import "../styles/globals.css";
import type { AppProps } from "next/app";
import PlausibleProvider from "next-plausible";
import Head from "next/head";
import { DefaultSeo } from "components/SEO";
import { SessionProvider } from "next-auth/react";
import LogRocket from "logrocket";
import LogRocketWrapper from "components/LogRocket";

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

export default MyApp;
