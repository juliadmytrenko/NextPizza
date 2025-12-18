import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return Response.json(products);
  } catch (error) {
    console.error(error); // Add this line
    return Response.json({ error: error }, { status: 500 });
      // return Response.json({ error: 'Failed to fetch products' }, { status: 500 });

  }
}