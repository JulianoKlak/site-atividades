"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CheckoutPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);

  const productIds = useMemo(() => {
    const raw = params.get("items") ?? "";
    return raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [params]);

  const handleCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds, couponCode: couponCode || undefined }),
    });

    setLoading(false);
    if (!response.ok) return;

    const result = (await response.json()) as { orderId: string };
    router.push(`/confirmacao-compra/${result.orderId}`);
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-800">Checkout</h1>
      <form className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6" onSubmit={handleCheckout}>
        <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Nome" required />
        <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="E-mail" type="email" required />
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Cupom"
          value={couponCode}
          onChange={(event) => setCouponCode(event.target.value)}
        />
        <p className="text-sm text-slate-600">Resumo: {productIds.length} item(ns)</p>
        <button disabled={loading || !productIds.length} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
          {loading ? "Gerando cobrança PIX..." : "Gerar cobrança PIX"}
        </button>
      </form>
    </main>
  );
}
