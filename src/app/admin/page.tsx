"use client";
import { useState, useEffect, Key } from "react";

// import { useMenu } from "../../../context/MenuContext";
import { useOrders } from "../../../context/OrdersContext";
import Link from "next/link";
// import { createIngredient } from "../../actions/actions";

interface MenuItemSize {
  size: number;
  price: number;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"menu" | "orders">("orders");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-orange-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Admin Panel - Next Pizza</h1>
            <Link
              href="/"
              className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Back to Site
            </Link>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === "orders"
                  ? "bg-orange-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab("menu")}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === "menu"
                  ? "bg-orange-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Menu Management
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === "orders" ? <OrdersList /> : <MenuManager />}
        </div>
      </div>
    </div>
  );
}

// OrdersList Component
function OrdersList() {
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const [filter, setFilter] = useState<
    "all" | "pending" | "preparing" | "ready"
  >("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orders && Array.isArray(orders)) {
      setLoading(false);
    }
  }, [orders]);

  const filteredOrders =
    filter === "all"
      ? orders.filter(
          (o) => o.status !== "delivered" && o.status !== "cancelled"
        )
      : orders.filter((o) => o.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
        <div className="flex gap-2">
          {["all", "pending", "preparing", "ready"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === status
                  ? "bg-orange-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg p-4 animate-pulse bg-gray-100"
            >
              <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-8 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No orders to display</p>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              {/* ...existing code... */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-lg text-gray-800">
                    Order #{order.id.slice(-6)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
              {/* ...existing code... */}
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Customer:
                  </p>
                  <p className="text-gray-600">{order.customerName}</p>
                  <p className="text-gray-600">{order.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Delivery:
                  </p>
                  <p className="text-gray-600">
                    {order.address}, {order.city} {order.zipCode}
                  </p>
                </div>
              </div>
              {/* ...existing code... */}
              <div className="mb-3">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Items:
                </p>
                <div className="space-y-1">
                  {order.items.map((item, idx) => (
                    <p key={idx} className="text-sm text-gray-600">
                      {item.quantity}x {item.name} ({item.size}) -{" "}
                      {item.price * item.quantity} zł
                    </p>
                  ))}
                </div>
                <p className="font-bold text-orange-600 mt-2">
                  Total: {order.totalPrice} zł
                </p>
              </div>
              {/* ...existing code... */}
              {order.notes && (
                <div className="mb-3 bg-yellow-50 p-2 rounded">
                  <p className="text-sm font-semibold text-gray-700">Notes:</p>
                  <p className="text-sm text-gray-600">{order.notes}</p>
                </div>
              )}
              {/* ...existing code... */}
              <div className="flex gap-2 flex-wrap">
                {order.status === "pending" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "preparing")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === "preparing" && (
                  <>
                    <button
                      onClick={() => updateOrderStatus(order.id, "pending")}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
                    >
                      Back to Pending
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, "ready")}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      Mark as Ready
                    </button>
                  </>
                )}
                {order.status === "ready" && (
                  <>
                    <button
                      onClick={() => updateOrderStatus(order.id, "preparing")}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
                    >
                      Back to Preparing
                    </button>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to mark this order as delivered?"
                          )
                        ) {
                          updateOrderStatus(order.id, "delivered");
                        }
                      }}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition"
                    >
                      Mark as Delivered
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to delete this order?")
                    ) {
                      deleteOrder(order.id);
                    }
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// MenuManager Component
function MenuManager() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [categoryFilter, setCategoryFilter] = useState<
    "pizza" | "sauces" | "drinks" | "ingredient"
  >("pizza");

  // Fetch menu items from API
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
        // Update menu item via API
        await fetch(`/api/products/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        // Add new menu item via API
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      // Refresh menu items
      const updated = await fetch("/api/products").then((r) => r.json());
      setMenuItems(updated);
    } catch {}
    setIsEditing(false);
    setEditingItem(null);
  };

  // Ingredient form state
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientMsg, setIngredientMsg] = useState<string | null>(null);

  // State for all ingredients from API
  const [ingredients, setIngredients] = useState<any[]>([]);

  // Load all ingredients on mount
  useEffect(() => {
    fetch("/api/ingredient")
      .then((res) => res.json())
      .then((data) => setIngredients(data))
      .catch(() => setIngredients([]));
  }, []);

  const handleIngredientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = ingredientName.trim();
    if (!name) return;
    // Check for duplicate (case-insensitive)
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
        // Try to parse error from API
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
      // Refresh ingredient list
      const updated = await fetch("/api/ingredient").then((r) => r.json());
      setIngredients(updated);
    } catch (err) {
      setIngredientMsg("Error adding ingredient");
    }
    setTimeout(() => setIngredientMsg(null), 2000);
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

      {/* Show ingredient form and list only for 'ingredient' category */}
      {categoryFilter === "ingredient" && (
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
      )}

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
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-900 mb-2">
                    Category: {item.category}
                  </p>
                  <p className="text-sm text-gray-900 mb-2">
                    Ingredients:{" "}
                    {item.ProductIngredient.map(
                      (ing: any) => ing.Ingredient.name
                    ).join(", ")}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {item.ProductSize.map(
                      (
                        size: { size: number; price: number },
                        idx: Key | null | undefined
                      ) => (
                        <span
                          key={idx}
                          className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-900"
                        >
                          {size.size}
                          {item.category === "pizza" ? "cm" : "ml"}:{" "}
                          {size.price} zł
                        </span>
                      )
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setIsEditing(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (
                        confirm("Are you sure you want to delete this item?")
                      ) {
                        await fetch(`/api/products/${item.id}`, {
                          method: "DELETE",
                        });
                        // Refresh menu items
                        const updated = await fetch("/api/products").then((r) =>
                          r.json()
                        );
                        setMenuItems(updated);
                      }
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// MenuItemForm Component

function MenuItemForm({
  item,
  onSave,
  onCancel,
}: {
  item: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
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
    // Add each ingredient individually
    for (const ingredient of ingredientsArr) {
      try {
        await createIngredient(ingredient);
      } catch (err) {
        // Optionally handle error for each ingredient
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
