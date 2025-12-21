"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../../context/CartContext";
import { useAddress } from "../../../context/AddressContext";
import { useOrders } from "../../../context/OrdersContext";
import { useState } from "react";
import Image from "next/image";
import { isValidImageSrc } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getTotalPrice, clearCart } = useCart();
  const { addressData } = useAddress();
  const { addOrder } = useOrders();
  const [paymentMethod, setPaymentMethod] = useState<"blik" | "card" | "cash">(
    "blik"
  );

  useEffect(() => {
    if (!addressData) {
      router.push("/address");
    }
  }, [addressData, router]);

  const handleConfirmOrder = () => {
    if (!addressData || cart.length === 0) {
      return;
    }

    addOrder({
      items: cart.map((item) => ({
        name: item.name,
        size: Number(item.size),
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      totalPrice: getTotalPrice(),
      customerName: `${addressData.firstName} ${addressData.lastName}`,
      phone: addressData.phone,
      email: addressData.email,
      address: addressData.street,
      city: addressData.city,
      zipCode: addressData.postalCode,
      notes: addressData.additionalInfo,
      paymentMethod,
    });

    clearCart();
    alert(
      "Order placed successfully! Check the admin panel to see your order."
    );
    router.push("/");
  };

  if (!addressData) {
    return null;
  }

  // Fallback logic for image: only allow valid URLs or absolute paths
  const fallbackImage = "/images/fallback.png";

  return (
    <div className="flex min-h-screen items-center justify-center font-sans bg-black">
      <main className="flex min-h-screen w-full max-w-6xl flex-col items-center justify-center py-8 sm:py-12 md:py-16 px-4 sm:px-8 md:px-16">
        <div className="w-full max-w-4xl space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-orange-700 text-center mb-8">
            Checkout
          </h1>

          {/* Cart Items */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-orange-700 mb-4">
              Your Order
            </h2>
            <div className="border-2 border-orange-200 rounded-xl p-4 sm:p-6 shadow-lg bg-gradient-to-br from-white to-orange-50">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  Your cart is empty
                </p>
              ) : (
                <>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 sm:gap-4 py-3 border-b border-orange-200 last:border-b-0"
                      >
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={
                              isValidImageSrc(item.image)
                                ? item.image
                                : fallbackImage
                            }
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-2">
                          <div>
                            <p className="font-bold text-orange-700 text-base sm:text-lg">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Size: {item.size}cm | Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="font-bold text-orange-600 text-lg">
                            {item.price * item.quantity} zł
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-4 mt-4 border-t-2 border-orange-300">
                    <span className="text-xl sm:text-2xl font-bold text-gray-800">
                      Total:
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-orange-600">
                      {getTotalPrice()} zł
                    </span>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Delivery Address - Display Only */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-orange-700 mb-4">
              Delivery Address
            </h2>
            <div className="border-2 border-orange-200 rounded-xl p-4 sm:p-6 shadow-lg bg-gradient-to-br from-white to-orange-50 space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Name</p>
                <p className="text-base sm:text-lg text-gray-800">
                  {addressData.firstName} {addressData.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Contact
                </p>
                <p className="text-base sm:text-lg text-gray-800">
                  {addressData.email}
                </p>
                <p className="text-base sm:text-lg text-gray-800">
                  {addressData.phone}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Address
                </p>
                <p className="text-base sm:text-lg text-gray-800">
                  {addressData.street}
                </p>
                <p className="text-base sm:text-lg text-gray-800">
                  {addressData.city}, {addressData.postalCode}
                </p>
                <p className="text-base sm:text-lg text-gray-800">
                  {addressData.country}
                </p>
              </div>
              {addressData.additionalInfo && (
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Additional Information
                  </p>
                  <p className="text-base sm:text-lg text-gray-800">
                    {addressData.additionalInfo}
                  </p>
                </div>
              )}
              <a
                href="/address"
                className="inline-block text-orange-600 hover:text-orange-700 font-bold mt-2 underline"
              >
                Edit Address
              </a>
            </div>
          </section>

          {/* Payment Method */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-orange-700 mb-4">
              Payment Method
            </h2>
            <div className="border-2 border-orange-200 rounded-xl p-4 sm:p-6 shadow-lg bg-gradient-to-br from-white to-orange-50 space-y-3">
              <label className="flex items-center p-3 sm:p-4 border-2 border-orange-200 rounded-lg cursor-pointer hover:bg-orange-100 hover:border-orange-400 transition-all">
                <input
                  type="radio"
                  name="payment"
                  value="blik"
                  checked={paymentMethod === "blik"}
                  onChange={() => setPaymentMethod("blik")}
                  className="mr-3 w-4 h-4 text-orange-600"
                />
                <span className="font-semibold text-gray-800">BLIK</span>
              </label>
              <label className="flex items-center p-3 sm:p-4 border-2 border-orange-200 rounded-lg cursor-pointer hover:bg-orange-100 hover:border-orange-400 transition-all">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="mr-3 w-4 h-4 text-orange-600"
                />
                <span className="font-semibold text-gray-800">
                  Card Payment
                </span>
              </label>
              <label className="flex items-center p-3 sm:p-4 border-2 border-orange-200 rounded-lg cursor-pointer hover:bg-orange-100 hover:border-orange-400 transition-all">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                  className="mr-3 w-4 h-4 text-orange-600"
                />
                <span className="font-semibold text-gray-800">
                  Cash on Delivery
                </span>
              </label>
            </div>
          </section>

          {/* Confirm Order Button */}
          <button
            onClick={handleConfirmOrder}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg text-lg sm:text-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            Confirm Order - {getTotalPrice()} zł
          </button>
        </div>
      </main>
    </div>
  );
}
