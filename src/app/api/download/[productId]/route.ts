import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { clientIp } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { storageService } from "@/services/storage/private-storage";

export async function GET(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { productId } = await params;

  const orderItem = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId: session.userId,
        status: "PAID",
      },
    },
    include: { product: true, order: true },
  });

  if (!orderItem) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const token = await storageService.createTemporaryDownloadToken({
    storageKey: orderItem.product.pdfStorageKey,
    userId: session.userId,
    productId,
    expiresInSeconds: 300,
  });

  await prisma.download.create({
    data: {
      userId: session.userId,
      productId,
      orderId: orderItem.orderId,
      ipAddress: clientIp(request),
      userAgent: request.headers.get("user-agent") || undefined,
    },
  });

  const url = new URL(`/api/download/token/${token}`, request.url);
  return NextResponse.json({ downloadUrl: url.toString(), expiresIn: 300 });
}
