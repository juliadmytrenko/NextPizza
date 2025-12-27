export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const name = searchParams.get("name");
	try {
		if (name) {
			const ingredient = await prisma.ingredient.findFirst({ where: { name } });
			if (!ingredient) {
				return new Response(JSON.stringify({ error: "Ingredient not found" }), { status: 404 });
			}
			return new Response(JSON.stringify(ingredient), { status: 200 });
		} else {
			const ingredients = await prisma.ingredient.findMany();
			return new Response(JSON.stringify(ingredients), { status: 200 });
		}
	} catch (error) {
		return new Response(JSON.stringify({ error: "Failed to fetch ingredient(s)" }), { status: 500 });
	}
}

import { prisma } from "@/lib/prisma";
// DELETE /api/ingredients/id
export async function DELETE(request: Request) {
	try {
		const url = new URL(request.url);
		const id = url.searchParams.get("id");
		if (!id || isNaN(Number(id))) {
			return new Response(JSON.stringify({ error: "Invalid ingredient id" }), { status: 400 });
		}
		// Remove all ProductIngredient relations for this ingredient
		await prisma.productIngredient.deleteMany({ where: { ingredientId: Number(id) } });
		// Now delete the ingredient
		const deleted = await prisma.ingredient.delete({ where: { id: Number(id) } });
		return new Response(JSON.stringify(deleted), { status: 200 });
	} catch (error: any) {
		if (error.code === 'P2025') {
			return new Response(JSON.stringify({ error: "Ingredient not found" }), { status: 404 });
		}
		return new Response(JSON.stringify({ error: "Failed to delete ingredient" }), { status: 500 });
	}
}

export async function POST(request: Request) {
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