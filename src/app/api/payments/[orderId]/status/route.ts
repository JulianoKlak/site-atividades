import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { paymentService } from "@/services/payment";
import { sendOrderPaidEmail } from "@/services/email/email-service";

export async function GET(_: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;

  const payment = await prisma.payment.findUnique({ where: { orderId }, include: { order: { include: { user: true } } } });
  if (!payment) {
    return NextResponse.json({ error: "Pagamento não encontrado" }, { status: 404 });
  }

  const statusInfo = await paymentService.getPaymentStatus(payment.gatewayChargeId);

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: statusInfo.status,
        paidAt: statusInfo.paidAt ? new Date(statusInfo.paidAt) : undefined,
        rawResponse: statusInfo.raw as Prisma.JsonObject,
      },
    });

    if (statusInfo.status === "PAID") {
      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          status: "PAID",
          paymentConfirmedAt: statusInfo.paidAt ? new Date(statusInfo.paidAt) : new Date(),
        },
      });
    }
  });

  if (statusInfo.status === "PAID") {
    await sendOrderPaidEmail({ to: payment.order.user.email, orderId: payment.orderId });
  }

  return NextResponse.json({
    orderId,
    status: statusInfo.status,
    paidAt: statusInfo.paidAt,
    totalInCents: payment.amountInCents,
  });
}
