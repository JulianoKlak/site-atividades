import { prisma } from "@/lib/prisma";

export const getFeaturedProducts = async () =>
  prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

export const getCatalogProducts = async ({
  query,
  category,
  minPrice,
  maxPrice,
}: {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}) =>
  prisma.product.findMany({
    where: {
      isActive: true,
      title: query ? { contains: query, mode: "insensitive" } : undefined,
      category: category ? { slug: category } : undefined,
      priceCents: {
        gte: minPrice,
        lte: maxPrice,
      },
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

export const getCategories = async () =>
  prisma.category.findMany({
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });
