import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

const Protect: React.FC = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (!session!.early_access) {
    router.push("/AccessDenied");
  }

  return <div>{children}</div>;
};

export default Protect;
