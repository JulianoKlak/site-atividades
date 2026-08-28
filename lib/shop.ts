import { OrderStatus, PaymentStatus, Prisma, type Coupon, type PaymentStatus as PaymentStatusType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { paymentService } from "@/services/payment";

const mapPaymentToOrderStatus = (status: PaymentStatusType) => {
  if (status === "PAID") return OrderStatus.PAID;
  if (status === "CANCELLED") return OrderStatus.CANCELLED;
  if (status === "EXPIRED") return OrderStatus.EXPIRED;
  return OrderStatus.PENDING;
};

const applyCoupon = (coupon: Coupon | null, subtotalCents: number) => {
  if (!coupon || !coupon.isActive) return 0;

  const now = new Date();
  if (coupon.validFrom && coupon.validFrom > now) return 0;
  if (coupon.validUntil && coupon.validUntil < now) return 0;
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return 0;

  if (coupon.type === "PERCENTAGE") {
    return Math.min(Math.round((subtotalCents * coupon.value) / 100), subtotalCents);
  }

  return Math.min(coupon.value, subtotalCents);
};

export const createOrderWithPix = async ({
  userId,
  productIds,
  couponCode,
}: {
  userId: string;
  productIds: string[];
  couponCode?: string;
}) => {
  const uniqueProductIds = [...new Set(productIds)];
  const products = await prisma.product.findMany({
    where: { id: { in: uniqueProductIds }, isActive: true },
  });

  if (!products.length || products.length !== uniqueProductIds.length) {
    throw new Error("Um ou mais produtos são inválidos.");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Usuário não encontrado.");

  const subtotalCents = products.reduce((acc, product) => acc + product.priceCents, 0);

  const coupon = couponCode
    ? await prisma.coupon.findFirst({
        where: { code: couponCode.toUpperCase(), isActive: true },
      })
    : null;

  const discountCents = applyCoupon(coupon, subtotalCents);
  const totalCents = Math.max(subtotalCents - discountCents, 0);

  const transaction = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        status: OrderStatus.PENDING,
        subtotalCents,
        discountCents,
        totalCents,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        couponId: coupon?.id,
        items: {
          createMany: {
            data: products.map((product) => ({
              productId: product.id,
              unitPriceCents: product.priceCents,
              quantity: 1,
            })),
          },
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    const pixCharge = await paymentService.createPixCharge({
      order,
      customer: { id: user.id, name: user.name, email: user.email },
    });

    await tx.payment.create({
      data: {
        orderId: order.id,
        provider: "SANDBOX_PIX",
        status: PaymentStatus.PENDING,
        providerChargeId: pixCharge.providerChargeId,
        pixQrCode: pixCharge.qrCode,
        pixCopyPasteCode: pixCharge.copyPasteCode,
        amountCents: totalCents,
        rawProviderResponse: pixCharge.rawResponse ? (pixCharge.rawResponse as Prisma.JsonObject) : undefined,
      },
    });

    if (coupon) {
      await tx.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    return { orderId: order.id };
  });

  return transaction;
};

export const synchronizeOrderPaymentStatus = async (orderId: string) => {
  const payment = await prisma.payment.findUnique({ where: { orderId } });
  if (!payment) throw new Error("Pagamento não encontrado");

  const statusResult = await paymentService.getPaymentStatus(payment.providerChargeId);
  const nextStatus = statusResult.status as PaymentStatusType;

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: nextStatus,
        paidAt: statusResult.paidAt,
        rawProviderResponse: statusResult.rawResponse ? (statusResult.rawResponse as Prisma.JsonObject) : undefined,
      },
    });

    await tx.order.update({
      where: { id: orderId },
      data: {
        status: mapPaymentToOrderStatus(nextStatus),
        paidAt: nextStatus === "PAID" ? statusResult.paidAt ?? new Date() : null,
        downloadsReleased: nextStatus === "PAID",
      },
    });
  });
};

export const processWebhook = async (payload: string, signature?: string) => {
  const validation = await paymentService.validateWebhook(payload, signature);
  if (!validation.valid) {
    throw new Error("Webhook inválido");
  }

  const parsed = await paymentService.parseWebhook(payload);
  if (!parsed) return;

  const payment = await prisma.payment.findUnique({ where: { providerChargeId: parsed.providerChargeId } });
  if (!payment) return;

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: parsed.status,
        paidAt: parsed.paidAt,
        rawWebhookPayload: JSON.parse(payload) as Prisma.JsonObject,
      },
    });

    await tx.order.update({
      where: { id: payment.orderId },
      data: {
        status: mapPaymentToOrderStatus(parsed.status),
        paidAt: parsed.status === "PAID" ? parsed.paidAt ?? new Date() : null,
        downloadsReleased: parsed.status === "PAID",
      },
    });
  });
};
