import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { formatBRL } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MinhaContaPage() {
  const user = await requireUser();
  if (!user) redirect("/login");

  const [orders, materials] = await Promise.all([
    prisma.order.findMany({
      where: { userId: user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.orderItem.findMany({
      where: { order: { userId: user.id, status: "PAID" } },
      include: { product: true, order: true },
      orderBy: { order: { createdAt: "desc" } },
    }),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Minha conta</h1>

      <section className="rounded-xl border bg-white p-5">
        <h2 className="text-xl font-semibold">Dados pessoais</h2>
        <p className="mt-2 text-sm text-slate-700">Nome: {user.name}</p>
        <p className="text-sm text-slate-700">E-mail: {user.email}</p>
      </section>

      <section className="rounded-xl border bg-white p-5">
        <h2 className="text-xl font-semibold">Meus pedidos</h2>
        <ul className="mt-3 space-y-3 text-sm">
          {orders.map((order) => (
            <li key={order.id} className="rounded border p-3">
              <p>Pedido: {order.id}</p>
              <p>Status: {order.status}</p>
              <p>Total: {formatBRL(order.totalInCents)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border bg-white p-5">
        <h2 className="text-xl font-semibold">Meus materiais</h2>
        <ul className="mt-3 space-y-3 text-sm">
          {materials.map((material) => (
            <li key={material.id} className="flex items-center justify-between rounded border p-3">
              <div>
                <p className="font-medium">{material.product.title}</p>
                <p className="text-slate-600">Pedido {material.orderId}</p>
              </div>
              <Link href={`/api/download/${material.productId}`} className="rounded bg-sky-600 px-3 py-2 text-white">
                Baixar PDF
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
