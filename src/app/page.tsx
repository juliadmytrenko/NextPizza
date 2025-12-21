"use client";
import Image from "next/image";
import Head from "next/head";
import { useEffect, useState } from "react";
import React from "react";
import { CardTile } from "../../components/CardTile";
import { Banner } from "../../components/Banner";
import { useMenu } from "../../context/MenuContext";
import { prisma } from "../lib/prisma";

// const CardTilesMock = [
//   {
//     name: "Margherita",
//     image: "/images/margherita.jpg",
//     ingredients: ["Tomato sauce", "Mozzarella cheese", "Basil"],
//     category: "pizza",
//     sizes: [
//       { size: 30, price: 20 },
//       { size: 40, price: 30 },
//       { size: 50, price: 40 },
//     ],
//   },
//   {
//     name: "Pepperoni",
//     image: "/images/pepperoni.jpg",
//     ingredients: ["Tomato sauce", "Mozzarella cheese", "Pepperoni"],
//     category: "pizza",
//     sizes: [
//       { size: 30, price: 25 },
//       { size: 40, price: 35 },
//       { size: 50, price: 45 },
//     ],
//   },
//   {
//     name: "Hawaiian",
//     image: "/images/hawaii.jpg",
//     ingredients: ["Tomato sauce", "Mozzarella cheese", "Ham", "Pineapple"],
//     category: "pizza",
//     sizes: [
//       { size: 30, price: 26 },
//       { size: 40, price: 36 },
//       { size: 50, price: 46 },
//     ],
//   },
//   {
//     name: "Quattro Formaggi",
//     image: "/images/4cheese.jpg",
//     ingredients: [
//       "Cream sauce",
//       "Mozzarella",
//       "Gorgonzola",
//       "Parmesan",
//       "Ricotta",
//     ],
//     category: "pizza",
//     sizes: [
//       { size: 30, price: 28 },
//       { size: 40, price: 38 },
//       { size: 50, price: 48 },
//     ],
//   },
//   {
//     name: "Vegetarian",
//     image: "/images/pepperoni.jpg",
//     ingredients: [
//       "Tomato sauce",
//       "Mozzarella cheese",
//       "Bell pepper",
//       "Onion",
//       "Mushrooms",
//       "Olives",
//     ],
//     category: "pizza",
//     sizes: [
//       { size: 30, price: 24 },
//       { size: 40, price: 34 },
//       { size: 50, price: 44 },
//     ],
//   },
//   {
//     name: "Garlic sauce",
//     image: "/images/garlic-sauce-1.webp",
//     ingredients: ["Sour cream", "Garlic", "Spices"],
//     category: "sauces",
//     sizes: [{ size: 50, price: 3 }],
//   },
//   {
//     name: "BBQ sauce",
//     image: "/images/bbq.jpg",
//     ingredients: ["Tomatoes", "Paprika", "Onion", "Spices"],
//     category: "sauces",
//     sizes: [{ size: 50, price: 3 }],
//   },
//   {
//     name: "Spicy sauce",
//     image: "/images/bbq.jpg",
//     ingredients: ["Tomatoes", "Chili", "Paprika", "Spices"],
//     category: "sauces",
//     sizes: [{ size: 50, price: 3 }],
//   },
//   {
//     name: "Coca-Cola",
//     image: "/images/cola.jpg",
//     ingredients: ["Carbonated drink"],
//     category: "drinks",
//     sizes: [
//       { size: 250, price: 7 },
//       { size: 800, price: 9 },
//     ],
//   },
//   {
//     name: "Sprite",
//     image: "/images/cola.jpg",
//     ingredients: ["Lemon-lime carbonated drink"],
//     category: "drinks",
//     sizes: [
//       { size: 250, price: 7 },
//       { size: 800, price: 9 },
//     ],
//   },
//   {
//     name: "Orange juice",
//     image: "/images/cola.jpg",
//     ingredients: ["100% orange juice"],
//     category: "drinks",
//     sizes: [
//       { size: 250, price: 7 },
//       { size: 800, price: 9 },
//     ],
//   },
//   {
//     name: "Mineral water",
//     image: "/images/cola.jpg",
//     ingredients: ["Sparkling spring water"],
//     category: "drinks",
//     sizes: [
//       { size: 250, price: 7 },
//       { size: 800, price: 9 },
//     ],
//   },
// ];

// const PizzasMock = CardTilesMock.filter((card) => card.category === "pizza");
// const SaucesMock = CardTilesMock.filter((card) => card.category === "sauces");
// const DrinksMock = CardTilesMock.filter((card) => card.category === "drinks");

type IngredientObj = {
  Ingredient: { name: string };
};

// export type ProductSize = {
//   id: number;
//   size: number;
//   price: number;
// };

export type Product = {
  name: string;
  image: string;
  category: string;
  ProductIngredient?: { Ingredient: { name: string } }[];
  ProductSize?: { Size: { size: string; price: number } }[];
  price: number;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pizzas, setPizzas] = useState<Product[]>([]);
  const [sauces, setSauces] = useState<Product[]>([]);
  const [drinks, setDrinks] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // const products = await prisma.product.findMany();
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        const pizzas = data.filter((item: any) => item.category === "pizza");
        setPizzas(pizzas);
        const sauces = data.filter((item: any) => item.category === "sauces");
        setSauces(sauces);
        const drinks = data.filter((item: any) => item.category === "drinks");
        setDrinks(drinks);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Banner />

      <div className="flex min-h-screen items-center justify-center font-sans">
        <main className="bg-black flex min-h-screen w-full max-w-6xl flex-col items-center justify-center py-8 sm:py-12 md:py-16 px-4 sm:px-8 md:px-16">
          <div className="flex flex-col gap-4 w-full max-w-4xl">
            <h3
              id="pizzas"
              className="text-2xl sm:text-3xl font-bold text-orange-700 text-center sm:mt-0 md:mt-8 lg:mt-0"
            >
              Pizzas
            </h3>
            {loading
              ? [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-3 sm:p-5 shadow-lg bg-gradient-to-br from-white to-orange-50 border-2 border-orange-400 animate-pulse"
                  >
                    <div className="relative w-full sm:w-48 h-48 flex-shrink-0 rounded-lg shadow-md bg-gray-200 mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  </div>
                ))
              : pizzas.map((product, index) => (
                  <CardTile
                    key={`${product.name}-${index}`}
                    name={product.name}
                    image={product.image}
                    ingredients={product.ProductIngredient}
                    sizes={product.ProductSize}
                    price={product.price}
                  />
                ))}
            <br />
            <h3
              id="sauces"
              className="text-2xl sm:text-3xl font-bold text-orange-700 text-center"
            >
              Sauces
            </h3>
            {loading
              ? [...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-3 sm:p-5 shadow-lg bg-gradient-to-br from-white to-orange-50 border-2 border-orange-400 animate-pulse"
                  >
                    <div className="relative w-full sm:w-48 h-32 flex-shrink-0 rounded-lg shadow-md bg-gray-200 mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  </div>
                ))
              : sauces.map((product, index) => (
                  <CardTile
                    key={`${product.name}-${index}`}
                    name={product.name}
                    image={product.image}
                    ingredients={product.ProductIngredient}
                    sizes={product.ProductSize}
                    price={product.price}
                  />
                ))}
            <br />
            <h3
              id="drinks"
              className="text-2xl sm:text-3xl font-bold text-orange-700 text-center"
            >
              Drinks
            </h3>
            {loading
              ? [...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-3 sm:p-5 shadow-lg bg-gradient-to-br from-white to-orange-50 border-2 border-orange-400 animate-pulse"
                  >
                    <div className="relative w-full sm:w-48 h-32 flex-shrink-0 rounded-lg shadow-md bg-gray-200 mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  </div>
                ))
              : drinks.map((product, index) => (
                  <CardTile
                    key={`${product.name}-${index}`}
                    name={product.name}
                    image={product.image}
                    ingredients={product.ProductIngredient}
                    sizes={product.ProductSize}
                    price={product.price}
                  />
                ))}

            {/* About Us Section */}
            <div id="about" className="mt-8 pt-8 scroll-mt-24">
              <h3 className="text-2xl sm:text-3xl font-bold text-orange-700 text-center mb-6">
                About Us
              </h3>
              <div className="border-2 border-orange-200 rounded-xl p-4 sm:p-6 md:p-8 shadow-lg bg-gradient-to-br from-white to-orange-50">
                <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
                  Welcome to Next Pizza! We are passionate about creating
                  delicious, authentic pizzas using only the finest ingredients.
                  Our recipes have been perfected over years of experience,
                  bringing you the perfect combination of crispy crust,
                  flavorful sauce, and premium toppings.
                </p>
                <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
                  Every pizza is made fresh to order, ensuring that you receive
                  the highest quality product every time. From classic
                  Margherita to creative specialty pizzas, we have something for
                  everyone.
                </p>
                <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
                  Thank you for choosing Next Pizza. We look forward to serving
                  you!
                </p>
              </div>
            </div>
            {/* Contact Section */}
            <div id="contact" className="mt-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-orange-700 text-center my-6">
                Contact
              </h3>
              <div className="border-2 border-orange-200 rounded-xl p-4 sm:p-6 md:p-8 shadow-lg bg-gradient-to-br from-white to-orange-50">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-orange-600 mb-3">
                      Location
                    </h4>
                    <p className="text-gray-700 mb-2 text-sm sm:text-base">
                      123 Pizza Street
                    </p>
                    <p className="text-gray-700 mb-2 text-sm sm:text-base">
                      New York, NY 10001
                    </p>
                    <p className="text-gray-700 text-sm sm:text-base">
                      United States
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-orange-600 mb-3">
                      Get in Touch
                    </h4>
                    <p className="text-gray-700 mb-2 text-sm sm:text-base">
                      <span className="font-semibold">Phone:</span> +1 (555)
                      123-4567
                    </p>
                    <p className="text-gray-700 mb-2 text-sm sm:text-base break-words">
                      <span className="font-semibold">Email:</span>{" "}
                      info@nextpizza.com
                    </p>
                    <p className="text-gray-700 text-sm sm:text-base">
                      <span className="font-semibold">Hours:</span> Mon-Sun
                      11:00 AM - 11:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
