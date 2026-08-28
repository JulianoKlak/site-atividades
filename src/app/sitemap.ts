import { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "",
    "/catalogo",
    "/categorias",
    "/carrinho",
    "/checkout",
    "/login",
    "/cadastro",
    "/recuperar-senha",
    "/termos",
    "/privacidade",
    "/contato",
  ];

  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }).catch(() => []),
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }).catch(() => []),
  ]);

  return [
    ...staticPages.map((path) => ({
      url: `${env.appUrl}${path}`,
      lastModified: new Date(),
    })),
    ...products.map((product) => ({
      url: `${env.appUrl}/produto/${product.slug}`,
      lastModified: product.updatedAt,
    })),
    ...categories.map((category) => ({
      url: `${env.appUrl}/categorias/${category.slug}`,
      lastModified: category.updatedAt,
    })),
  ];
}
