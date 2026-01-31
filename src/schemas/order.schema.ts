import { z } from 'zod';
import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const orderProductSchema = z.object({
  productId: z.number().int().positive().openapi({
    description: 'The product ID',
    example: 1,
  }),
  quantity: z.number().int().positive().default(1).openapi({
    description: 'The product quantity',
    example: 2,
  }),
});

export const createOrderSchema = z.object({
  userId: z.string().optional().openapi({
    description: 'The user ID (optional)',
    example: 'clx1234567890',
  }),
  products: z
    .array(orderProductSchema)
    .min(1, 'At least one product is required')
    .openapi({
      description: 'Array of products to order',
      example: [
        { productId: 1, quantity: 2 },
        { productId: 3, quantity: 1 },
      ],
    }),
});

export const orderStatusSchema = z
  .enum(['PENDING', 'COMPLETED', 'CANCELLED'])
  .openapi({
    description: 'Order status',
    example: 'PENDING',
  });

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
});

export const orderResponseSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  createdAt: z.string().openapi({ example: '2026-01-31T10:00:00Z' }),
  status: orderStatusSchema,
  userId: z.string().nullable().openapi({ example: 'clx1234567890' }),
});

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/).openapi({
    description: 'The order ID parameter in the URL',
    example: '1',
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

const registry = new OpenAPIRegistry();

const CreateOrderRequestSchema = registry.register(
  'CreateOrderRequest',
  createOrderSchema,
);

const OrderResponseSchema = registry.register(
  'OrderResponse',
  orderResponseSchema,
);

const OrderIdParamSchema = registry.register('OrderIdParam', idParamSchema);

const UpdateOrderStatusRequestSchema = registry.register(
  'UpdateOrderStatusRequest',
  updateOrderStatusSchema,
);

// GET /api/orders
registry.registerPath({
  method: 'get',
  path: '/api/orders',
  summary: 'GET /orders',
  description: 'Get all orders',
  responses: {
    200: {
      description: 'List of orders',
      content: {
        'application/json': {
          schema: z.array(OrderResponseSchema),
        },
      },
    },
  },
});

// POST /api/orders
registry.registerPath({
  method: 'post',
  path: '/api/orders',
  summary: 'POST /orders',
  description: 'Create a new order',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateOrderRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Order created',
      content: {
        'application/json': {
          schema: OrderResponseSchema,
        },
      },
    },
    400: {
      description: 'Validation errors',
    },
  },
});

// GET /api/orders/{id}
registry.registerPath({
  method: 'get',
  path: '/api/orders/{id}',
  summary: 'GET /orders/{id}',
  description: 'Get order by ID',
  request: {
    params: OrderIdParamSchema,
  },
  responses: {
    200: {
      description: 'Order found',
      content: {
        'application/json': {
          schema: OrderResponseSchema,
        },
      },
    },
    404: {
      description: 'Order not found',
    },
  },
});

// PATCH /api/orders/{id}
registry.registerPath({
  method: 'patch',
  path: '/api/orders/{id}',
  summary: 'PATCH /orders/{id}',
  description: 'Update order status',
  request: {
    params: OrderIdParamSchema,
    body: {
      content: {
        'application/json': {
          schema: UpdateOrderStatusRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Order status updated',
      content: {
        'application/json': {
          schema: OrderResponseSchema,
        },
      },
    },
    400: {
      description: 'Validation errors',
    },
    404: {
      description: 'Order not found',
    },
  },
});

export {
  registry
};
