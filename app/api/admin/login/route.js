import { NextResponse } from "next/server";
import { verifyCredentials, createSessionCookieValue, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function POST(request) {
  const { email, password } = await request.json().catch(() => ({}));
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const user = normalizedEmail && typeof password === "string"
    ? await verifyCredentials(normalizedEmail, password)
    : null;

  if (!user) {
    return NextResponse.json({ error: "Email o contraseña incorrectos." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, createSessionCookieValue(user.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 horas
  });
  return res;
}
