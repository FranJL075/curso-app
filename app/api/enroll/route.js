import { NextResponse } from "next/server";
import { createEnrollment, getCourseById } from "@/lib/db";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const { courseId, fullName, email, phone } = body || {};

  if (!courseId || !fullName || !email || !phone) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios." },
      { status: 400 }
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "El email no es válido." }, { status: 400 });
  }

  const course = getCourseById(courseId);
  if (!course || !course.is_active) {
    return NextResponse.json({ error: "El curso no existe o no está activo." }, { status: 404 });
  }

  // Nota: acá es donde en el futuro se dispararía la creación del checkout de
  // pago (Mercado Pago / Stripe) si course.is_paid === 1, antes o después de
  // guardar la inscripción, según el flujo que se elija.
  const enrollment = createEnrollment({
    courseId: course.id,
    fullName: String(fullName).trim(),
    email: String(email).trim().toLowerCase(),
    phone: String(phone).trim(),
  });

  return NextResponse.json({ ok: true, enrollment }, { status: 201 });
}
