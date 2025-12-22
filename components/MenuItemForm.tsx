import React, { useState } from "react";

interface MenuItemSize {
  size: number;
  price: number;
}

export default function MenuItemForm({ item, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    imageUrl: item?.imageUrl || "",
    ingredients: item?.ingredients?.join(", ") || "",
    category: item?.category || "pizza",
    sizes: item?.sizes || [{ size: 30, price: 0 }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ingredientsArr = formData.ingredients
      .split(",")
      .map((i: string) => i.trim())
      .filter((i: string) => i.length > 0);
    for (const ingredient of ingredientsArr) {
      try {
        await createIngredient(ingredient);
      } catch (err) {
        console.error("Failed to create ingredient", ingredient, err);
      }
    }
    onSave({
      name: formData.name,
      imageUrl: formData.imageUrl,
      ingredients: ingredientsArr,
      category: formData.category,
      sizes: formData.sizes,
    });
  };

  const addSize = () => {
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { size: 0, price: 0 }],
    });
  };

  const removeSize = (index: number) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((_: any, i: number) => i !== index),
    });
  };

  const updateSize = (
    index: number,
    field: "size" | "price",
    value: number
  ) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setFormData({ ...formData, sizes: newSizes });
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
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            setFormData({ ...formData, imageUrl: e.target.value })
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
            setFormData({ ...formData, category: e.target.value as any })
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
          Ingredients (comma-separated)
        </label>
        <textarea
          required
          value={formData.ingredients}
          onChange={(e) =>
            setFormData({ ...formData, ingredients: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Sizes & Prices
        </label>
        {formData.sizes.map((size: MenuItemSize, index: number) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="number"
              placeholder="Size"
              required
              value={size.size}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateSize(index, "size", parseInt(e.target.value))
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
            />
            <input
              type="number"
              placeholder="Price"
              required
              value={size.price}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateSize(index, "price", parseFloat(e.target.value))
              }
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

async function createIngredient(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return;
  const res = await fetch("/api/ingredient", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: trimmed }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    let msg = "Error adding ingredient";
    if (data?.error && /unique|exists|duplicate/i.test(data.error)) {
      msg = "Ingredient already in database";
    }
    throw new Error(msg);
  }
  return await res.json();
}
