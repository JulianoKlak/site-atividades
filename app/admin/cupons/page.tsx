import { prisma } from "@/lib/prisma";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-800">Gerenciar cupons</h1>
      <div className="mt-6 space-y-3">
        {coupons.map((coupon) => (
          <article key={coupon.id} className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
            <p className="font-semibold text-slate-800">{coupon.code}</p>
            <p>Tipo: {coupon.type}</p>
            <p>Valor: {coupon.value}</p>
            <p>Utilizações: {coupon.usedCount}</p>
            <p>Status: {coupon.isActive ? "Ativo" : "Inativo"}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
