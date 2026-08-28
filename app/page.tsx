import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getFeaturedProducts } from "@/lib/catalog";

const gradeLevels = ["1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano"];
const subjects = ["Português", "Matemática", "Ciências", "História", "Geografia", "Artes"];

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-3xl bg-slate-900 px-6 py-12 text-white sm:px-12">
        <h1 className="text-3xl font-bold sm:text-4xl">Atividades prontas para facilitar o seu dia em sala de aula.</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-200">Apostilas, exercícios e materiais pedagógicos prontos para imprimir e usar.</p>
        <Link href="/catalogo" className="mt-8 inline-block rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900">
          Ver atividades
        </Link>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-slate-800">Categorias por ano</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {gradeLevels.map((grade) => (
            <span key={grade} className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700">
              {grade}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-slate-800">Disciplinas</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {subjects.map((subject) => (
            <span key={subject} className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700">
              {subject}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-slate-800">Produtos em destaque</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
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
      </section>

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-semibold text-slate-800">Como funciona</h2>
        <ol className="mt-4 space-y-2 text-slate-700">
          <li>1. Escolha seu material</li>
          <li>2. Faça o pagamento via PIX</li>
          <li>3. Receba acesso ao material</li>
          <li>4. Baixe e imprima</li>
        </ol>
      </section>
    </main>
  );
}
