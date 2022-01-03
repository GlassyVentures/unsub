import React from "react";
import Link from "next/link";
import { signIn, useSession, signOut } from "next-auth/react";

const AuthButton: React.FC = () => {
  const { data: session, status } = useSession();

  if (status == "authenticated") {
    return (
      <div className="flex items-center">
        <h1 className="text-md invisible md:visible">{session?.user?.name!}</h1>
        <button
          className="bg-black py-3 font-bold text-white w-32 rounded-md ml-5 shadow-md"
          onClick={() => signOut()}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      className="py-3 font-bold text-white transition-shadow duration-300 bg-black rounded focus-within:ring-4 px-7 hover:bg-text-rad hover:shadow-none"
      onClick={() => signIn("google", { callbackUrl: "/EarlyAccess" })}
    >
      Sign In
    </button>
  );
};

const Header: React.FC = ({ children }) => {
  return (
    <div>
      <div className="flex justify-between items-center p-3 shadow-xl bg-gray-100">
        <Link passHref href="/">
          <h1 className="font-bold text-xl">UNSUB</h1>
        </Link>
        <AuthButton />
      </div>
      {children}
    </div>
  );
};

export default Header;
