import Header from "components/Header";
import { useSession } from "next-auth/react";
import { trpc } from "utils/trpc";
import { NextComponentWithAuth } from "types/next-auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Account } from "@prisma/client";
import Protect from "components/Protect";
import Link from "next/link";

const Subscriptons: NextComponentWithAuth = () => {
  const [paginate, setPaginate] = useState({ skip: 0, take: 25 });
  const router = useRouter();
  const { data: session } = useSession();

  const mutation = trpc.useMutation(["getEmails"]);
  const getGoogleURL = trpc.useMutation(["getURL"]);
  // const disconnectAccount = trpc.useMutation(["disconnectAccount"]);

  const query = trpc.useQuery([
    "getAccounts",
    {
      email: session!.user!.email!,
    },
  ]);

  if (getGoogleURL.isSuccess) {
    router.push(getGoogleURL.data!.url);
  }

  const subscriptions = trpc.useQuery([
    "getSubs",
    {
      email: session!.user!.email!,
      skip: paginate.skip,
      take: paginate.take,
    },
  ]);

  const Emails: React.FC = () => {
    if (query.status == "success") {
      return (
        <div>
          <h1>Linked Accounts</h1>
          {query.data.data.map((d, key) => {
            return (
              <div
                key={key}
                className="flex w-48 h-6 rounded text-center align-middle"
              >
                <h1>{d.email}</h1>
                {/* <button
                  className="ml-2 bg-black text-white w-6 rounded"
                  onClick={() => {
                    disconnectAccount.mutate({
                      email: query.data.data[0].email!,
                    });
                  }}
                >
                  x
                </button> */}
              </div>
            );
          })}
        </div>
      );
    }
    return <div>...Loading</div>;
  };

  const Subscriptions: React.FC = () => {
    return (
      <>
        <div className="flex flex-row flex-wrap justify-around">
          {subscriptions.data?.subscriptions.map((email, key) => {
            return (
              <div
                key={key}
                className="bg-white w-80 h-32 p-2 my-4 flex flex-col justify-evenly"
              >
                <h1>{email.company}</h1>
                <h2>{email.originEmail}</h2>
                {email.noLink ? (
                  <h1>An unsubscribe link was not found</h1>
                ) : (
                  <Link href={email.unsubscribe!} passHref>
                    <h1 className="bg-black text-white rounded px-2">
                      Unsub Link
                    </h1>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-center">
          {paginate.skip == 0 ? null : (
            <button
              className="bg-black text-white rounded w-24 h-12 mx-2"
              onClick={() => {
                setPaginate({
                  skip: paginate.skip - 25,
                  take: paginate.take - 25,
                });
                subscriptions.refetch();
              }}
            >
              Previous
            </button>
          )}
          {paginate.take > subscriptions.data?.count! ? null : (
            <button
              className="bg-black text-white rounded w-24 h-12 mx-2"
              onClick={() => {
                setPaginate({
                  skip: paginate.skip + 25,
                  take: paginate.take + 25,
                });
                subscriptions.refetch();
              }}
            >
              Next
            </button>
          )}
        </div>
      </>
    );
  };

  if (mutation.isError) {
    window.alert(
      'Your account authentication has expired, please sign back in by pressing the "Add Account " Button below'
    );
    mutation.reset();
  }

  return (
    <Protect>
      <Header>
        <div className="h-screen flex justify-center mt-10">
          <div className="rounded bg-gray-400 shadow-xl w-5/6 p-3 h-max">
            <div className="flex justify-between">
              <h1 className="text-xl font-bold ">Subscriptions</h1>
              <button
                className="h-12 w-32 font-bold rounded bg-black text-white"
                onClick={() => {
                  if (query.data?.data.length! == 0) {
                    alert("Please connect an email before scanning.");
                  } else {
                    mutation.mutate({ email: query.data?.data[0].email! });
                  }
                }}
              >
                Scan Email
              </button>
            </div>
            {subscriptions.data?.subscriptions.length! > 0 ? (
              <Subscriptions />
            ) : (
              <h1>Scan Email to get started</h1>
            )}
          </div>
          <div className="ml-5">
            <Emails />
            {query.data?.data.length! > 0 ? null : (
              <button
                className="h-12 w-32 font-bold rounded bg-black text-white"
                onClick={() => getGoogleURL.mutate({ emailProvider: "google" })}
              >
                Add Email
              </button>
            )}
          </div>
        </div>
      </Header>
    </Protect>
  );
};

Subscriptons.auth = true;

export default Subscriptons;
