import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().int().min(1),
  validUntil: z.string().datetime().nullable().optional(),
  maxUses: z.number().int().min(1).nullable().optional(),
  isActive: z.boolean(),
});

function ensureAdmin(request: NextRequest) {
  const session = getSessionFromRequest(request);
  return Boolean(session && session.role === "ADMIN");
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!ensureAdmin(request)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const payload = await request.json();
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { id } = await params;

  const coupon = await prisma.coupon.update({
    where: { id },
    data: {
      type: parsed.data.type,
      value: parsed.data.value,
      validUntil: parsed.data.validUntil ? new Date(parsed.data.validUntil) : null,
      maxUses: parsed.data.maxUses ?? null,
      isActive: parsed.data.isActive,
    },
  });

  return NextResponse.json(coupon);
}
