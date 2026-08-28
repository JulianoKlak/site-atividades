import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { paymentService } from "@/services/payment";
import { sendOrderPaidEmail } from "@/services/email/email-service";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  if (!rateLimit(`webhook:${ip}`, 120, 60_000)) {
    return NextResponse.json({ error: "Rate limit" }, { status: 429 });
  }

  const signature = request.headers.get("x-signature");
  const rawBody = await request.text();

  if (!paymentService.validateWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
  }

  const event = await paymentService.processWebhook(rawBody);

  const payment = await prisma.payment.findUnique({ where: { gatewayChargeId: event.chargeId }, include: { order: { include: { user: true } } } });
  if (!payment) {
    return NextResponse.json({ ok: true });
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: event.status,
        paidAt: event.paidAt ? new Date(event.paidAt) : undefined,
        rawResponse: event.payload as Prisma.JsonObject,
      },
    });

    const mappedOrderStatus = event.status === "PAID" ? "PAID" : event.status === "EXPIRED" ? "EXPIRED" : event.status === "CANCELLED" ? "CANCELLED" : "PENDING";

    await tx.order.update({
      where: { id: payment.orderId },
      data: {
        status: mappedOrderStatus,
        paymentConfirmedAt: event.status === "PAID" ? (event.paidAt ? new Date(event.paidAt) : new Date()) : null,
      },
    });
  });

  if (event.status === "PAID") {
    await sendOrderPaidEmail({ to: payment.order.user.email, orderId: payment.orderId });
  }

  return NextResponse.json({ ok: true });
}
