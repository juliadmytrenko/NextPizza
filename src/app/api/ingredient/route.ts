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