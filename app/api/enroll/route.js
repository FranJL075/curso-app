import { NextResponse } from "next/server";
import { createEnrollment, getCourseById } from "@/lib/db";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Los datos no son válidos." }, { status: 400 });
  }

  const { courseId, fullName, email, phone, message, wantsReminders } = body || {};
  const normalizedName = clean(fullName);
  const normalizedEmail = clean(email).toLowerCase();
  const normalizedPhone = clean(phone);
  const normalizedMessage = clean(message);

  if (!courseId || !normalizedName || !normalizedEmail || !normalizedPhone) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios." },
      { status: 400 }
    );
  }
  if (!isValidEmail(normalizedEmail)) {
    return NextResponse.json({ error: "El email no es válido." }, { status: 400 });
  }
  if (normalizedName.length > 100 || normalizedPhone.length > 30 || normalizedMessage.length > 1000) {
    return NextResponse.json({ error: "Revisá el largo de los datos ingresados." }, { status: 400 });
  }

  const course = await getCourseById(courseId);
  if (!course || !course.is_active) {
    return NextResponse.json({ error: "El curso no existe o no está activo." }, { status: 404 });
  }

  // Nota: acá es donde en el futuro se dispararía la creación del checkout de
  // pago (Mercado Pago / Stripe) si course.is_paid === 1, antes o después de
  // guardar la inscripción, según el flujo que se elija.
 
  try {
  await createEnrollment({
    courseId: course.id,
    fullName: normalizedName,
    email: normalizedEmail,
    phone: normalizedPhone,
    message: normalizedMessage,
    wantsReminders: Boolean(wantsReminders),
  });
} catch (error) {
  console.error("No se pudo guardar la inscripción:", error);

  const message = error.message.includes("DATABASE_URL")
    ? error.message
    : "No se pudo guardar la inscripción.";

  return NextResponse.json({ error: message }, { status: 500 });
}

const { sendEnrollmentConfirmation } = await import("@/lib/mail");

await sendEnrollmentConfirmation({
  to: normalizedEmail,
  name: normalizedName,
  courseTitle: course.title,
}).catch((error) => {
  console.error("No se pudo enviar la confirmación:", error);
});

return NextResponse.json({ ok: true }, { status: 201 });
}
