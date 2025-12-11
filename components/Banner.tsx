import React from "react";
import Image from "next/image";

export const Banner: React.FC = () => {
  return (
    <section className="h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Text */}
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900">
              Autentyczna Pizza
            </h1>
            <p className="text-xl text-gray-700">
              Kręcimy placki od ponad 25 lat, zachowując tradycyjne włoskie
              receptury i używając tylko najświeższych składników.
            </p>
            <div className="bg-orange-100 p-6 rounded-lg inline-block">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Godziny otwarcia
              </h3>
              <p className="text-3xl font-bold text-orange-600">
                12:00 - 22:00
              </p>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="relative h-[600px] rounded-lg overflow-hidden shadow-2xl">
            <Image
              src="/images/oven.webp"
              alt="Delicious pizza"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};
