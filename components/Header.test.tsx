import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { Header } from "./Header";
import { CartProvider } from "../context/CartContext";
import { usePathname } from "next/navigation";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePathname).mockReturnValue("/");
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the logo", () => {
    render(
      <CartProvider>
        <Header />
      </CartProvider>
    );

    const logo = screen.getByAltText("Next Pizza");
    expect(logo).toBeInTheDocument();
  });

  it("renders all navigation links in desktop view", () => {
    render(
      <CartProvider>
        <Header />
      </CartProvider>
    );

    // Use getAllByText since links appear in both desktop and mobile nav
    expect(screen.getAllByText("Pizzas").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Sauces").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Drinks").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("About").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Contact").length).toBeGreaterThanOrEqual(1);
  });

  it("shows cart button on main page", () => {
    vi.mocked(usePathname).mockReturnValue("/");

    render(
      <CartProvider>
        <Header />
      </CartProvider>
    );

    const cartButton = screen.getByLabelText("Open cart");
    expect(cartButton).toBeInTheDocument();
  });

  it("hides cart button on address page", () => {
    vi.mocked(usePathname).mockReturnValue("/address");

    render(
      <CartProvider>
        <Header />
      </CartProvider>
    );

    expect(screen.queryByLabelText("Open cart")).not.toBeInTheDocument();
  });

  it("hides cart button on checkout page", () => {
    vi.mocked(usePathname).mockReturnValue("/checkout");

    render(
      <CartProvider>
        <Header />
      </CartProvider>
    );

    expect(screen.queryByLabelText("Open cart")).not.toBeInTheDocument();
  });

  it("toggles mobile menu when menu button is clicked", () => {
    render(
      <CartProvider>
        <Header />
      </CartProvider>
    );

    const menuButton = screen.getByLabelText("Toggle menu");

    // Initially, mobile menu links shouldn't be visible (checked differently)
    fireEvent.click(menuButton);

    // After click, menu should be open - verify by checking if navigation links appear twice
    const pizzasLinks = screen.getAllByText("Pizzas");
    expect(pizzasLinks.length).toBeGreaterThan(1); // Desktop + Mobile
  });

  it("closes mobile menu when link is clicked", () => {
    render(
      <CartProvider>
        <Header />
      </CartProvider>
    );

    const menuButton = screen.getByLabelText("Toggle menu");
    fireEvent.click(menuButton);

    // Get mobile menu link (should be the second one)
    const pizzasLinks = screen.getAllByText("Pizzas");
    fireEvent.click(pizzasLinks[1]); // Click mobile menu link

    // Menu should close - only desktop link remains
    const updatedPizzasLinks = screen.getAllByText("Pizzas");
    expect(updatedPizzasLinks.length).toBe(1);
  });

  it("logo links to home page", () => {
    render(
      <CartProvider>
        <Header />
      </CartProvider>
    );

    const logoLink = screen.getByAltText("Next Pizza").closest("a");
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("navigation links have correct hrefs", () => {
    render(
      <CartProvider>
        <Header />
      </CartProvider>
    );

    const pizzasLink = screen.getAllByText("Pizzas")[0].closest("a");
    const saucesLink = screen.getAllByText("Sauces")[0].closest("a");
    const drinksLink = screen.getAllByText("Drinks")[0].closest("a");
    const aboutLink = screen.getAllByText("About")[0].closest("a");
    const contactLink = screen.getAllByText("Contact")[0].closest("a");

    expect(pizzasLink).toHaveAttribute("href", "/#pizzas");
    expect(saucesLink).toHaveAttribute("href", "/#sauces");
    expect(drinksLink).toHaveAttribute("href", "/#drinks");
    expect(aboutLink).toHaveAttribute("href", "/#about");
    expect(contactLink).toHaveAttribute("href", "/#contact");
  });
});
