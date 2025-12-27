import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        ProductIngredient: { include: { Ingredient: true } },
        ProductSize: true,
      },
    });
    return Response.json(products);
  } catch (error: any) {
    return Response.json({ error: error?.message || "Failed to fetch products" }, { status: 500 });
  }
}