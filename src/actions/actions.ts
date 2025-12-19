'use server';

import { prisma } from "@/lib/prisma";

export async function createIngredient(name: string) {
    await prisma.ingredient.create({
        data: {
            name,
        }
    });
}