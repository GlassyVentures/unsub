import "../styles/globals.css";
import type { AppProps } from "next/app";
import PlausibleProvider from "next-plausible";
import Head from "next/head";
import { DefaultSeo } from "components/SEO";
import { SessionProvider } from "next-auth/react";
import LogRocket from "logrocket";

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  LogRocket.init("5ptpgm/unsub");

  return (
    <PlausibleProvider domain="unsub.email">
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DefaultSeo />
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </PlausibleProvider>
  );
};

export default MyApp;
