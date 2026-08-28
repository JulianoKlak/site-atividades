import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function MyOrdersPage() {
  const session = await auth();

  const orders = await prisma.order.findMany({
    where: { userId: session?.user?.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-800">Meus pedidos</h1>
      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <article key={order.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Pedido: {order.id}</p>
            <p className="text-sm text-slate-500">Status: {order.status}</p>
            <p className="text-sm text-slate-500">Total: {formatCurrency(order.totalCents)}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
