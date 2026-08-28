import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "site_atividades_session";
const TTL_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  userId: string;
  role: "CUSTOMER" | "ADMIN";
  exp: number;
};

function sign(input: string) {
  return crypto.createHmac("sha256", env.authSecret).update(input).digest("base64url");
}

function encode(payload: SessionPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = sign(body);
  return `${body}.${sig}`;
}

function decode(token: string): SessionPayload | null {
  const [body, signature] = token.split(".");
  if (!body || !signature || sign(body) !== signature) return null;

  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8")) as SessionPayload;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;

  return payload;
}

export async function createSessionCookie(userId: string, role: "CUSTOMER" | "ADMIN") {
  const token = encode({ userId, role, exp: Math.floor(Date.now() / 1000) + TTL_SECONDS });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TTL_SECONDS,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decode(token);
}

export function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decode(token);
}

export async function requireUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true },
  });

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}
