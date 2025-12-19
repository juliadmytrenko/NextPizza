"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { usePathname } from "next/navigation";

interface IngredientObj {
  Ingredient: { name: string };
}

interface CardTileProps {
  name: string;
  image: string;
  ingredients?: IngredientObj[];
  sizes: { size: number; price: number }[] | null | undefined;
}

export const CardTile: React.FC<CardTileProps> = (props) => {
  const { name, image, ProductIngredient, sizes } = props;
  const ingredients = Array.isArray(ProductIngredient)
    ? ProductIngredient.map((ing) => ing.Ingredient?.name).filter(Boolean)
    : [];
  const { addToCart, setIsCartOpen } = useCart();
  const pathname = usePathname();
  const hideAddToCart = pathname === "/address" || pathname === "/checkout";

  const [selectedSize, setSelectedSize] = React.useState(
    sizes && sizes.length > 0 ? sizes[0] : { size: 0, price: 0 }
  );
  const handleAddToCart = () => {
    addToCart({
      name,
      size: selectedSize.size,
      price: selectedSize.price,
      image,
    });
    setIsCartOpen(true);
  };
  useEffect(() => {
    console.log(props);
    // console.log(image);
    // console.log(ProductIngredient);
    // console.log(sizes);
  }, []);

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
              {ingredients.length > 0
                ? ingredients.join(", ")
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
              {sizes}
              {(Array.isArray(sizes) ? sizes : []).map((sizeOption) => (
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

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <span className="text-xl sm:text-2xl font-bold text-orange-600">
              {selectedSize.price} zł
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
