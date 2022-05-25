import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Secured: React.FC = ({ children }) => {
  const { status } = useSession();
  const router = useRouter();

  if (status == "loading") {
    return null;
  }

  if (status === "unauthenticated") {
    router.push("/AccessDenied");
  }

  return <>{children}</>;
};

export default Secured;
