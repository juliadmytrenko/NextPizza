import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const sizes = await prisma.size.findMany({
      select: { id: true, size: true },
      orderBy: { size: "asc" },
    });
    return Response.json(sizes);
  } catch (error: any) {
    return Response.json({ error: error?.message || "Failed to fetch sizes" }, { status: 500 });
  }
}
