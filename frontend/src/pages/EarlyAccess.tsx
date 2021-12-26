import { useSession } from "next-auth/react";
import Link from "next/link";

const todo = [
  "Finalizing the server that unsubscribes you from emails",
  "Moving the project to a monorepo",
  "Talking to you and getting your feedback!",
];

const EarlyAccess = () => {
  let { data: session, status } = useSession();
  return (
    <div className="text-center px-8">
      {status == "authenticated" ? (
        <>
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
          <div className="relative rounded">
            <Link passHref href="https://twitter.com/@_heyglassy">
              <button className="py-3 font-bold text-black bg-blue-300 w-32 rounded-md">
                @_heyglassy
              </button>
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default EarlyAccess;
