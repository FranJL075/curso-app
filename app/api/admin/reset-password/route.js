import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "La recuperación por email está deshabilitada. Usa la contraseña única del administrador." }, { status: 410 });
}
