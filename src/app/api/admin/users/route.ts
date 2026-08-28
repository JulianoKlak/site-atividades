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

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}
