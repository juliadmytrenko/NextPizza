import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createOrderSchema } from '@/schemas/order.schema';
import { z } from 'zod';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderProduct: {
          include: {
            product: true
          }
        },
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = createOrderSchema.parse(body);

    // Create order with products
    const order = await prisma.order.create({
      data: {
        userId: validatedData.userId || null,
        status: 'PENDING',
        orderProduct: {
          create: validatedData.products.map((item) => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        }
      },
      include: {
        orderProduct: {
          include: {
            product: true
          }
        },
        user: true
      }
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}