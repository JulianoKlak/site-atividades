import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      title: searchParams.get("q") ? { contains: searchParams.get("q")!, mode: "insensitive" } : undefined,
      schoolYear: searchParams.get("ano") || undefined,
      subject: searchParams.get("disciplina") || undefined,
      materialType: searchParams.get("tipo") || undefined,
      priceInCents: {
        gte: searchParams.get("precoMin") ? Number(searchParams.get("precoMin")) * 100 : undefined,
        lte: searchParams.get("precoMax") ? Number(searchParams.get("precoMax")) * 100 : undefined,
      },
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
