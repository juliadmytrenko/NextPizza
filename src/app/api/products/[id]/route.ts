import { prisma } from "@/lib/prisma";
import {
  productSchema,
  productUpdateSchema,
  idParamSchema,
} from "@/schemas/product.schema";

// Helper to get ingredient IDs
async function getIngredientIds(ingredients: string[]) {
  if (!Array.isArray(ingredients) || ingredients.length === 0) return [];
  const records = await prisma.ingredient.findMany({
    where: { name: { in: ingredients } },
    select: { id: true },
  });
  return records.map((r) => r.id);
}

// --- GET ---
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    console.log("Fetching product with id:", id);
    const idCheck = idParamSchema.safeParse({ id: String(id) });
    if (!idCheck.success) {
      return Response.json({ error: idCheck.error.issues }, { status: 400 });
    }
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: {
        ProductIngredient: { include: { Ingredient: true } },
        ProductSize: true,
      },
    });
    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    return Response.json(product);
  } catch (error: any) {
    return Response.json({ error: error?.message || "Failed to fetch product" }, { status: 500 });
  }
}

// --- PUT ---
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const idCheck = idParamSchema.safeParse({ id: String(id) });
    if (!idCheck.success) {
      return Response.json({ error: "Missing or invalid product id" }, { status: 400 });
    }
    const parsed = productUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues }, { status: 400 });
    }
    const { name, imageUrl, category, price, description, ingredients, sizes, ...rest } = parsed.data;
    const updateData: any = { ...rest };
    if (name !== undefined) updateData.name = name;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = price;
    if (description !== undefined) updateData.description = description;
    if (Array.isArray(ingredients)) {
      await prisma.productIngredient.deleteMany({ where: { productId: Number(id) } });
      const ingredientIds = await getIngredientIds(ingredients);
      updateData.ProductIngredient = {
        create: ingredientIds.map((ingredientId) => ({ ingredientId })),
      };
    }
    if (Array.isArray(sizes)) {
      await prisma.productSize.deleteMany({ where: { productId: Number(id) } });
      updateData.ProductSize = {
        create: sizes.map((s) => ({
          sizeName: s.sizeName,
          price: s.price,
        })),
      };
    }
    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        ProductIngredient: { include: { Ingredient: true } },
        ProductSize: true,
      },
    });
    return Response.json(updated);
  } catch (error: any) {
    return Response.json({ error: error?.message || "Failed to update product" }, { status: 500 });
  }
}

// --- DELETE ---
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const idCheck = idParamSchema.safeParse({ id: String(id) });
    if (!idCheck.success) {
      return Response.json({ error: "Missing or invalid product id" }, { status: 400 });
    }
    const productId = Number(id);
    await prisma.productIngredient.deleteMany({ where: { productId } });
    await prisma.productSize.deleteMany({ where: { productId } });
    await prisma.product.delete({ where: { id: productId } });
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error?.message || "Failed to delete product" }, { status: 500 });
  }
}

// --- POST ---
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const parsed = productSchema.safeParse(data);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues }, { status: 400 });
    }
    const { name, imageUrl, category, ingredients, sizes, description } = parsed.data;
    const ingredientIds = await getIngredientIds(ingredients || []);
    const product = await prisma.product.create({
      data: {
        name,
        imageUrl,
        category: category as any,
        description,
        ProductIngredient: {
          create: ingredientIds.map((id) => ({ ingredientId: id })),
        },
        ProductSize: {
          create: Array.isArray(sizes)
            ? sizes.map((s) => ({
                sizeName: s.sizeName,
                price: s.price,
              }))
            : [],
        },
      },
      include: {
        ProductIngredient: { include: { Ingredient: true } },
        ProductSize: true,
      },
    });
    return Response.json(product, { status: 201 });
  } catch (error: any) {
    return Response.json({ error: error?.message || "Failed to create product" }, { status: 500 });
  }
}