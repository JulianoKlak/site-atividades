import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-800">Gerenciar usuários</h1>
      <div className="mt-6 space-y-3">
        {users.map((user) => (
          <article key={user.id} className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
            <p className="font-semibold text-slate-800">{user.email}</p>
            <p>Cadastro: {new Intl.DateTimeFormat("pt-BR").format(user.createdAt)}</p>
            <p>Compras: {user._count.orders}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
