"use client";
import React from "react";
import Image from "next/image";
import { useCart } from "../context/CartContext";

interface CardTileProps {
  name: string;
  image: string;
  ingredients: string[];
  sizes: { size: number; price: number }[];
}

export const CardTile: React.FC<CardTileProps> = ({
  name,
  image,
  ingredients,
  sizes,
}) => {
  const [selectedSize, setSelectedSize] = React.useState(sizes[0]);
  const { addToCart, setIsCartOpen } = useCart();

  const handleAddToCart = () => {
    addToCart({
      name,
      size: selectedSize.size,
      price: selectedSize.price,
      image,
    });
    setIsCartOpen(true);
  };

  return (
    <div className="border-2 border-orange-200 rounded-xl p-5 shadow-lg hover:shadow-2xl hover:border-orange-400 transition-all duration-300 flex gap-5 bg-gradient-to-br from-white to-orange-50">
      <div className="relative w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>

      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-2xl font-bold mb-2 text-orange-700">{name}</h3>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1 text-gray-800">
              Ingredients:
            </label>
            <p className="text-gray-600 text-sm">{ingredients.join(", ")}</p>
          </div>
        </div>

        <div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-gray-800">
              Size:
            </label>
            <div className="flex gap-2">
              {sizes.map((sizeOption) => (
                <button
                  key={sizeOption.size}
                  onClick={() => setSelectedSize(sizeOption)}
                  className={`px-2 py-0.5 rounded border text-sm ${
                    selectedSize.size === sizeOption.size
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {sizeOption.size}cm
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-2xl font-bold text-orange-600">
              {selectedSize.price} zł
            </span>
            <button
              onClick={handleAddToCart}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 text-sm rounded-md transition-colors"
            >
              Dodaj do koszyka
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
