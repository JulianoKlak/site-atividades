import { CouponType, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { paymentService } from "@/services/payment";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  productIds: z.array(z.string()).min(1),
  couponCode: z.string().optional(),
});

function applyCoupon(total: number, coupon: { type: CouponType; value: number }) {
  if (coupon.type === "PERCENTAGE") {
    return Math.round((total * coupon.value) / 100);
  }

  return Math.min(total, coupon.value);
}

export async function POST(request: NextRequest) {
  const sessionUser = await requireUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const ip = request.headers.get("x-forwarded-for") || "local";
  if (!rateLimit(`checkout:${ip}`, 20, 60_000)) {
    return NextResponse.json({ error: "Muitas tentativas" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: parsed.data.productIds }, isActive: true },
  });

  if (products.length !== parsed.data.productIds.length) {
    return NextResponse.json({ error: "Produtos inválidos" }, { status: 400 });
  }

  const subtotalInCents = products.reduce((sum, product) => sum + product.priceInCents, 0);
  let discountInCents = 0;
  let couponId: string | null = null;

  if (parsed.data.couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: parsed.data.couponCode } });
    if (!coupon || !coupon.isActive || (coupon.validUntil && coupon.validUntil < new Date())) {
      return NextResponse.json({ error: "Cupom inválido" }, { status: 400 });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: "Cupom esgotado" }, { status: 400 });
    }

    discountInCents = applyCoupon(subtotalInCents, coupon);
    couponId = coupon.id;
  }

  const totalInCents = Math.max(0, subtotalInCents - discountInCents);

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId: sessionUser.id,
        status: "PENDING",
        subtotalInCents,
        discountInCents,
        totalInCents,
        couponId: couponId || undefined,
        items: {
          createMany: {
            data: products.map((product) => ({
              productId: product.id,
              quantity: 1,
              unitPriceInCents: product.priceInCents,
            })),
          },
        },
      },
    });

    if (couponId) {
      await tx.coupon.update({ where: { id: couponId }, data: { usedCount: { increment: 1 } } });
    }

    return createdOrder;
  }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });

  const charge = await paymentService.createPixCharge({
    orderId: order.id,
    amountInCents: totalInCents,
    customer: {
      name: parsed.data.name,
      email: parsed.data.email,
    },
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      gateway: "pix-http",
      gatewayChargeId: charge.chargeId,
      status: "PENDING",
      amountInCents: totalInCents,
      pixQrCode: charge.qrCodeImage,
      pixCopyPaste: charge.copyPasteCode,
      rawResponse: charge.raw as Prisma.JsonObject,
    },
  });

  return NextResponse.json({
    orderId: order.id,
    status: order.status,
    totalInCents,
    pix: {
      qrCode: charge.qrCodeImage,
      copyPaste: charge.copyPasteCode,
      instructions: "Abra o app do banco, escolha PIX copia e cola, pague e aguarde a confirmação.",
    },
  });
}
