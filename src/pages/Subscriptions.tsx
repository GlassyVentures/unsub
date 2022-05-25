import { useSession } from "next-auth/react";
import type { NextPage } from "next";
import Header from "components/Header";
import Twitter from "components/Twitter";
import { trpc } from "utils/trpc";
import Secured from "components/Secured";

const todo = [
  "Finalizing the server that unsubscribes you from emails",
  "Talking to you and getting your feedback!",
];

const Subscriptions: NextPage = () => {
  const { data: session } = useSession();
  const scanEmail = trpc.useMutation(["scan-email"]);

  return (
    <Secured>
      <div className="h-screen">
        <Header />
        <div className="text-center flex flex-col justify-center mt-60">
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
          <h2 className="text-md mt-12 mb-3">
            {" "}
            If you have any feedback or questions, dm me on twitter!
          </h2>
          <button
            onClick={() => {
              scanEmail.mutate({ email: session?.user?.email! });
            }}
          >
            On Click
          </button>
          <Twitter />
        </div>
      </div>
    </Secured>
  );
};

export default Subscriptions;
