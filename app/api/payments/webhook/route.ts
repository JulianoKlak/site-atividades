import { NextResponse } from "next/server";
import { processWebhook } from "@/lib/shop";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("x-signature") ?? undefined;

  try {
    await processWebhook(payload, signature);
  } catch {
    return NextResponse.json({ message: "Webhook inválido." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
