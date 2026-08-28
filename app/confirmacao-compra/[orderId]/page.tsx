import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function CheckoutConfirmationPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    notFound();
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id },
    include: { payment: true },
  });

  if (!order || !order.payment) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-800">Confirmação de compra</h1>
      <div className="mt-6 space-y-3 rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-600">Pedido: {order.id}</p>
        <p className="text-sm text-slate-600">Valor: {formatCurrency(order.totalCents)}</p>
        <p className="text-sm text-slate-600">Status do pagamento: {order.payment.status}</p>
        <p className="text-sm text-slate-600">Status do pedido: {order.status}</p>
        <p className="text-sm text-slate-600">QR Code PIX (payload):</p>
        <code className="block overflow-x-auto rounded bg-slate-100 p-3 text-xs">{order.payment.pixQrCode}</code>
        <p className="text-sm text-slate-600">PIX copia e cola:</p>
        <code className="block overflow-x-auto rounded bg-slate-100 p-3 text-xs">{order.payment.pixCopyPasteCode}</code>
      </div>
    </main>
  );
}
