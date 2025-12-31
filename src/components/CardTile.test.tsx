import { render, screen } from "@testing-library/react";
import { CardTile } from "./CardTile";
import { CartProvider } from "../context/CartContext";
import { size } from "zod";

describe("CardTile Component", () => {
  it("renders the component with required props", () => {
    render(
      <CartProvider>
        <CardTile name="Test Product" imageUrl="/test-image.jpg" />
      </CartProvider>
    );
    const nameElement = screen.getByText("Test Product");
    expect(nameElement).toBeInTheDocument();
  });

  // todo: solve images with the same text
  it("displays fallback image on invalid image URL", () => {
    render(
      <CartProvider>
        <CardTile name="Test Product" imageUrl="invalid-url" />
      </CartProvider>
    );
    const imgElement = screen.getByAltText("Test Product") as HTMLImageElement;
    expect(
      imgElement.src.endsWith("/images/fallback.png") ||
        (imgElement.src.includes("/_next/image") &&
          imgElement.src.includes("%2Fimages%2Ffallback.png")) // because of Next.js image optimization
      // appears because Next.js automatically optimizes images when you use the <Image /> component from next/image.
      // Instead of serving the image directly from /images/fallback.png, Next.js routes the request through its own image optimization server (/_next/image?...). This allows images to be automatically resized, compressed, and cached.
    ).toBe(true);
  });

  // test for checking if the number of rendered buttons matches the number of sizes provided
  it("renders size options when sizes prop is provided", () => {
    const sizes = [
      { sizeName: "Small", price: 5 },
      { sizeName: "Medium", price: 7 },
      { sizeName: "Large", price: 9 },
    ];

    render(
      <CartProvider>
        <CardTile
          name="Test Product"
          imageUrl="/test-image.jpg"
          sizes={sizes}
        />
      </CartProvider>
    );

    // Find each button by its accessible name (the sizeName)
    sizes.forEach((size) => {
      expect(
        screen.getByRole("button", { name: size.sizeName })
      ).toBeInTheDocument();
    });

    // Optionally, check the total number of size buttons
    const allButtons = screen.getAllByRole("button", {
      name: /Small|Medium|Large/,
    });
    expect(allButtons.length).toBe(sizes.length);
  });

  it("display size name in button text", () => {
    const sizes = [
      { sizeName: "250ml", price: 6 },
      { sizeName: "500ml", price: 8 },
      { sizeName: "1L", price: 15 },
    ];
    render(
      <CartProvider>
        <CardTile
          name="Test Product"
          imageUrl="/test-image.jpg"
          sizes={sizes}
        />
      </CartProvider>
    );

    // Check if each size name is in the button name prop
    sizes.forEach((size) => {
      expect(
        screen.getByRole("button", { name: size.sizeName })
      ).toBeInTheDocument();
    });
    // Additionally, check if size names are displayed in the button text
    sizes.forEach((size) => {
      expect(screen.getByText(size.sizeName)).toBeInTheDocument();
    });
  });
});
