import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });

  return {
    title: product ? `${product.title} | SalaPronta` : "Produto não encontrado | SalaPronta",
    description: product?.shortDescription,
    openGraph: product
      ? {
          title: product.title,
          description: product.shortDescription,
          images: [product.coverImageUrl],
        }
      : undefined,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug }, include: { category: true } });

  if (!product || !product.isActive) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="h-80 rounded-2xl bg-slate-100" style={{ backgroundImage: `url(${product.coverImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="mt-4 grid grid-cols-3 gap-2">
            {product.previewImageUrls.map((preview) => (
              <div
                key={preview}
                className="relative h-24 rounded-lg bg-slate-200"
                style={{ backgroundImage: `url(${preview})`, backgroundSize: "cover" }}
              >
                <span className="absolute inset-0 grid place-items-center bg-black/35 text-xs font-semibold text-white">Prévia com marca d&#39;água</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-slate-500">{product.category.name}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-800">{product.title}</h1>
          <p className="mt-4 text-slate-700">{product.description}</p>
          <p className="mt-4 text-2xl font-semibold text-emerald-700">{formatCurrency(product.priceCents)}</p>
          <ul className="mt-5 list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>{product.pageCount} páginas</li>
            <li>Formato: {product.formatInfo}</li>
            {product.includedItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Link href={`/carrinho?add=${product.id}`} className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white">
            Comprar agora
          </Link>
        </div>
      </div>
    </main>
  );
}
