import React, { useState, useEffect } from "react";

interface MenuItemSize {
  size: number;
  price: number;
}

interface Ingredient {
  id: string;
  name: string;
}

export default function MenuItemForm({ item, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    imageUrl: item?.imageUrl || "",
    ingredients: item?.ingredients || [],
    category: item?.category || "pizza",
    defaultPrice: item?.defaultPrice || 0,
    sizes: item?.sizes || [{ size: "30cm", price: 0 }],
  });

  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    fetch("/api/ingredients")
      .then((res) => res.json())
      .then((data) => setAllIngredients(data))
      .catch(() => setAllIngredients([]));
  }, []);

  // Toggle ingredient selection
  const toggleIngredient = (ingredient: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.includes(ingredient)
        ? prev.ingredients.filter((i: string) => i !== ingredient)
        : [...prev.ingredients, ingredient],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, imageUrl, ingredients, category, defaultPrice, sizes } =
      formData;
    onSave({
      name,
      imageUrl,
      ingredients,
      category,
      defaultPrice,
      sizes,
    });
  };

  const addSize = () => {
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: "", price: 0 }],
    }));
  };

  const removeSize = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  const updateSize = (
    index: number,
    field: "size" | "price",
    value: string | number
  ) => {
    setFormData((prev) => {
      const newSizes = [...prev.sizes];
      newSizes[index] = {
        ...newSizes[index],
        [field]: field === "price" ? Number(value) : value,
      };
      return { ...prev, sizes: newSizes };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Image URL
        </label>
        <input
          type="text"
          required
          value={formData.imageUrl}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, category: e.target.value }))
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
        >
          <option value="pizza">Pizza</option>
          <option value="sauces">Sauces</option>
          <option value="drinks">Drinks</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Default Price
        </label>
        <input
          type="number"
          required
          value={formData.defaultPrice}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              defaultPrice: Number(e.target.value),
            }))
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Ingredients
        </label>
        <div className="flex flex-wrap gap-2">
          {allIngredients.map((ingredient: Ingredient) => (
            <span
              key={ingredient.id}
              onClick={() => toggleIngredient(ingredient.name)}
              className={`cursor-pointer px-3 py-1 rounded-full border text-sm ${
                formData.ingredients.includes(ingredient.name)
                  ? "bg-orange-600 text-white border-orange-600"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-orange-100"
              }`}
            >
              {ingredient.name}
            </span>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Sizes & Prices
        </label>
        {formData.sizes.map((size: MenuItemSize, index: number) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Size"
              required
              value={String(size.size)}
              onChange={(e) => updateSize(index, "size", e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
            />
            <input
              type="number"
              placeholder="Price"
              required
              value={Number(size.price)}
              onChange={(e) => updateSize(index, "price", e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
            />
            {formData.sizes.length > 1 && (
              <button
                type="button"
                onClick={() => removeSize(index)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addSize}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          Add Size
        </button>
      </div>
      <div className="flex gap-2 mt-16">
        <button
          type="submit"
          className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
