import React from "react";
import Image from "next/image";

export const Header = () => {
  return (
    <header className="border-b-2 border-orange-200 shadow-md bg-gradient-to-r from-white to-orange-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/next-pizza.svg"
              alt="Next Pizza"
              width={120}
              height={40}
              priority
            />
          </div>
        </div>
      </div>
    </header>
  );
};
