import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/requireAdmin";
import { getSiteSetting, setSiteSetting } from "@/lib/db";

export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  return NextResponse.json({ courses_banner_url: await getSiteSetting("courses_banner_url") });
}

export async function PUT(request) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const { value } = await request.json().catch(() => ({}));
  if (value && (typeof value !== "string" || value.length > 2000)) return NextResponse.json({ error: "URL no válida." }, { status: 400 });
  await setSiteSetting("courses_banner_url", value || null);
  return NextResponse.json({ ok: true });
}
