import { useSession } from "next-auth/react";
import Header from "components/Header";
import Twitter from "components/Twitter";
import { NextComponentWithAuth } from "types/next-auth";
import Protect from "components/Protect";

const todo = [
  "Finalizing the server that unsubscribes you from emails",
  "Talking to you and getting your feedback!",
];

const EarlyAccess: NextComponentWithAuth = () => {
  const { data: session } = useSession();

  return (
    <Protect>
      <Header>
        <div className="text-center px-8 h-screen flex flex-col justify-center">
          <h1 className="text-2xl font-bold">
            Hey, you have early access to Unsub!
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
          <Twitter />
        </div>
      </Header>
    </Protect>
  );
};

EarlyAccess.auth = true;

export default EarlyAccess;
