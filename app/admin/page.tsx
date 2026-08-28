import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [totalRevenue, todaySales, monthSales, orderCount, topProducts, recentOrders] = await Promise.all([
    prisma.order.aggregate({ where: { status: "PAID" }, _sum: { totalCents: true } }),
    prisma.order.count({ where: { status: "PAID", paidAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
    prisma.order.count({ where: { status: "PAID", paidAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } }),
    prisma.order.count(),
    prisma.orderItem.groupBy({ by: ["productId"], _sum: { quantity: true }, orderBy: { _sum: { quantity: "desc" } }, take: 5 }),
    prisma.order.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-800">Painel administrativo</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Faturamento total" value={formatCurrency(totalRevenue._sum.totalCents ?? 0)} />
        <Card title="Vendas hoje" value={String(todaySales)} />
        <Card title="Vendas no mês" value={String(monthSales)} />
        <Card title="Pedidos" value={String(orderCount)} />
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-800">Produtos mais vendidos</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {topProducts.map((item) => (
              <li key={item.productId}>{item.productId} — {item._sum.quantity ?? 0} vendas</li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-800">Últimos pedidos</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {recentOrders.map((order) => (
              <li key={order.id}>{order.user.email} — {order.status}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-xl font-semibold text-slate-800">{value}</p>
    </article>
  );
}
