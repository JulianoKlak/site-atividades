import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  coverImageUrl: string;
  priceCents: number;
  categoryName: string;
}

export function ProductCard({ product }: { product: ProductCardProps }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 h-44 rounded-xl bg-slate-100" style={{ backgroundImage: `url(${product.coverImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <span className="text-xs text-slate-500">{product.categoryName}</span>
      <h3 className="mt-1 text-base font-semibold text-slate-800">{product.title}</h3>
      <p className="mt-1 text-sm text-slate-600 line-clamp-2">{product.shortDescription}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-semibold text-emerald-700">{formatCurrency(product.priceCents)}</span>
        <Link href={`/produtos/${product.slug}`} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white">
          Ver detalhes
        </Link>
      </div>
    </article>
  );
}
