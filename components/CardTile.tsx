"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { usePathname } from "next/navigation";

interface CardTileInterface {
  name: string;
  image: string;
  ingredients?: { Ingredient: { name: string } }[];
  sizes?: { Size: { size: string; price: number } }[];
}

export const CardTile: React.FC<CardTileInterface> = (props) => {
  const { name, image, ingredients, sizes } = props;
  const { addToCart, setIsCartOpen } = useCart();
  const pathname = usePathname();
  const hideAddToCart = pathname === "/address" || pathname === "/checkout";

  const [selectedSize, setSelectedSize] = React.useState(sizes?.[0] ?? null);
  const handleAddToCart = () => {
    if (!selectedSize) return; // Prevent adding if no size is selected
    addToCart({
      name,
      size: selectedSize.Size.size,
      price: selectedSize.Size.price,
      image,
    });
    setIsCartOpen(true);
  };
  useEffect(() => {
    // console.log(props);
    // console.log(image);
    // console.log(ProductIngredient);
    // console.log(sizes);
    sizes?.forEach((size) => {
      console.log(size);
      console.log("-----------------");
      // console.log(size.size);
      // console.log(size.price);
    });
  }, [sizes]);

  // Fallback logic for image: only allow valid URLs or absolute paths
  const fallbackImage = "/images/fallback.png";
  function isValidImageSrc(src: string | undefined) {
    if (!src || typeof src !== "string" || src.trim().length === 0)
      return false;
    // Accept absolute URLs or root-relative paths
    return (
      src.startsWith("http://") ||
      src.startsWith("https://") ||
      src.startsWith("/")
    );
  }
  const imgSrc = isValidImageSrc(image) ? image : fallbackImage;

  return (
    <div className="rounded-xl p-3 sm:p-5 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col sm:flex-row gap-3 sm:gap-5 bg-gradient-to-br from-white to-orange-50 border-2 border-orange-400">
      <div className="relative w-full sm:w-48 h-48 flex-shrink-0 rounded-lg shadow-md">
        <Image
          src={imgSrc}
          alt={name}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold mb-2 text-orange-700">
            {name}
          </h3>
          <div className="mb-3 sm:mb-4">
            <label className="block text-sm font-semibold mb-1 text-gray-800">
              Ingredients:
            </label>
            <p className="text-gray-600 text-xs sm:text-sm">
              {ingredients && ingredients.length > 0
                ? ingredients.map((ing) => ing.Ingredient.name).join(", ")
                : "No ingredients"}
            </p>
          </div>
        </div>

        <div>
          <div className="mb-3 sm:mb-4">
            <label className="block text-sm font-semibold mb-2 text-gray-800">
              Size:
            </label>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(sizes) ? sizes : []).map((sizeOption, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSize(sizeOption)}
                  className={`px-2 py-0.5 rounded border text-sm ${
                    selectedSize &&
                    selectedSize.Size.size === sizeOption.Size.size
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {sizeOption.Size.size}cm
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <span className="text-xl sm:text-2xl font-bold text-orange-600">
              {selectedSize?.Size.price} zł
            </span>
            {!hideAddToCart && (
              <button
                onClick={handleAddToCart}
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 sm:px-3 sm:py-1.5 text-sm rounded-md transition-colors"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
