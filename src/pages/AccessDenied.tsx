import React from "react";
import Header from "components/Header";
import Link from "next/link";
import Twitter from "components/Twitter";

const AccessDenied: React.FC = () => {
  return (
    <div className="h-screen">
      <Header />
      <div className="text-center px-8 flex flex-col justify-center mt-60">
        <h1 className="text-2xl font-bold">Uh Oh!</h1>
        <h2 className="text-xl mt-5 underline underline-offset-4">
          Get early access to use unsub.
        </h2>
        <div className="static mt-5">
          <Link passHref href={process.env.NEXT_PUBLIC_PAYMENT_LINK!}>
            <button className="w-64 h-18 relative glowbttn py-3 font-bold text-white transition-shadow duration-300 bg-black rounded shadow-2xl focus-within:ring-4 px-7 hover:bg-text-rad hover:shadow-none">
              Get Early Access
            </button>
          </Link>
        </div>
        <h2 className="text-md mt-12">
          {" "}
          If you have any feedback or questions, dm me on twitter!
        </h2>
        <Twitter />
      </div>
    </div>
  );
};

export default AccessDenied;
