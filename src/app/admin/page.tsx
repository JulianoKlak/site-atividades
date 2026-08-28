import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { formatBRL } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [summary, topProducts, latestOrders, users] = await Promise.all([
    prisma.order.aggregate({
      where: { status: "PAID" },
      _sum: { totalInCents: true },
      _count: { id: true },
    }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    prisma.order.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { _count: { select: { orders: true } } },
    }),
  ]);

  const [salesToday, salesMonth, productMap] = await Promise.all([
    prisma.order.aggregate({ where: { status: "PAID", paymentConfirmedAt: { gte: today } }, _sum: { totalInCents: true } }),
    prisma.order.aggregate({ where: { status: "PAID", paymentConfirmedAt: { gte: monthStart } }, _sum: { totalInCents: true } }),
    prisma.product.findMany({ where: { id: { in: topProducts.map((t) => t.productId) } } }),
  ]);

  const productById = new Map(productMap.map((product) => [product.id, product.title]));

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Painel administrativo</h1>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Faturamento total" value={formatBRL(summary._sum.totalInCents || 0)} />
        <Card title="Vendas hoje" value={formatBRL(salesToday._sum.totalInCents || 0)} />
        <Card title="Vendas do mês" value={formatBRL(salesMonth._sum.totalInCents || 0)} />
        <Card title="Quantidade de pedidos" value={String(summary._count.id || 0)} />
      </section>

      <section className="rounded-xl border bg-white p-5">
        <h2 className="text-xl font-semibold">Produtos mais vendidos</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {topProducts.map((item) => (
            <li key={item.productId}>{productById.get(item.productId) || item.productId} — {item._sum.quantity || 0} vendas</li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border bg-white p-5">
        <h2 className="text-xl font-semibold">Últimos pedidos</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {latestOrders.map((order) => (
            <li key={order.id}>{order.id} — {order.user.email} — {order.status} — {formatBRL(order.totalInCents)}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border bg-white p-5">
        <h2 className="text-xl font-semibold">Clientes</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {users.map((user) => (
            <li key={user.id}>{user.email} — cadastro em {new Date(user.createdAt).toLocaleDateString("pt-BR")} — compras: {user._count.orders}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-sm text-slate-600">{title}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}
