import { prisma } from "../../../lib/prisma";
// POST handler moved to end of file

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, imageUrl, category, price, defaultPrice, ingredients, sizes, description } = data;

    // Validate required fields
    if (!name || !imageUrl || !category) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Truncate imageUrl if needed
    let safeImageUrl = typeof imageUrl === "string" && imageUrl.length > 191 ? imageUrl.slice(0, 191) : imageUrl;

    // Ensure price is a valid number
    let finalPrice = typeof price === "number" && !isNaN(price)
      ? price
      : typeof defaultPrice === "number" && !isNaN(defaultPrice)
        ? defaultPrice
        : 0;

    // Find ingredient IDs by name
    let ingredientRecords: { id: number }[] = [];
    if (Array.isArray(ingredients) && ingredients.length > 0) {
      ingredientRecords = await prisma.ingredient.findMany({
        where: { name: { in: ingredients } },
        select: { id: true },
      });
    }

    // Find size IDs by size string
    let productSizeCreates: any[] = [];
    if (Array.isArray(sizes) && sizes.length > 0) {
      const sizeRecords = await prisma.size.findMany({
        where: { size: { in: sizes.map((s: any) => String(s.size)) } },
        select: { id: true, size: true },
      });
      productSizeCreates = sizes.map((s: any) => {
        const found = sizeRecords.find((rec) => rec.size === String(s.size));
        return found ? { sizeId: found.id } : undefined;
      }).filter(Boolean);
    }

    const product = await prisma.product.create({
      data: {
        name,
        imageUrl: safeImageUrl,
        category,
        price: finalPrice,
        description,
        ProductIngredient: {
          create: ingredientRecords.map((ing) => ({ ingredientId: ing.id })),
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
    console.log("--ERROR-----------------------------------------------")
    console.error(error);
    return Response.json({ error: error?.message || "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return Response.json({ error: "Missing product id" }, { status: 400 });
    }
    const updated = await prisma.product.update({
      where: { id },
      data,
    });
    return Response.json(updated);
  } catch (error) {
    console.error(error);
    return Response.json({ error: error }, { status: 500 });
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
    // Remove all ProductIngredient relations for this product
    await prisma.productIngredient.deleteMany({ where: { productId } });
    // Remove all ProductSize relations for this product
    await prisma.productSize.deleteMany({ where: { productId } });
    // Now delete the product
    await prisma.product.delete({ where: { id: productId } });
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error }, { status: 500 });
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        ProductIngredient: {
          include: {
            Ingredient: true,
          },
        },
        ProductSize: {
          include: {
            Size: true,
          },
        },
      },
    });
    return Response.json(products);
  } catch (error) {
    console.error(error);
    return Response.json({ error: error }, { status: 500 });
  }
}
