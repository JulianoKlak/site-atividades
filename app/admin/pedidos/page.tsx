import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true, items: { include: { product: true } }, payment: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-800">Gerenciar pedidos</h1>
      <div className="mt-6 space-y-3">
        {orders.map((order) => (
          <article key={order.id} className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
            <p className="font-semibold text-slate-800">Pedido {order.id}</p>
            <p>Cliente: {order.user.email}</p>
            <p>Total: {formatCurrency(order.totalCents)}</p>
            <p>Status: {order.status}</p>
            <p>Pagamento: {order.payment?.status ?? "Sem pagamento"}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
