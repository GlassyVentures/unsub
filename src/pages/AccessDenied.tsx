import React from "react";
import Header from "components/Header";
import Link from "next/link";
import Twitter from "components/twitter";

const AccessDenied: React.FC = () => {
  return (
    <div>
      <Header>
        <div className="text-center px-8 h-screen flex flex-col justify-center">
          <h1 className="text-2xl font-bold">Uh Oh!</h1>
          <h2 className="text-xl mt-5 underline underline-offset-4">
            Access is limited to our early access customers.
          </h2>
          <div className="static mt-5">
            <Link passHref href="https://buy.stripe.com/14k7wta8m6yUfni5kk">
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
      </Header>
    </div>
  );
};

export default AccessDenied;
