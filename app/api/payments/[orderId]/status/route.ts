import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { synchronizeOrderPaymentStatus } from "@/lib/shop";

export async function GET(_: Request, context: RouteContext<"/api/payments/[orderId]/status">) {
  const { orderId } = await context.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      userId: true,
      status: true,
      totalCents: true,
      payment: {
        select: {
          pixQrCode: true,
          pixCopyPasteCode: true,
          status: true,
        },
      },
    },
  });

  if (!order || order.userId !== session.user.id) {
    return NextResponse.json({ message: "Pedido não encontrado." }, { status: 404 });
  }

  await synchronizeOrderPaymentStatus(order.id);

  const updated = await prisma.order.findUnique({
    where: { id: order.id },
    select: {
      id: true,
      status: true,
      totalCents: true,
      payment: {
        select: {
          pixQrCode: true,
          pixCopyPasteCode: true,
          status: true,
        },
      },
    },
  });

  return NextResponse.json(updated);
}
