"use client";
import React from "react";
import { useCart } from "../context/CartContext";
import Image from "next/image";

export const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsCartOpen(!isCartOpen)}
        className="fixed bottom-6 right-6 z-30 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110"
      >
        <span className="text-2xl">🛒</span>
        {getTotalItems() > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {getTotalItems()}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-white hover:text-gray-200 text-3xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <p className="text-xl">Your cart is empty</p>
                  <p className="text-sm mt-2">Add some delicious items!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="border border-orange-200 rounded-lg p-4 bg-gradient-to-br from-white to-orange-50"
                    >
                      <div className="flex gap-3">
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-orange-700">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Size: {item.size}cm
                          </p>
                          <p className="text-sm font-bold text-orange-600 mt-1">
                            {item.price} zł
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 font-bold text-xl"
                        >
                          ×
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-sm font-semibold text-gray-700">
                          Quantity:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="bg-orange-500 hover:bg-orange-600 text-white w-7 h-7 rounded-md font-bold"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="bg-orange-500 hover:bg-orange-600 text-white w-7 h-7 rounded-md font-bold"
                          >
                            +
                          </button>
                        </div>
                        <span className="ml-auto font-bold text-gray-800">
                          {item.price * item.quantity} zł
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t-2 border-orange-200 p-6 bg-gradient-to-r from-white to-orange-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-gray-800">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-orange-600">
                    {getTotalPrice()} zł
                  </span>
                </div>
                <div className="space-y-2">
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-bold text-lg transition-colors">
                    Checkout
                  </button>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-orange-200 hover:bg-orange-300 text-orange-800 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Kontynuuj zakupy
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
