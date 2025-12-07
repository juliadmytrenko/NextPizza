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
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow flex gap-4">
      <div className="relative w-48 h-48 flex-shrink-0">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover rounded-md"
        />
      </div>

      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-xl font-bold mb-2">{name}</h3>
          <p className="text-gray-600 text-sm mb-4">{ingredients.join(", ")}</p>
        </div>

        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rozmiar:</label>
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
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 text-sm rounded-md transition-colors">
              Dodaj do koszyka
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
