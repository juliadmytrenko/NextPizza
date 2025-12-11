"use client";
import React from "react";
import Image from "next/image";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="border-b-2 border-orange-200 shadow-md bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24 sm:h-28">
          <div className="flex items-center h-full py-2">
            <Image
              src="/next-pizza.svg"
              alt="Next Pizza"
              width={200}
              height={83}
              className="h-full w-auto"
              priority
            />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-orange-600 p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex gap-4 lg:gap-8 items-center">
            <a
              href="/#pizzas"
              className="text-orange-600 hover:text-orange-700 font-semibold transition-colors text-sm lg:text-base"
            >
              Pizzas
            </a>
            <a
              href="/#sauces"
              className="text-orange-600 hover:text-orange-700 font-semibold transition-colors text-sm lg:text-base"
            >
              Sauces
            </a>
            <a
              href="/#drinks"
              className="text-orange-600 hover:text-orange-700 font-semibold transition-colors text-sm lg:text-base"
            >
              Drinks
            </a>
            <a
              href="/#about"
              className="text-gray-700 hover:text-orange-600 font-semibold transition-colors text-sm lg:text-base"
            >
              About
            </a>
            <a
              href="/#contact"
              className="text-gray-700 hover:text-orange-600 font-semibold transition-colors text-sm lg:text-base"
            >
              Contact
            </a>
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden flex flex-col gap-3 pb-4">
            <a
              href="/#pizzas"
              onClick={() => setIsMenuOpen(false)}
              className="text-orange-600 hover:text-orange-700 font-semibold transition-colors py-2"
            >
              Pizzas
            </a>
            <a
              href="/#sauces"
              onClick={() => setIsMenuOpen(false)}
              className="text-orange-600 hover:text-orange-700 font-semibold transition-colors py-2"
            >
              Sauces
            </a>
            <a
              href="/#drinks"
              onClick={() => setIsMenuOpen(false)}
              className="text-orange-600 hover:text-orange-700 font-semibold transition-colors py-2"
            >
              Drinks
            </a>
            <a
              href="/#about"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:text-orange-600 font-semibold transition-colors py-2"
            >
              About
            </a>
            <a
              href="/#contact"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:text-orange-600 font-semibold transition-colors py-2"
            >
              Contact
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};
