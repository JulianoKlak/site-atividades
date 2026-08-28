import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/slug";

const schema = z.object({
  title: z.string().min(3),
  shortDescription: z.string().min(5),
  description: z.string().min(10),
  priceInCents: z.number().int().min(100),
  pagesCount: z.number().int().min(1),
  schoolYear: z.string().min(2),
  subject: z.string().min(2),
  materialType: z.string().min(2),
  coverImageUrl: z.string().url(),
  previewImageUrls: z.array(z.string().url()).default([]),
  includedItems: z.array(z.string()).default([]),
  pdfStorageKey: z.string().min(3),
  categoryId: z.string(),
  isActive: z.boolean(),
});

function ensureAdmin(request: NextRequest) {
  const session = getSessionFromRequest(request);
  return Boolean(session && session.role === "ADMIN");
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!ensureAdmin(request)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  const { id } = await params;

  const product = await prisma.product.findUnique({ where: { id } });
  return product ? NextResponse.json(product) : NextResponse.json({ error: "Não encontrado" }, { status: 404 });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!ensureAdmin(request)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  const payload = await request.json();
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = await params;

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...parsed.data,
      slug: toSlug(parsed.data.title),
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!ensureAdmin(request)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  const { id } = await params;

  const product = await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });

  return NextResponse.json(product);
}
