"use client";
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
          <nav className="flex gap-8">
            <a
              href="#pizzas"
              className="text-gray-700 hover:text-orange-600 font-semibold transition-colors"
            >
              Pizzas
            </a>
            <a
              href="#sauces"
              className="text-gray-700 hover:text-orange-600 font-semibold transition-colors"
            >
              Sauces
            </a>
            <a
              href="#drinks"
              className="text-gray-700 hover:text-orange-600 font-semibold transition-colors"
            >
              Drinks
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};
