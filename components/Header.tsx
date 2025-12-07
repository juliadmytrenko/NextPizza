import React from "react";
import Image from "next/image";

export const Header = () => {
  return (
    <header className="border-b">
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
