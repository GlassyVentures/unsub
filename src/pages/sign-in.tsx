import React, { useEffect } from "react";
import { UnsubIcon } from "@/lib/logo";
import { FaGoogle } from "react-icons/fa";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const SignIn: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") return <div></div>;

  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <UnsubIcon />
      <h1 className="text-2xl font-bold">Sign In</h1>
      <div className="static mt-5">
        <button
          onClick={() =>
            signIn("google", {
              callbackUrl: "/dashboard",
            })
          }
          className="w-32 h-18 relative glowbttn py-3 font-bold text-white transition-shadow duration-300 bg-black rounded shadow-2xl focus-within:ring-4 hover:bg-text-rad hover:shadow-none flex justify-center items-center"
        >
          <FaGoogle />
          <h1 className="ml-2">Google</h1>
        </button>
      </div>
    </div>
  );
};

export default SignIn;
