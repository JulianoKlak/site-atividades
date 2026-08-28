import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-800">Gerenciar produtos</h1>
      <div className="mt-6 space-y-3">
        {products.map((product) => (
          <article key={product.id} className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
            <p className="font-semibold text-slate-800">{product.title}</p>
            <p>Categoria: {product.category.name}</p>
            <p>Preço: {formatCurrency(product.priceCents)}</p>
            <p>Status: {product.isActive ? "Ativo" : "Inativo"}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
