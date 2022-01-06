import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Subscriber: React.FC = ({ children }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status == "unauthenticated" || !session!.early_access) {
      router.push("/AccessDenied");
    }
  }, [status, router, session]);

  if (status == "unauthenticated" || !session!.early_access) {
    return (
      <div>
        <h1>{"You're not supposed to be here."}</h1>
      </div>
    );
  }

  return <div>{children}</div>;
};

export default Subscriber;
