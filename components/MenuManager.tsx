import { useState, useEffect, Key } from "react";
import { useMenu } from "../context/MenuContext";
import MenuItemForm from "./MenuItemForm";
import MenuItemCard from "./MenuItemCard";
import IngredientForm from "./IngredientForm";
import { error } from "console";

export default function MenuManager({}: any) {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [categoryFilter, setCategoryFilter] = useState<
    "pizza" | "sauces" | "drinks" | "ingredient"
  >("pizza");

  const MenuContext = useMenu();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setMenuItems(data))
      .catch(() => setMenuItems([]));
  }, []);

  const filteredItems = menuItems.filter(
    (item) => item.category === categoryFilter
  );

  const handleSave = async (formData: any) => {
    try {
      if (editingItem?.id) {
        await fetch(`/api/products/?id=${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        console.log("POSTING");
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      const updated = await fetch("/api/products").then((r) => r.json());
      setMenuItems(updated);
    } catch (error) {
      alert("Error saving item");
      console.log(error);
      setIsEditing(false);
      setEditingItem(null);
    }
    setIsEditing(false);
    setEditingItem(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Menu Management</h2>
        {categoryFilter !== "ingredient" ? (
          isEditing ? (
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingItem(null);
              }}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
              style={{ minWidth: 140, minHeight: 44 }}
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={() => {
                setIsEditing(true);
                setEditingItem(null);
              }}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition"
              style={{ minWidth: 140, minHeight: 44 }}
            >
              Add New Item
            </button>
          )
        ) : (
          <div style={{ minWidth: 140, minHeight: 44 }}></div>
        )}
      </div>
      <div className="flex gap-2 mb-6">
        {["pizza", "sauces", "drinks", "ingredient"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat as any)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              categoryFilter === cat
                ? "bg-orange-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      {categoryFilter === "ingredient" && <IngredientForm />}
      {isEditing ? (
        <MenuItemForm
          item={editingItem}
          onSave={handleSave}
          onCancel={() => {
            setIsEditing(false);
            setEditingItem(null);
          }}
        />
      ) : (
        <div className="grid gap-4">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              setEditingItem={setEditingItem}
              setIsEditing={setIsEditing}
              setMenuItems={setMenuItems}
            />
          ))}
        </div>
      )}
    </div>
  );
}
