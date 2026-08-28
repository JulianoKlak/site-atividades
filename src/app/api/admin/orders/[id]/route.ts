import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  status: z.enum(["PENDING", "PAID", "CANCELLED", "EXPIRED"]),
});

function ensureAdmin(request: NextRequest) {
  const session = getSessionFromRequest(request);
  return Boolean(session && session.role === "ADMIN");
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!ensureAdmin(request)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true, items: { include: { product: true } }, payment: true },
  });

  return order ? NextResponse.json(order) : NextResponse.json({ error: "Não encontrado" }, { status: 404 });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!ensureAdmin(request)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const payload = await request.json();
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { id } = await params;

  const order = await prisma.order.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json(order);
}
