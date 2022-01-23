import "../styles/globals.css";
import PlausibleProvider from "next-plausible";
import Head from "next/head";
import { DefaultSeo } from "components/SEO";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { withTRPC } from "@trpc/next";
import { AppRouter } from "./api/trpc/[trpc]";
import React from "react";
import { ProtectedAppProps } from "types/next-auth";

const Auth: React.FC = ({ children }) => {
  const { data: session, status } = useSession({ required: true });
  const isUser = !!session?.user;
  React.useEffect(() => {
    if (status == "loading") return;
    if (!isUser) signIn("google", { callbackUrl: "/EarlyAccess" }); // If not authenticated, force log in
  }, [isUser, status]);

  if (isUser) {
    return <>{children}</>;
  }

  return <div>Loading...</div>;
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: ProtectedAppProps) => {
  return (
    <PlausibleProvider domain="unsub.email">
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DefaultSeo />
      <SessionProvider session={session}>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </SessionProvider>
    </PlausibleProvider>
  );
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : `http://localhost:3000/api/trpc`;

    return {
      url,
    };
  },
})(MyApp);
