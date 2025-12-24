import { prisma } from "../../../lib/prisma";

// Utility: get ingredient IDs by name
async function getIngredientIds(ingredients: string[]) {
  if (!Array.isArray(ingredients) || ingredients.length === 0) return [];
  const records = await prisma.ingredient.findMany({
    where: { name: { in: ingredients } },
    select: { id: true },
  });
  return records.map((r) => r.id);
}

// Utility: get size records by size string
async function getSizeRecords(sizes: any[]) {
  if (!Array.isArray(sizes) || sizes.length === 0) return [];
  return prisma.size.findMany({
    where: { size: { in: sizes.map((s) => String(s.size)) } },
    select: { id: true, size: true },
  });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, imageUrl, category, price, ingredients, sizes, description } = data;
    if (!name || !imageUrl || !category) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }
    const safeImageUrl = typeof imageUrl === "string" && imageUrl.length > 191 ? imageUrl.slice(0, 191) : imageUrl;
    const finalPrice = typeof price === "number" && !isNaN(price) ? price : 0;
    const ingredientIds = await getIngredientIds(ingredients);
    const sizeRecords = await getSizeRecords(sizes);
    const productSizeCreates = Array.isArray(sizes)
      ? sizes
          .map((s: any) => {
            const found = sizeRecords.find((rec) => rec.size === String(s.size));
            return found ? { sizeId: found.id, price: Number(s.price) } : undefined;
          })
          .filter((v): v is { sizeId: number; price: number } => v !== undefined)
      : [];
    const product = await prisma.product.create({
      data: {
        name,
        imageUrl: safeImageUrl,
        category,
        price: finalPrice,
        description,
        ProductIngredient: {
          create: ingredientIds.map((id) => ({ ingredientId: id })),
        },
        ProductSize: {
          create: productSizeCreates,
        },
      },
      include: {
        ProductIngredient: { include: { Ingredient: true } },
        ProductSize: { include: { Size: true } },
      },
    });
    return Response.json(product, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: error?.message || "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const queryId = url.searchParams.get("id");
    const body = await request.json();
    const id = body.id ?? queryId;
    if (!id) {
      return Response.json({ error: "Missing product id" }, { status: 400 });
    }
    const { name, imageUrl, category, price, description, ingredients, sizes, ...rest } = body;
    const updateData: any = { ...rest };
    if (name !== undefined) updateData.name = name;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = price;
    if (description !== undefined) updateData.description = description;
    // Ingredients
    if (Array.isArray(ingredients)) {
      await prisma.productIngredient.deleteMany({ where: { productId: Number(id) } });
      const ingredientIds = await getIngredientIds(ingredients);
      updateData.ProductIngredient = {
        create: ingredientIds.map((ingredientId) => ({ ingredientId })),
      };
    }
    // Sizes
    if (Array.isArray(sizes)) {
      await prisma.productSize.deleteMany({ where: { productId: Number(id) } });
      const sizeRecords = await getSizeRecords(sizes);
      const uniqueSizeIds = new Set();
      updateData.ProductSize = {
        create: sizes
          .map((s: any) => {
            const found = sizeRecords.find((rec) => rec.size === String(s.size));
            if (found && !uniqueSizeIds.has(found.id)) {
              uniqueSizeIds.add(found.id);
              return { sizeId: found.id, price: Number(s.price) };
            }
            return undefined;
          })
          .filter(Boolean),
      };
    }
    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        ProductIngredient: { include: { Ingredient: true } },
        ProductSize: { include: { Size: true } },
      },
    });
    return Response.json(updated);
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: error?.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return Response.json({ error: "Missing product id" }, { status: 400 });
    }
    const productId = Number(id);
    await prisma.productIngredient.deleteMany({ where: { productId } });
    await prisma.productSize.deleteMany({ where: { productId } });
    await prisma.product.delete({ where: { id: productId } });
    return Response.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: error?.message || "Failed to delete product" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        ProductIngredient: { include: { Ingredient: true } },
        ProductSize: { include: { Size: true } },
      },
    });
    return Response.json(products);
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: error?.message || "Failed to fetch products" }, { status: 500 });
  }
}