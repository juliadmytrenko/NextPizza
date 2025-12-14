"use client";
import { useState } from "react";
import { useMenu } from "../../../context/MenuContext";
import { useOrders } from "../../../context/OrdersContext";
import Link from "next/link";

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

      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No orders to display</p>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
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

              <div className="mb-3">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Items:
                </p>
                <div className="space-y-1">
                  {order.items.map((item, idx) => (
                    <p key={idx} className="text-sm text-gray-600">
                      {item.quantity}x {item.name} ({item.size}cm) -{" "}
                      {item.price * item.quantity} zł
                    </p>
                  ))}
                </div>
                <p className="font-bold text-orange-600 mt-2">
                  Total: {order.totalPrice} zł
                </p>
              </div>

              {order.notes && (
                <div className="mb-3 bg-yellow-50 p-2 rounded">
                  <p className="text-sm font-semibold text-gray-700">Notes:</p>
                  <p className="text-sm text-gray-600">{order.notes}</p>
                </div>
              )}

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
                  <button
                    onClick={() => updateOrderStatus(order.id, "ready")}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Mark as Ready
                  </button>
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
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useMenu();
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "pizza" | "sauces" | "drinks"
  >("all");

  const filteredItems =
    categoryFilter === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === categoryFilter);

  const handleSave = (formData: any) => {
    if (editingItem?.id) {
      updateMenuItem(editingItem.id, formData);
    } else {
      addMenuItem(formData);
    }
    setIsEditing(false);
    setEditingItem(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Menu Management</h2>
        <button
          onClick={() => {
            setIsEditing(true);
            setEditingItem(null);
          }}
          className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition"
        >
          Add New Item
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {["all", "pizza", "sauces", "drinks"].map((cat) => (
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
                  <h3 className="text-xl font-bold text-gray-800">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-800 mb-2">
                    Category: {item.category}
                  </p>
                  <p className="text-sm text-gray-800 mb-2">
                    Ingredients: {item.ingredients.join(", ")}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {item.sizes.map((size, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-800"
                      >
                        {size.size}
                        {item.category === "pizza" ? "cm" : "ml"}: {size.price}{" "}
                        zł
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
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this item?")
                      ) {
                        deleteMenuItem(item.id);
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
    image: item?.image || "",
    ingredients: item?.ingredients?.join(", ") || "",
    category: item?.category || "pizza",
    sizes: item?.sizes || [{ size: 30, price: 0 }],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      image: formData.image,
      ingredients: formData.ingredients.split(",").map((i: string) => i.trim()),
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Image URL
        </label>
        <input
          type="text"
          required
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Price"
              required
              value={size.price}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateSize(index, "price", parseFloat(e.target.value))
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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

      <div className="flex gap-2">
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
