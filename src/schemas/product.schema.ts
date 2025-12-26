import { z } from "zod";

export const productSizeSchema = z.object({
  sizeName: z.string().min(1),
  price: z.number().nonnegative(),
});

export const productSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().url().max(191),
  category: z.string().min(1),
  price: z.number().nonnegative().optional(),
  description: z.string().optional(),
  ingredients: z.array(z.string()).optional(),
  sizes: z.array(productSizeSchema).optional(),
});

export const productUpdateSchema = productSchema.partial().extend({
  id: z.number().optional(),
});

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/),
});

export const getQuerySchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  page: z.string().regex(/^\d+$/).optional(),
  pageSize: z.string().regex(/^\d+$/).optional(),
});