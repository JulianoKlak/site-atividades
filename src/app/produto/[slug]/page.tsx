import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatBRL } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) {
    return { title: "Produto não encontrado" };
  }

  return {
    title: product.title,
    description: product.shortDescription,
  };
}

export default async function ProdutoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || !product.isActive) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{product.title}</h1>
      <p className="text-slate-600">{product.description}</p>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-5">
          <div className="aspect-[4/3] rounded-lg bg-slate-100" style={{ backgroundImage: `url(${product.coverImageUrl})`, backgroundSize: "cover" }} />
          <p className="mt-3 text-xs text-slate-500">Prévia com marca d'água (exibir versão protegida no storage).</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {product.previewImageUrls.map((url, index) => (
              <div key={url + index} className="aspect-[4/3] rounded bg-slate-100" style={{ backgroundImage: `url(${url})`, backgroundSize: "cover" }} />
            ))}
          </div>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-2xl font-bold text-slate-900">{formatBRL(product.priceInCents)}</p>
          <ul className="mt-4 space-y-1 text-sm text-slate-700">
            <li>Categoria: {product.category.name}</li>
            <li>Ano escolar: {product.schoolYear}</li>
            <li>Disciplina: {product.subject}</li>
            <li>Quantidade de páginas: {product.pagesCount}</li>
            <li>Formato: PDF digital para impressão</li>
          </ul>
          <h2 className="mt-4 font-semibold">Inclui</h2>
          <ul className="list-disc pl-5 text-sm">
            {product.includedItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <a href="/checkout" className="mt-6 inline-block rounded-lg bg-sky-600 px-5 py-3 font-semibold text-white">
            Comprar agora
          </a>
        </div>
      </div>
    </div>
  );
}
