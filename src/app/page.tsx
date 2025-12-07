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
    ingredients: ["Sos pomidorowy", "Ser mozzarella", "Bazylia"],
    sizes: [
      { size: 30, price: 20 },
      { size: 40, price: 30 },
      { size: 50, price: 40 },
    ],
  },
  {
    name: "Pepperoni",
    image: "/images/pepperoni.jpg",
    ingredients: ["Sos pomidorowy", "Ser mozzarella", "Pepperoni"],
    sizes: [
      { size: 30, price: 25 },
      { size: 40, price: 35 },
      { size: 50, price: 45 },
    ],
  },
  {
    name: "Pepperoni",
    image: "/images/pepperoni.jpg",
    ingredients: ["Sos pomidorowy", "Ser mozzarella", "Pepperoni"],
    sizes: [
      { size: 30, price: 25 },
      { size: 40, price: 35 },
      { size: 50, price: 45 },
    ],
  },
  {
    name: "Pepperoni",
    image: "/images/pepperoni.jpg",
    ingredients: ["Sos pomidorowy", "Ser mozzarella", "Pepperoni"],
    sizes: [
      { size: 30, price: 25 },
      { size: 40, price: 35 },
      { size: 50, price: 45 },
    ],
  },
  {
    name: "Pepperoni",
    image: "/images/pepperoni.jpg",
    ingredients: ["Sos pomidorowy", "Ser mozzarella", "Pepperoni"],
    sizes: [
      { size: 30, price: 25 },
      { size: 40, price: 35 },
      { size: 50, price: 45 },
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
