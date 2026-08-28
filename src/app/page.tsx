import Link from "next/link";
import { ProductCard } from "@/components/catalog/product-card";
import { getCategories, getFeaturedProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const schoolYears = ["1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano"];
const subjects = ["Português", "Matemática", "Ciências", "História", "Geografia", "Artes"];

export default async function Home() {
  const [featuredProducts, categories] = await Promise.all([getFeaturedProducts(), getCategories()]);

  return (
    <div className="space-y-14">
      <section className="rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Atividades prontas para facilitar o seu dia em sala de aula.</h1>
        <p className="mt-4 text-lg text-slate-600">
          Apostilas, exercícios e materiais pedagógicos prontos para imprimir e usar.
        </p>
        <Link href="/catalogo" className="mt-6 inline-block rounded-lg bg-sky-600 px-6 py-3 font-semibold text-white hover:bg-sky-700">
          Ver atividades
        </Link>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Categorias por ano</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {schoolYears.map((year) => (
            <div key={year} className="rounded-lg border bg-white p-3 text-center text-sm font-medium">
              {year}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Disciplinas</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {subjects.map((subject) => (
            <div key={subject} className="rounded-lg border bg-white p-3 text-center text-sm font-medium">
              {subject}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Produtos em destaque</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-6">
        <h2 className="text-2xl font-semibold">Como funciona</h2>
        <ol className="mt-4 grid gap-3 text-slate-700 sm:grid-cols-2">
          <li>1. Escolha seu material</li>
          <li>2. Faça o pagamento via PIX</li>
          <li>3. Receba acesso ao material</li>
          <li>4. Baixe e imprima</li>
        </ol>
      </section>

      {categories.length > 0 && (
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Mais categorias</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link key={category.id} href={`/categorias/${category.slug}`} className="rounded-full border bg-white px-4 py-2 text-sm">
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
