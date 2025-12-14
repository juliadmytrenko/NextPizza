import type { Metadata } from "next";
import { Lobster, Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "../../components/Header";
import { Main } from "../../components/Main";
import { Footer } from "../../components/Footer";
import { CartProvider } from "../../context/CartContext";
import { AddressProvider } from "../../context/AddressContext";
import { MenuProvider } from "../../context/MenuContext";
import { OrdersProvider } from "../../context/OrdersContext";
import { Cart } from "../../components/Cart";

const lobster = Lobster({
  weight: "400",
  variable: "--font-lobster",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Next Pizza - Delicious Pizza Delivered",
  description:
    "Order delicious pizza online with Next Pizza. Fast delivery, fresh ingredients, and amazing taste!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${lobster.variable} antialiased flex flex-col min-h-screen`}
      >
        <MenuProvider>
          <OrdersProvider>
            <AddressProvider>
              <CartProvider>
                <Header></Header>
                <Main>{children}</Main>
                <Footer></Footer>
                <Cart />
              </CartProvider>
            </AddressProvider>
          </OrdersProvider>
        </MenuProvider>
      </body>
    </html>
  );
}
