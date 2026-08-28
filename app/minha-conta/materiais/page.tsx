import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function MyMaterialsPage() {
  const session = await auth();
  const materials = await prisma.orderItem.findMany({
    where: {
      order: {
        userId: session?.user?.id,
        status: "PAID",
      },
    },
    include: { product: true },
    distinct: ["productId"],
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-800">Meus materiais</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {materials.map((item) => (
          <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-800">{item.product.title}</h2>
            <Link href={`/api/download/${item.productId}`} className="mt-3 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">
              Baixar PDF
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
