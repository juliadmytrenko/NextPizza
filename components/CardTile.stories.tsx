import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CardTile } from "./CardTile";
import { CartProvider } from "../context/CartContext";

const meta = {
  title: "Pizza/CardTile",
  component: CardTile,
  decorators: [
    (Story) => (
      <CartProvider>
        <Story />
      </CartProvider>
    ),
  ],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CardTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Margherita: Story = {
  args: {
    name: "Margherita Pizza",
    image: "/images/margherita.jpg",
    ingredients: ["Tomato Sauce", "Mozzarella", "Basil"],
    sizes: [
      { size: 30, price: 10 },
      { size: 40, price: 15 },
    ],
  },
};

export const Hawaii: Story = {
  args: {
    name: "Hawaii Pizza",
    image: "/images/hawaii.jpg",
    ingredients: ["Tomato Sauce", "Mozzarella", "Ham", "Pineapple"],
    sizes: [
      { size: 30, price: 12 },
      { size: 40, price: 18 },
      { size: 40, price: 15 },
    ],
  },
};

export const ManySizes: Story = {
  args: {
    name: "Pepperoni Pizza",
    image: "/images/pepperoni.jpg",
    ingredients: ["Tomato Sauce", "Mozzarella", "Pepperoni"],
    sizes: [
      { size: 30, price: 11 },
      { size: 40, price: 16 },
      { size: 30, price: 11 },
      { size: 40, price: 16 },
      { size: 30, price: 11 },
      { size: 40, price: 16 },
      { size: 40, price: 16 },
      { size: 30, price: 11 },
      { size: 40, price: 45 },
      { size: 40, price: 66 },
      { size: 50, price: 11 },
      { size: 40, price: 16 },
    ],
  },
};

export const LotsOfIngredients: Story = {
  args: {
    name: "Pepperoni Pizza",
    image: "/images/pepperoni.jpg",
    ingredients: [
      "Tomato Sauce",
      "Mozzarella",
      "Pepperoni",
      "Olives",
      "Mushrooms",
      "Onions",
      "Green Peppers",
      "Jalapenos",
      "Extra Cheese",
      "Bacon",
      "Pineapple",
      "Spinach",
      "Feta Cheese",
      "Sun-dried Tomatoes",
    ],
    sizes: [
      { size: 30, price: 11 },
      { size: 40, price: 16 },
    ],
  },
};
