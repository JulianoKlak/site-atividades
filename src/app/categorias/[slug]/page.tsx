import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductCard } from "@/components/catalog/product-card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });

  if (!category) {
    return { title: "Categoria não encontrada" };
  }

  return {
    title: `${category.name} - Atividades`,
    description: `Materiais de ${category.schoolYear} para ${category.subject}.`,
  };
}

export default async function CategoriaDetalhePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });

  if (!category) {
    notFound();
  }

  const products = await prisma.product.findMany({ where: { categoryId: category.id, isActive: true } });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="text-slate-600">{category.schoolYear} • {category.subject}</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
