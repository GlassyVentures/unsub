import React from "react";
import Link from "next/link";
import { signIn, useSession, signOut } from "next-auth/react";

const Profile: React.FC = () => {
  const { data: session, status } = useSession();

  const handleButton = () => {
    if (status === "authenticated") {
      signOut();
    } else {
      signIn("google", {
        callbackUrl: "/dashboard",
      });
    }
  };

  return (
    <div className="flex items-center">
      <h1 className="text-md invisible md:visible font-medium">
        {session?.user?.name}
      </h1>
      <button
        className="bg-black py-3 font-bold text-white w-32 rounded-md ml-5 shadow-md"
        onClick={handleButton}
      >
        {status === "authenticated" ? "Sign Out" : "Sign In"}
      </button>
    </div>
  );
};

const Header: React.FC = () => {
  return (
    <div className="flex justify-between items-center p-3 shadow-xl bg-gray-100">
      <Link passHref href="/">
        <h1 className="font-bold text-xl">UNSUB</h1>
      </Link>
      <Profile />
    </div>
  );
};

export default Header;
