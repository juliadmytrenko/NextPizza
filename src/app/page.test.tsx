import { render, screen, cleanup } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import Home from "./page";
import { CartProvider } from "../../context/CartContext";

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Home Page", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders Banner component", () => {
    render(
      <CartProvider>
        <Home />
      </CartProvider>
    );

    expect(screen.getByText("11:00 - 23:00")).toBeInTheDocument();
  });

  it("renders Pizzas section heading", () => {
    render(
      <CartProvider>
        <Home />
      </CartProvider>
    );

    expect(screen.getByRole("heading", { name: "Pizzas" })).toBeInTheDocument();
  });

  it("renders Sauces section heading", () => {
    render(
      <CartProvider>
        <Home />
      </CartProvider>
    );

    expect(screen.getByRole("heading", { name: "Sauces" })).toBeInTheDocument();
  });

  it("renders Drinks section heading", () => {
    render(
      <CartProvider>
        <Home />
      </CartProvider>
    );

    expect(screen.getByRole("heading", { name: "Drinks" })).toBeInTheDocument();
  });

  it("renders About Us section", () => {
    render(
      <CartProvider>
        <Home />
      </CartProvider>
    );

    expect(
      screen.getByRole("heading", { name: "About Us" })
    ).toBeInTheDocument();
    expect(screen.getByText(/Welcome to Next Pizza!/i)).toBeInTheDocument();
  });

  it("renders Contact section", () => {
    render(
      <CartProvider>
        <Home />
      </CartProvider>
    );

    expect(
      screen.getByRole("heading", { name: "Contact" })
    ).toBeInTheDocument();
    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByText("Get in Touch")).toBeInTheDocument();
  });

  it("displays contact information", () => {
    render(
      <CartProvider>
        <Home />
      </CartProvider>
    );

    expect(screen.getByText(/123 Pizza Street/i)).toBeInTheDocument();
    expect(screen.getByText(/\+1 \(555\) 123-4567/i)).toBeInTheDocument();
    expect(screen.getByText(/info@nextpizza.com/i)).toBeInTheDocument();
  });

  it("displays business hours in contact section", () => {
    render(
      <CartProvider>
        <Home />
      </CartProvider>
    );

    expect(
      screen.getByText(/Mon-Sun 11:00 AM - 11:00 PM/i)
    ).toBeInTheDocument();
  });

  it("renders pizza items", () => {
    render(
      <CartProvider>
        <Home />
      </CartProvider>
    );

    expect(screen.getByText("Margherita")).toBeInTheDocument();
    expect(screen.getByText("Pepperoni")).toBeInTheDocument();
    expect(screen.getByText("Hawaiian")).toBeInTheDocument();
  });

  it("renders sauce items", () => {
    render(
      <CartProvider>
        <Home />
      </CartProvider>
    );

    expect(screen.getByText("Garlic sauce")).toBeInTheDocument();
    expect(screen.getByText("BBQ sauce")).toBeInTheDocument();
    expect(screen.getByText("Spicy sauce")).toBeInTheDocument();
  });

  it("renders drink items", () => {
    render(
      <CartProvider>
        <Home />
      </CartProvider>
    );

    expect(screen.getByText("Coca-Cola")).toBeInTheDocument();
    expect(screen.getByText("Sprite")).toBeInTheDocument();
    expect(screen.getByText("Orange juice")).toBeInTheDocument();
    expect(screen.getByText("Mineral water")).toBeInTheDocument();
  });

  it("has proper section IDs for navigation", () => {
    const { container } = render(
      <CartProvider>
        <Home />
      </CartProvider>
    );

    expect(container.querySelector("#pizzas")).toBeInTheDocument();
    expect(container.querySelector("#sauces")).toBeInTheDocument();
    expect(container.querySelector("#drinks")).toBeInTheDocument();
    expect(container.querySelector("#about")).toBeInTheDocument();
    expect(container.querySelector("#contact")).toBeInTheDocument();
  });
});
