import { getSession, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import type { GetServerSidePropsContext } from "next";
import { useEffect } from "react";
import Header from "components/Header";

const todo = [
  "Finalizing the server that unsubscribes you from emails",
  "Moving the project to a monorepo",
  "Talking to you and getting your feedback!",
];

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  return { props: { session } };
}

const EarlyAccess = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status == "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status == "unauthenticated") {
    return (
      <div>
        <h1>{"You're not supposed to be here."}</h1>
      </div>
    );
  }

  return (
    <Header>
      <div className="text-center px-8 h-screen flex flex-col justify-center">
        <h1 className="text-2xl font-bold">
          Hey {session?.user!.name}, you have early access to Unsub!
        </h1>
        <h2 className="text-xl mt-12 underline underline-offset-4">
          Here is what we are up to right now{" "}
        </h2>
        <ul className="list-disc list-inside mt-2">
          {todo.map((item, key) => (
            <li className="text-lg" key={key}>
              {item}
            </li>
          ))}
        </ul>
        <h2 className="text-md mt-12">
          {" "}
          If you have any feedback or questions, dm me on twitter!
        </h2>
        <div className="flex justify-around mt-5">
          <div className="relative rounded">
            <Link passHref href="https://twitter.com/@_heyglassy">
              <button className="py-3 font-bold text-black bg-blue-300 w-32 rounded-md">
                @_heyglassy
              </button>
            </Link>
          </div>
          <div className=" relative rounded">
            <button
              className="bg-black py-3 font-bold text-white w-32 rounded-md"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default EarlyAccess;
