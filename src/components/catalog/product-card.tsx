import Link from "next/link";
import { formatBRL } from "@/lib/money";

type ProductCardProps = {
  product: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    priceInCents: number;
    schoolYear: string;
    subject: string;
    coverImageUrl: string;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 aspect-[4/3] rounded-lg bg-slate-100" style={{ backgroundImage: `url(${product.coverImageUrl})`, backgroundSize: "cover" }} />
      <h3 className="font-semibold text-slate-900">{product.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{product.shortDescription}</p>
      <p className="mt-2 text-xs text-slate-500">{product.schoolYear} • {product.subject}</p>
      <div className="mt-4 flex items-center justify-between">
        <strong className="text-slate-900">{formatBRL(product.priceInCents)}</strong>
        <Link href={`/produto/${product.slug}`} className="text-sm font-medium text-sky-700 hover:text-sky-800">
          Ver detalhes
        </Link>
      </div>
    </article>
  );
}
