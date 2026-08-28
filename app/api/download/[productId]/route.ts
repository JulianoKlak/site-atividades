import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { privateStorageService } from "@/services/storage";

export async function GET(request: Request, context: RouteContext<"/api/download/[productId]">) {
  const { productId } = await context.params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  const paidOrder = await prisma.order.findFirst({
    where: {
      userId: session.user.id,
      status: "PAID",
      items: {
        some: {
          productId,
        },
      },
    },
    include: {
      items: {
        where: { productId },
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const item = paidOrder?.items[0];
  if (!paidOrder || !item) {
    return NextResponse.json({ message: "Você não possui este material." }, { status: 403 });
  }

  const signedUrl = await privateStorageService.getSignedDownloadUrl(item.product.fileKey);

  const headers = request.headers;
  await prisma.download.create({
    data: {
      userId: session.user.id,
      productId,
      orderId: paidOrder.id,
      ipAddress: headers.get("x-forwarded-for") ?? "",
      userAgent: headers.get("user-agent") ?? "",
    },
  });

  return NextResponse.redirect(signedUrl);
}
