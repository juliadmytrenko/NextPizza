import { prisma } from "../../../lib/prisma";
// POST handler moved to end of file

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const created = await prisma.product.create({ data });
    return Response.json(created, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error }, { status: 500 });
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
    await prisma.product.delete({ where: { id: Number(id) } });
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
