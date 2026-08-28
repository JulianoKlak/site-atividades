import { prisma } from "@/lib/prisma";

export async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  } catch {
    return [];
  }
}

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  } catch {
    return [];
  }
}
