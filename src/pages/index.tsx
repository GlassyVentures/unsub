import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import Header from "components/Header";
import { useSession } from "next-auth/react";
import React from "react";

const EarlyAccess = () => {
  const { data: session, status } = useSession();

  if (status == "authenticated") {
    return (
      <div className="relative rounded ">
        <Link passHref href="/EarlyAccess">
          <button className="glowbttn py-3 font-bold text-white transition-shadow duration-300 bg-black rounded shadow-2xl focus-within:ring-4 px-7 hover:bg-text-rad hover:shadow-none">
            Start Unsubscribing
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative rounded">
      <Link passHref href="https://buy.stripe.com/14k7wta8m6yUfni5kk">
        <button className="glowbttn py-3 font-bold text-white transition-shadow duration-300 bg-black rounded shadow-2xl focus-within:ring-4 px-7 hover:bg-text-rad hover:shadow-none">
          Get Early Access
        </button>
      </Link>
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Unsub</title>
        <meta name="description" content="Take back control of your email." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header>
          <div className="flex flex-col items-center justify-center h-screen px-4">
            <h1 className="w-screen text-5xl font-bold text-center">UNSUB</h1>
            <h2 className="w-screen mt-1 text-xl text-center">
              Take back control of your email.
            </h2>
            <p className="relative w-screen mb-4 text-base text-center">
              See the emails you want. Automatically unsubscribe from the rest
              with unsub.
              <span className="absolute -top-1"> ✨</span>
            </p>
            <EarlyAccess />
          </div>
        </Header>
      </main>

      <footer className="absolute bottom-0 w-screen text-center">
        <h3>
          Built by{" "}
          <a
            href="https://twitter.com/_heyglassy"
            className="text-blue-700 underline"
          >
            Glassy Ventures
          </a>
        </h3>
      </footer>
    </div>
  );
};

export default Home;
