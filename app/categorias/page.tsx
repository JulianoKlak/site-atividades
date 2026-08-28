import Link from "next/link";
import { getCategories } from "@/lib/catalog";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-800">Categorias</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <Link key={category.id} href={`/categorias/${category.slug}`} className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{category.type}</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-800">{category.name}</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
