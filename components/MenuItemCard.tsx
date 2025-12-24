import React from "react";

export default function MenuItemCard({
  item,
  setEditingItem,
  setIsEditing,
  setMenuItems,
}: any) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
          <p className="text-sm text-gray-900 mb-2">
            Category: {item.category}
          </p>
          <p className="text-sm text-gray-900 mb-2">
            Ingredients:{" "}
            {item.ProductIngredient.map((ing: any) => ing.Ingredient.name).join(
              ", "
            )}
          </p>
          <div className="flex gap-2 flex-wrap">
            {item.ProductSize.map((size: any, idx: number) => (
              <span
                key={idx}
                className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-900"
              >
                {size.Size?.size ?? size.size}:{" "}
                {size.price ?? size.Size?.price ?? ""} zł
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingItem(item);
              setIsEditing(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            style={{ cursor: "pointer" }}
          >
            Edit
          </button>
          <button
            onClick={async () => {
              if (confirm("Are you sure you want to delete this item?")) {
                await fetch(`/api/products/?id=${item.id}`, {
                  method: "DELETE",
                });
                const updated = await fetch("/api/products").then((r) =>
                  r.json()
                );
                setMenuItems(updated);
              }
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            style={{ cursor: "pointer" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
