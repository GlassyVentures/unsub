import { useSession } from "next-auth/react";
import Header from "components/Header";
import Twitter from "components/Twitter";
import { trpc } from "utils/trpc";
import Secured from "components/Secured";
import type { NextPageWithAuth } from "@/lib/types";

const todo = [
  "Finalizing the server that unsubscribes you from emails",
  "Talking to you and getting your feedback!",
];

const Dashboard: NextPageWithAuth = () => {
  const { data: session, status } = useSession();
  const scanEmail = trpc.useMutation(["scan-email"]);

  if (typeof window !== "undefined" && status === "loading") return null;

  if (!session) {
  }

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

Dashboard.auth = true;

export default Dashboard;
