"use client";
import Image from "next/image";
import Head from "next/head";
import { useEffect, useState } from "react";
import React from "react";
import { CardTile } from "../../components/CardTile";
import { Banner } from "../../components/Banner";
import { useMenu } from "../../context/MenuContext";
import { prisma } from "../lib/prisma";

type IngredientObj = {
  Ingredient: { name: string };
};

export type Product = {
  name: string;
  imageUrl: string;
  category: string;
  ProductIngredient?: { Ingredient: { name: string } }[];
  ProductSize?: { Size: { size: string; price: number } }[];
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pizzas, setPizzas] = useState<Product[]>([]);
  const [sauces, setSauces] = useState<Product[]>([]);
  const [drinks, setDrinks] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // const products = await prisma.product.findMany();
  useEffect(() => {
    let didTimeout = false;
    const timeoutId = setTimeout(() => {
      didTimeout = true;
      setLoadError(true);
      setLoading(false);
    }, 7000); // 7 seconds timeout

    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (didTimeout) return;
        const data = await res.json();
        const productsArray = Array.isArray(data) ? data : data.products;
        setProducts(productsArray);
        const pizzas = productsArray.filter(
          (item: any) => item.category === "pizza"
        );
        console.log("Fetched pizzas:", pizzas);
        setPizzas(pizzas);
        const sauces = productsArray.filter(
          (item: any) => item.category === "sauces"
        );
        setSauces(sauces);
        const drinks = productsArray.filter(
          (item: any) => item.category === "drinks"
        );
        setDrinks(drinks);
        setLoading(false);
        clearTimeout(timeoutId);
      } catch (err) {
        if (!didTimeout) {
          setLoadError(true);
          setProducts([]);
          setPizzas([]);
          setSauces([]);
          setDrinks([]);
          setLoading(false);
        }
        clearTimeout(timeoutId);
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div>
      <Banner />

      <div className="flex min-h-screen items-center justify-center font-sans">
        <main className="bg-black flex min-h-screen w-full max-w-6xl flex-col items-center justify-center py-8 sm:py-12 md:py-16 px-4 sm:px-8 md:px-16">
          <div className="flex flex-col gap-4 w-full max-w-4xl">
            {loadError ? (
              <div className="text-center text-red-600 font-bold my-4">
                Error loading products. Please try again later.
              </div>
            ) : (
              <>
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
                        imageUrl={product.imageUrl}
                        ingredients={product.ProductIngredient}
                        sizes={product.ProductSize}
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
                        imageUrl={product.imageUrl}
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
                        imageUrl={product.imageUrl}
                        ingredients={product.ProductIngredient}
                        sizes={product.ProductSize}
                      />
                    ))}
              </>
            )}

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
