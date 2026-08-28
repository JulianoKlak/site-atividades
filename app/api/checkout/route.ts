import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { createOrderWithPix } from "@/lib/shop";

const checkoutSchema = z.object({
  productIds: z.array(z.string().cuid()).min(1),
  couponCode: z.string().trim().min(1).max(32).optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados de checkout inválidos." }, { status: 400 });
  }

  const result = await createOrderWithPix({
    userId: session.user.id,
    productIds: parsed.data.productIds,
    couponCode: parsed.data.couponCode,
  });

  return NextResponse.json(result, { status: 201 });
}
