import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Categorias",
  description: "Navegue pelas categorias de materiais pedagógicos.",
};

export const dynamic = "force-dynamic";

export default async function CategoriasPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Categorias</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.id} href={`/categorias/${category.slug}`} className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold">{category.name}</h2>
            <p className="mt-1 text-sm text-slate-600">{category.schoolYear} • {category.subject}</p>
            <p className="mt-3 text-xs text-slate-500">{category._count.products} materiais</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
