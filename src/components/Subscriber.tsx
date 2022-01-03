import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import type { EarlyAccess } from "types/EarlyAccess";

const Subscriber: React.FC = ({ children }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const ea: EarlyAccess = session as EarlyAccess;

  useEffect(() => {
    if (status == "unauthenticated" || !ea.early_access) {
      router.push("/AccessDenied");
    }
  }, [status, router, ea]);

  if (status == "unauthenticated" || !ea.early_access) {
    return (
      <div>
        <h1>{"You're not supposed to be here."}</h1>
      </div>
    );
  }

  return <div>{children}</div>;
};

export default Subscriber;
