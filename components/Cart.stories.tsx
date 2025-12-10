import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Cart } from './Cart';
import { CartProvider } from '../context/CartContext';

const meta = {
  title: 'Components/Cart',
  component: Cart,
  decorators: [
    (Story) => (
      <CartProvider>
        <Story />
      </CartProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Cart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithItems: Story = {
  decorators: [
    (Story) => {
      const { addToCart } = require('../context/CartContext').useCart();
      React.useEffect(() => {
        addToCart({
          name: 'Margherita Pizza',
          size: 30,
          price: 20,
          image: '/images/margherita.jpg',
        });
      }, []);
      return <Story />;
    },
  ],
};
