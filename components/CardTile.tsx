import React from "react";
import Image from "next/image";

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

  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
      <div className="relative w-full h-48 mb-4">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover rounded-md"
        />
      </div>

      <h3 className="text-xl font-bold mb-2">{name}</h3>

      <p className="text-gray-600 text-sm mb-4">{ingredients.join(", ")}</p>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Rozmiar:</label>
        <div className="flex gap-2">
          {sizes.map((sizeOption) => (
            <button
              key={sizeOption.size}
              onClick={() => setSelectedSize(sizeOption)}
              className={`px-3 py-1 rounded border ${
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

      <div className="flex items-center justify-between">
        <span className="text-lg font-bold">{selectedSize.price} zł</span>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors">
          Dodaj do koszyka
        </button>
      </div>
    </div>
  );
};
