import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ingredients = await prisma.ingredient.findMany();
    return new Response(JSON.stringify(ingredients), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Failed to fetch ingredients" }), { status: 500 });
  }
}