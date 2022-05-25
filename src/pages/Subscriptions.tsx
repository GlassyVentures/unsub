import { useSession } from "next-auth/react";
import type { NextPage } from "next";
import Header from "components/Header";
import { trpc } from "utils/trpc";
import Secured from "components/Secured";

const Subscriptions: NextPage = () => {
  const { data: session } = useSession();
  const scanEmail = trpc.useMutation(["scan-email"]);
  const getEmails = trpc.useQuery([
    "get-emails",
    {
      email: session?.user?.email!,
    },
  ]);

  return (
    <Secured>
      <div className="h-screen">
        <Header />
        <div className="px-20">
          <div className="flex flex-row justify-between mt-10">
            <h1 className="text-xl font-bold">Email Subscriptions</h1>
            <div className="relative rounded">
              <button
                className="glowbttn py-3 font-bold text-white transition-shadow duration-300 bg-black rounded shadow-2xl focus-within:ring-4 px-7 hover:bg-text-rad hover:shadow-none"
                onClick={() =>
                  scanEmail.mutate({ email: session?.user?.email! })
                }
              >
                Scan Email
              </button>
            </div>
          </div>
          <div className="flex flex-wrap mt-5">
            {getEmails.data ? (
              getEmails.data.map((email, key) => (
                <div
                  className="bg-black w-25 h-25 p-3 rounded-lg text-white m-3"
                  key={key}
                >
                  <h1 className="font-bold">{email.companyName}</h1>
                  <h2>{email.companyEmail}</h2>
                  <h3>{email.subscribed ? "Subscribed" : "Unsubscribed"}</h3>
                </div>
              ))
            ) : (
              <div className="w-screen">
                <h1 className="text-center font-bold text-xl">
                  Click Scan Email to get started!
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </Secured>
  );
};

export default Subscriptions;
