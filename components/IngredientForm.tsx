import React, { useState } from "react";

export default function IngredientForm() {
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientMsg, setIngredientMsg] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<any[]>([]);

  React.useEffect(() => {
    fetch("/api/ingredient")
      .then((res) => res.json())
      .then((data) => setIngredients(data))
      .catch(() => setIngredients([]));
  }, []);

  const handleIngredientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = ingredientName.trim();
    if (!name) return;
    const exists = ingredients.some(
      (ing) => ing.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      setIngredientMsg("Ingredient already in database");
      setTimeout(() => setIngredientMsg(null), 2000);
      return;
    }
    try {
      const res = await fetch("/api/ingredient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        let msg = "Error adding ingredient";
        try {
          const data = await res.json();
          if (data?.error && /unique|exists|duplicate/i.test(data.error)) {
            msg = "Ingredient already in database";
          }
        } catch {}
        setIngredientMsg(msg);
        setTimeout(() => setIngredientMsg(null), 2000);
        return;
      }
      setIngredientMsg("Ingredient added!");
      setIngredientName("");
      const updated = await fetch("/api/ingredient").then((r) => r.json());
      setIngredients(updated);
    } catch (err) {
      setIngredientMsg("Error adding ingredient");
    }
    setTimeout(() => setIngredientMsg(null), 2000);
  };

  return (
    <>
      <form
        onSubmit={handleIngredientSubmit}
        className="mb-4 flex gap-2 items-end"
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Add Ingredient
          </label>
          <input
            type="text"
            value={ingredientName}
            onChange={(e) => setIngredientName(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
            placeholder="Ingredient name"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Add
        </button>
        {ingredientMsg && (
          <span className="ml-4 text-sm font-semibold text-gray-800 bg-gray-100 px-4 py-2 rounded-lg border border-gray-300">
            {ingredientMsg}
          </span>
        )}
      </form>
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          All Ingredients
        </label>
        <div className="flex flex-wrap gap-2">
          {ingredients.length === 0 ? (
            <span className="text-gray-500">No ingredients found.</span>
          ) : (
            ingredients.map((ing) => (
              <span
                key={ing.id}
                className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-900"
              >
                {ing.name}
              </span>
            ))
          )}
        </div>
      </div>
    </>
  );
}
