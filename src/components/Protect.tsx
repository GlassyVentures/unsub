import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Protect: React.FC = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session!.early_access) {
      router.push("/AccessDenied");
    }
  }, [session, router]);

  if (status == "authenticated" && session?.early_access) {
    return <div>{children}</div>;
  }
  return <></>;
};

export default Protect;
