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

  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const closeSnackbar = () => setSnackbar(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setMenuItems(data))
      .catch(() => setMenuItems([]));
  }, []);

  useEffect(() => {
    if (snackbar) {
      const timer = setTimeout(() => setSnackbar(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [snackbar]);

  const filteredItems = menuItems.filter
    ? menuItems.filter((item) => item.category === categoryFilter)
    : [];

  const handleSave = async (formData: any) => {
    try {
      let response;
      if (editingItem?.id) {
        response = await fetch(`/api/products/?id=${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        console.log("POSTING");
        console.log(formData);
        console.log(JSON.stringify(formData));
        response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400) {
          setSnackbar({
            message:
              "Validation error: " +
              (errorData.error?.[0]?.message || "Invalid data"),
            type: "error",
          });
        } else {
          setSnackbar({ message: "Error saving item", type: "error" });
        }
        setIsEditing(true);
        // setEditingItem(null);
        return;
      }

      const updated = await fetch("/api/products").then((r) => r.json());

      setMenuItems(updated);
      setSnackbar({ message: "Product saved successfully!", type: "success" });
    } catch (error) {
      alert("Error saving item");
      console.log(error);
      setSnackbar({ message: "Error saving item", type: "error" });
      setIsEditing(true);
      // setEditingItem(null);
    }
    setIsEditing(false);
    setEditingItem(null); // co tutaj dać?
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
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
      <div className="flex flex-wrap gap-2 mb-6">
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
            {cat}
          </button>
        ))}
      </div>
      {categoryFilter === "ingredient" && <IngredientForm />}
      {categoryFilter !== "ingredient" &&
        (isEditing ? (
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
            {filteredItems &&
              filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  setEditingItem={setEditingItem}
                  setIsEditing={setIsEditing}
                  setMenuItems={setMenuItems}
                />
              ))}
          </div>
        ))}
      {snackbar && (
        <div
          className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white transition
      ${snackbar.type === "success" ? "bg-green-600" : "bg-red-600"}`}
          style={{
            zIndex: 1000,
            minWidth: 220,
            display: "flex",
            alignItems: "center",
          }}
        >
          <span className="flex-1">{snackbar.message}</span>
          <button
            onClick={closeSnackbar}
            className="ml-4 px-2 py-1 text-orange-900 font-bold"
            aria-label="Close"
            style={{ fontSize: 18, lineHeight: 1, cursor: "pointer" }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
