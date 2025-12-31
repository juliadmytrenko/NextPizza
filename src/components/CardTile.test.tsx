import { render, screen } from "@testing-library/react";
import { CardTile } from "./CardTile";
import { CartProvider } from "../context/CartContext";

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
  //   it("displays fallback image on invalid image URL", () => {
  //     render(
  //       <CartProvider>
  //         <CardTile name="Test Product" imageUrl="invalid-url" />
  //       </CartProvider>
  //     );
  //     const imgElement = screen.getByAltText("Test Product") as HTMLImageElement;
  //     expect(imgElement.src).toContain("/images/fallback.png");
  //   });
});
