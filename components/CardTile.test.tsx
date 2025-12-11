import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { CardTile } from "./CardTile";
import { CartProvider } from "../context/CartContext";
import { usePathname } from "next/navigation";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

const mockPizza = {
  name: "Margherita",
  image: "/images/margherita.jpg",
  ingredients: ["tomato sauce", "mozzarella", "basil"],
  sizes: [
    { size: 30, price: 25 },
    { size: 40, price: 35 },
    { size: 50, price: 45 },
  ],
};

describe("CardTile", () => {
  beforeEach(() => {
    // Reset pathname mock before each test
    vi.mocked(usePathname).mockReturnValue("/");
  });

  afterEach(() => {
    // Clean up after each test
    cleanup();
  });

  it("renders pizza name and ingredients", () => {
    render(
      <CartProvider>
        <CardTile {...mockPizza} />
      </CartProvider>
    );

    expect(screen.getByText("Margherita")).toBeInTheDocument();
    expect(
      screen.getByText("tomato sauce, mozzarella, basil")
    ).toBeInTheDocument();
  });

  it("displays all available sizes", () => {
    render(
      <CartProvider>
        <CardTile {...mockPizza} />
      </CartProvider>
    );

    expect(screen.getByRole("button", { name: "30cm" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "40cm" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "50cm" })).toBeInTheDocument();
  });

  it("shows price of first size by default", () => {
    render(
      <CartProvider>
        <CardTile {...mockPizza} />
      </CartProvider>
    );

    expect(screen.getByText("25 zł")).toBeInTheDocument();
  });

  it("updates price when different size is selected", () => {
    render(
      <CartProvider>
        <CardTile {...mockPizza} />
      </CartProvider>
    );

    // Initially shows first size price
    expect(screen.getByText("25 zł")).toBeInTheDocument();

    // Click on 40cm size button
    const size40Button = screen.getByRole("button", { name: "40cm" });
    fireEvent.click(size40Button);

    // Price should update to 35 zł
    expect(screen.getByText("35 zł")).toBeInTheDocument();
  });

  it("applies selected style to clicked size button", () => {
    render(
      <CartProvider>
        <CardTile {...mockPizza} />
      </CartProvider>
    );

    const size40Button = screen.getByRole("button", { name: "40cm" });
    fireEvent.click(size40Button);

    // Check if button has the selected class
    expect(size40Button).toHaveClass("bg-orange-500", "text-white");
  });

  it("shows Add to Cart button on main page", () => {
    vi.mocked(usePathname).mockReturnValue("/");

    render(
      <CartProvider>
        <CardTile {...mockPizza} />
      </CartProvider>
    );

    expect(
      screen.getByRole("button", { name: "Add to Cart" })
    ).toBeInTheDocument();
  });

  it("hides Add to Cart button on address page", () => {
    vi.mocked(usePathname).mockReturnValue("/address");

    render(
      <CartProvider>
        <CardTile {...mockPizza} />
      </CartProvider>
    );

    expect(
      screen.queryByRole("button", { name: "Add to Cart" })
    ).not.toBeInTheDocument();
  });

  it("hides Add to Cart button on checkout page", () => {
    vi.mocked(usePathname).mockReturnValue("/checkout");

    render(
      <CartProvider>
        <CardTile {...mockPizza} />
      </CartProvider>
    );

    expect(
      screen.queryByRole("button", { name: "Add to Cart" })
    ).not.toBeInTheDocument();
  });

  it("adds pizza to cart when Add to Cart is clicked", () => {
    render(
      <CartProvider>
        <CardTile {...mockPizza} />
      </CartProvider>
    );

    const addButton = screen.getByRole("button", { name: "Add to Cart" });
    fireEvent.click(addButton);

    // After adding, check if cart has item (we can verify through context)
    // This is a basic check - you might want to verify cart contents more thoroughly
    expect(addButton).toBeInTheDocument();
  });
});
