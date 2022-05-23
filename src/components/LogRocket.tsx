import LogRocket from "logrocket";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

const LogRocketWrapper: React.FC = ({ children }) => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      LogRocket.identify(session.user!.name!, {
        name: session.user!.name!,
        email: session.user!.email!,
        subscriptionType: session.early_access
          ? "early_access"
          : "non_early_access",
      });
    }
  }, [session, status]);

  return <>{children}</>;
};

export default LogRocketWrapper;
