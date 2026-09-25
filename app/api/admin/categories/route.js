import { NextResponse } from "next/server";
import { createCategory, getAllCategories } from "@/lib/db";
import { isAdminRequest } from "@/lib/requireAdmin";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  return NextResponse.json({ categories: await getAllCategories() });
}

export async function POST(request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const data = await request.json().catch(() => ({}));
  const name = String(data.name || "").trim();
  if (!name) {
    return NextResponse.json({ error: "El nombre de la categoría es obligatorio." }, { status: 400 });
  }
  if (name.length > 30) {
    return NextResponse.json({ error: "La categoría no puede superar los 30 caracteres." }, { status: 400 });
  }

  const category = await createCategory(name);
  return NextResponse.json({ category }, { status: 201 });
}
