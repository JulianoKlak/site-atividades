import { ProductCard } from "@/components/catalog/product-card";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Catálogo de atividades",
  description: "Encontre atividades digitais por ano, disciplina, tipo e faixa de preço.",
};

export const dynamic = "force-dynamic";

type CatalogSearchParams = {
  q?: string;
  ano?: string;
  disciplina?: string;
  tipo?: string;
  precoMin?: string;
  precoMax?: string;
};

export default async function CatalogoPage({ searchParams }: { searchParams: Promise<CatalogSearchParams> }) {
  const params = await searchParams;

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      title: params.q ? { contains: params.q, mode: "insensitive" } : undefined,
      schoolYear: params.ano || undefined,
      subject: params.disciplina || undefined,
      materialType: params.tipo || undefined,
      priceInCents: {
        gte: params.precoMin ? Number(params.precoMin) * 100 : undefined,
        lte: params.precoMax ? Number(params.precoMax) * 100 : undefined,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Catálogo de atividades</h1>
      <form className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-6">
        <input name="q" placeholder="Pesquisar" className="rounded border p-2 md:col-span-2" defaultValue={params.q} />
        <input name="ano" placeholder="Ano escolar" className="rounded border p-2" defaultValue={params.ano} />
        <input name="disciplina" placeholder="Disciplina" className="rounded border p-2" defaultValue={params.disciplina} />
        <input name="tipo" placeholder="Tipo" className="rounded border p-2" defaultValue={params.tipo} />
        <div className="grid grid-cols-2 gap-2">
          <input name="precoMin" placeholder="Min" className="rounded border p-2" defaultValue={params.precoMin} />
          <input name="precoMax" placeholder="Max" className="rounded border p-2" defaultValue={params.precoMax} />
        </div>
        <button className="rounded bg-sky-600 px-4 py-2 text-white md:col-span-6">Filtrar</button>
      </form>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
