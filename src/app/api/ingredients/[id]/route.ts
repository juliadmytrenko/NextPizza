import { prisma } from "@/lib/prisma";

// --- GET ---
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    if (!id || isNaN(Number(id))) {
      return new Response(JSON.stringify({ error: "Invalid ingredient id" }), { status: 400 });
    }
    const ingredient = await prisma.ingredient.findUnique({ where: { id: Number(id) } });
    if (!ingredient) {
      return new Response(JSON.stringify({ error: "Ingredient not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(ingredient), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch ingredient" }), { status: 500 });
  }
}

// --- DELETE ---
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    if (!id || isNaN(Number(id))) {
      return new Response(JSON.stringify({ error: "Invalid ingredient id" }), { status: 400 });
    }
    await prisma.productIngredient.deleteMany({ where: { ingredientId: Number(id) } });
    const deleted = await prisma.ingredient.delete({ where: { id: Number(id) } });
    return new Response(JSON.stringify(deleted), { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return new Response(JSON.stringify({ error: "Ingredient not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ error: "Failed to delete ingredient" }), { status: 500 });
  }
}

// --- POST ---
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { name } = body;
    if (!name || typeof name !== "string") {
      return new Response(JSON.stringify({ error: "Name is required" }), { status: 400 });
    }
    const ingredient = await prisma.ingredient.create({
      data: { name },
    });
    return new Response(JSON.stringify(ingredient), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to add ingredient" }), { status: 500 });
  }
}

// --- PUT ---
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    if (!id || isNaN(Number(id))) {
      return new Response(JSON.stringify({ error: "Invalid ingredient id" }), { status: 400 });
    }
    const body = await request.json();
    const { name } = body;
    if (!name || typeof name !== "string") {
      return new Response(JSON.stringify({ error: "Name is required" }), { status: 400 });
    }
    const updated = await prisma.ingredient.update({
      where: { id: Number(id) },
      data: { name },
    });
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return new Response(JSON.stringify({ error: "Ingredient not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ error: "Failed to update ingredient" }), { status: 500 });
  }
}