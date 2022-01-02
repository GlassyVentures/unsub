import React from "react";
import Link from "next/link";
import { signIn, useSession, signOut } from "next-auth/react";

const AuthButton: React.FC = () => {
  const { data: session, status } = useSession();

  if (status == "authenticated") {
    return <h1>{session?.user?.name!}</h1>;
  }

  return (
    <button
      className="py-3 font-bold text-white transition-shadow duration-300 bg-black rounded shadow-2xl focus-within:ring-4 px-7 hover:bg-text-rad hover:shadow-none"
      onClick={() => signIn("google", { callbackUrl: "/EarlyAccess" })}
    >
      Sign In
    </button>
  );
};

const Header: React.FC = ({ children }) => {
  return (
    <div>
      <div className="flex justify-between items-center p-3 shadow-xl bg-gray-200">
        <Link href="/">
          <a>
            <h1 className="font-bold text-xl">UNSUB</h1>
          </a>
        </Link>
        <AuthButton />
      </div>
      {children}
    </div>
  );
};

export default Header;
