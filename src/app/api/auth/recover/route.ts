import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getBody } from "@/lib/http";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  const body = await getBody(request);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
  }

  return NextResponse.redirect(new URL("/login", request.url));
}
