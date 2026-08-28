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
});

function ensureAdmin(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session || session.role !== "ADMIN") {
    return false;
  }

  return true;
}

export async function GET(request: NextRequest) {
  if (!ensureAdmin(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const products = await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  if (!ensureAdmin(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const payload = await request.json();
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      ...parsed.data,
      slug: toSlug(parsed.data.title),
    },
  });

  return NextResponse.json(product, { status: 201 });
}
