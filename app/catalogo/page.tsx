import { ProductCard } from "@/components/product-card";
import { getCatalogProducts, getCategories } from "@/lib/catalog";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : undefined;
  const category = typeof params.categoria === "string" ? params.categoria : undefined;
  const minPrice = typeof params.min === "string" ? Number(params.min) : undefined;
  const maxPrice = typeof params.max === "string" ? Number(params.max) : undefined;

  const [products, categories] = await Promise.all([
    getCatalogProducts({ query, category, minPrice, maxPrice }),
    getCategories(),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-800">Catálogo de atividades</h1>
      <form className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-4">
        <input name="q" placeholder="Pesquisar" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" defaultValue={query} />
        <select name="categoria" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" defaultValue={category}>
          <option value="">Categoria</option>
          {categories.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        <input name="min" placeholder="Preço mín. (centavos)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" defaultValue={minPrice} />
        <input name="max" placeholder="Preço máx. (centavos)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" defaultValue={maxPrice} />
        <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white sm:col-span-4">Filtrar</button>
      </form>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              slug: product.slug,
              title: product.title,
              shortDescription: product.shortDescription,
              coverImageUrl: product.coverImageUrl,
              priceCents: product.priceCents,
              categoryName: product.category.name,
            }}
          />
        ))}
      </div>
    </main>
  );
}
