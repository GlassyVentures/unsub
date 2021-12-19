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
            See the emails you want. Get rid of the rest automagically
          </h1>
          <a href="https://buy.stripe.com/14k7wta8m6yUfni5kk">
            <input
              type="button"
              className="bg-black text-white w-48 h-12 rounded font-bold mt-2"
              value="Get Early Access"
            ></input>
          </a>
        </div>
      </main>

      <footer className="absolute bottom-0 w-screen text-center">
        <h1>
          Built by{" "}
          <a
            href="https://twitter.com/_heyglassy"
            className="underline text-blue-500"
          >
            Glassy Ventures
          </a>
        </h1>
      </footer>
    </div>
  );
};

export default Home;
