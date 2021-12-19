import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Unsub</title>
        <meta name="description" content="Take back control of your email." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="flex flex-col justify-center h-screen items-center">
          <h1 className="text-5xl w-screen text-center font-bold">UNSUB</h1>
          <h1 className="text-xl w-screen text-center">
            Take back control of your email.
          </h1>
          <h1 className="text-md w-screen text-center">
            See the emails you want and get rid of the rest automagically
          </h1>
          <h1 className="text-sm w-screen text-center">Coming Soon</h1>
        </div>
      </main>

      <footer className="absolute bottom-0 w-screen text-center">
        <a href="https://twitter.com/_heyglassy">Built by Glassy Ventures</a>
      </footer>
    </div>
  );
};

export default Home;
