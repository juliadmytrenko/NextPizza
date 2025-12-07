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
    sizes: [{ size: 100, price: 5 }],
  },
  {
    name: "BBQ sauce",
    image: "/images/bbq.jpg",
    ingredients: ["Tomatoes", "Paprika", "Onion", "Spices"],
    category: "sauces",
    sizes: [{ size: 100, price: 5 }],
  },
  {
    name: "Spicy sauce",
    image: "/images/bbq.jpg",
    ingredients: ["Tomatoes", "Chili", "Paprika", "Spices"],
    category: "sauces",
    sizes: [{ size: 100, price: 5 }],
  },
  {
    name: "Coca-Cola",
    image: "/images/pepperoni.jpg",
    ingredients: ["Carbonated drink"],
    category: "drinks",
    sizes: [
      { size: 330, price: 7 },
      { size: 500, price: 9 },
      { size: 1000, price: 12 },
    ],
  },
  {
    name: "Sprite",
    image: "/images/pepperoni.jpg",
    ingredients: ["Lemon-lime carbonated drink"],
    category: "drinks",
    sizes: [
      { size: 330, price: 7 },
      { size: 500, price: 9 },
    ],
  },
  {
    name: "Orange juice",
    image: "/images/pepperoni.jpg",
    ingredients: ["100% orange juice"],
    category: "drinks",
    sizes: [
      { size: 330, price: 8 },
      { size: 500, price: 11 },
    ],
  },
  {
    name: "Mineral water",
    image: "/images/pepperoni.jpg",
    ingredients: ["Sparkling spring water"],
    category: "drinks",
    sizes: [
      { size: 500, price: 5 },
      { size: 1000, price: 7 },
    ],
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-6xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col gap-4 w-full max-w-4xl">
          {CardTilesMock.map((card, index) => (
            <CardTile key={`${card.name}-${index}`} {...card} />
          ))}
        </div>
      </main>
    </div>
  );
}
