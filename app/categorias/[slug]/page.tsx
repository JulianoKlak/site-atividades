import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { prisma } from "@/lib/prisma";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: { products: { where: { isActive: true } } },
  });

  if (!category) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-800">{category.name}</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {category.products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              slug: product.slug,
              title: product.title,
              shortDescription: product.shortDescription,
              coverImageUrl: product.coverImageUrl,
              priceCents: product.priceCents,
              categoryName: category.name,
            }}
          />
        ))}
      </div>
    </main>
  );
}
