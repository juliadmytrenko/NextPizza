import React from "react";

const AboutUs: React.FC = () => {
  return (
    <section id="about" className="about-us-section py-12 px-4 max-w-3xl mx-auto text-center scroll-mt-24">
      <h2 className="text-3xl font-bold mb-4">About Us</h2>
      <p className="text-lg mb-6">
        Welcome to NextPizza! We are passionate about delivering the freshest
        and most delicious pizzas right to your doorstep. Our team is dedicated
        to using only the highest quality ingredients and providing exceptional
        service to our valued customers.
      </p>
      <p className="text-lg mb-6">
        Whether you crave a classic Margherita, a spicy Pepperoni, or a custom
        creation, we have something for everyone. Thank you for choosing
        NextPizza – where every slice is made with love!
      </p>
      <p className="text-md text-gray-500">Serving you since 2025 🍕</p>
    </section>
  );
};

export default AboutUs;
