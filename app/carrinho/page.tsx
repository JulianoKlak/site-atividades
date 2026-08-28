"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CartPage() {
  const searchParams = useSearchParams();
  const productIds = useMemo(() => {
    const addParam = searchParams.get("add");
    return addParam ? [addParam] : [];
  }, [searchParams]);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-800">Carrinho</h1>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-600">IDs no carrinho: {productIds.join(", ") || "Nenhum item adicionado."}</p>
        <p className="mt-2 text-sm text-slate-500">No MVP, os itens são enviados para o checkout por query string para validação no backend.</p>
        <Link href={`/checkout?items=${productIds.join(",")}`} className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          Ir para checkout
        </Link>
      </div>
    </main>
  );
}
