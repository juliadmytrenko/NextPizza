"use client";
import Image from "next/image";
import Head from "next/head";
import { useState } from "react";
import React from "react";
import { CardTile } from "../../components/CardTile";

const CardTilesMock = [
  {
    name: "Margherita",
    image: "/images/margherita.jpg",
    ingredients: ["Tomato sauce", "Mozzarella cheese", "Basil"],
    category: "pizza",
    sizes: [
      { size: 30, price: 20 },
      { size: 40, price: 30 },
      { size: 50, price: 40 },
    ],
  },
  {
    name: "Pepperoni",
    image: "/images/pepperoni.jpg",
    ingredients: ["Tomato sauce", "Mozzarella cheese", "Pepperoni"],
    category: "pizza",
    sizes: [
      { size: 30, price: 25 },
      { size: 40, price: 35 },
      { size: 50, price: 45 },
    ],
  },
  {
    name: "Hawaiian",
    image: "/images/pepperoni.jpg",
    ingredients: ["Tomato sauce", "Mozzarella cheese", "Ham", "Pineapple"],
    category: "pizza",
    sizes: [
      { size: 30, price: 26 },
      { size: 40, price: 36 },
      { size: 50, price: 46 },
    ],
  },
  {
    name: "Quattro Formaggi",
    image: "/images/pepperoni.jpg",
    ingredients: [
      "Cream sauce",
      "Mozzarella",
      "Gorgonzola",
      "Parmesan",
      "Ricotta",
    ],
    category: "pizza",
    sizes: [
      { size: 30, price: 28 },
      { size: 40, price: 38 },
      { size: 50, price: 48 },
    ],
  },
  {
    name: "Vegetarian",
    image: "/images/pepperoni.jpg",
    ingredients: [
      "Tomato sauce",
      "Mozzarella cheese",
      "Bell pepper",
      "Onion",
      "Mushrooms",
      "Olives",
    ],
    category: "pizza",
    sizes: [
      { size: 30, price: 24 },
      { size: 40, price: 34 },
      { size: 50, price: 44 },
    ],
  },
  {
    name: "Garlic sauce",
    image: "/images/garlic-sauce-1.webp",
    ingredients: ["Sour cream", "Garlic", "Spices"],
    category: "sauces",
    sizes: [{ size: 50, price: 3 }],
  },
  {
    name: "BBQ sauce",
    image: "/images/bbq.jpg",
    ingredients: ["Tomatoes", "Paprika", "Onion", "Spices"],
    category: "sauces",
    sizes: [{ size: 50, price: 3 }],
  },
  {
    name: "Spicy sauce",
    image: "/images/bbq.jpg",
    ingredients: ["Tomatoes", "Chili", "Paprika", "Spices"],
    category: "sauces",
    sizes: [{ size: 50, price: 3 }],
  },
  {
    name: "Coca-Cola",
    image: "/images/cola.jpg",
    ingredients: ["Carbonated drink"],
    category: "drinks",
    sizes: [
      { size: 250, price: 7 },
      { size: 800, price: 9 },
    ],
  },
  {
    name: "Sprite",
    image: "/images/cola.jpg",
    ingredients: ["Lemon-lime carbonated drink"],
    category: "drinks",
    sizes: [
      { size: 250, price: 7 },
      { size: 800, price: 9 },
    ],
  },
  {
    name: "Orange juice",
    image: "/images/cola.jpg",
    ingredients: ["100% orange juice"],
    category: "drinks",
    sizes: [
      { size: 250, price: 7 },
      { size: 800, price: 9 },
    ],
  },
  {
    name: "Mineral water",
    image: "/images/cola.jpg",
    ingredients: ["Sparkling spring water"],
    category: "drinks",
    sizes: [
      { size: 250, price: 7 },
      { size: 800, price: 9 },
    ],
  },
];

const PizzasMock = CardTilesMock.filter((card) => card.category === "pizza");
const SaucesMock = CardTilesMock.filter((card) => card.category === "sauces");
const DrinksMock = CardTilesMock.filter((card) => card.category === "drinks");

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-6xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col gap-4 w-full max-w-4xl">
          <h3
            id="pizzas"
            className="text-3xl font-bold text-orange-700 text-center my-4 pt-8"
          >
            Pizzas
          </h3>
          {PizzasMock.map((card, index) => (
            <CardTile key={`${card.name}-${index}`} {...card} />
          ))}
          <br />
          <h3
            id="sauces"
            className="text-3xl font-bold text-orange-700 text-center my-4 pt-8 "
          >
            Sauces
          </h3>
          {SaucesMock.map((card, index) => (
            <CardTile key={`${card.name}-${index}`} {...card} />
          ))}
          <br />
          <h3
            id="drinks"
            className="text-3xl font-bold text-orange-700 text-center my-4 pt-8 "
          >
            Drinks
          </h3>
          {DrinksMock.map((card, index) => (
            <CardTile key={`${card.name}-${index}`} {...card} />
          ))}
        </div>
      </main>
    </div>
  );
}
