import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function ensureAdmin(request: NextRequest) {
  const session = getSessionFromRequest(request);
  return Boolean(session && session.role === "ADMIN");
}

export async function GET(request: NextRequest) {
  if (!ensureAdmin(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const orders = await prisma.order.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: { include: { product: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
