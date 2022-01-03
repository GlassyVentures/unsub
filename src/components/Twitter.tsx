import React from "react";
import Link from "next/link";

const Twitter: React.FC = () => {
  return (
    <div className="relative rounded">
      <Link passHref href="https://twitter.com/@_heyglassy">
        <button className="py-3 font-bold text-black bg-blue-300 w-32 rounded-md shadow hover:shadow-none">
          @_heyglassy
        </button>
      </Link>
    </div>
  );
};

export default Twitter;
