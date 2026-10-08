import { NextResponse } from "next/server";
import { createEnrollment, getCourseById } from "@/lib/db";
import { sendEnrollmentConfirmation, sendEnrollmentNotification } from "@/lib/mail";

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

  const { courseId, fullName, email, phone, message } = body || {};
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

  let course;
  try {
    course = await getCourseById(courseId);
  } catch (error) {
    console.error("No se pudo consultar el curso para la inscripción:", error);
    return NextResponse.json(
      { error: "No se pudo procesar la inscripción. Intentá nuevamente." },
      { status: 500 }
    );
  }
  if (!course || !course.is_active) {
    return NextResponse.json({ error: "El curso no existe o no está activo." }, { status: 404 });
  }

  // Nota: acá es donde en el futuro se dispararía la creación del checkout de
  // pago (Mercado Pago / Stripe) si course.is_paid === 1, antes o después de
  // guardar la inscripción, según el flujo que se elija.
 
  let enrollment;
  try {
    enrollment = await createEnrollment({
      courseId: course.id,
      fullName: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      message: normalizedMessage,
    });
  } catch (error) {
    console.error("No se pudo guardar la inscripción:", error);
    return NextResponse.json(
      { error: "No se pudo guardar la inscripción. Intentá nuevamente." },
      { status: 500 }
    );
  }

  for (const [description, send] of [
    ["alerta administrativa", () => sendEnrollmentNotification({ enrollment, course })],
    ["confirmación al alumno", () => sendEnrollmentConfirmation({
      to: normalizedEmail,
      name: normalizedName,
      courseTitle: course.title,
      startDate: course.start_date,
    })],
  ]) {
    try {
      const sent = await send();
      if (!sent) console.error(`No se pudo enviar la ${description} de la inscripción ${enrollment.id}.`);
    } catch (error) {
      console.error(`No se pudo enviar la ${description} de la inscripción ${enrollment.id}:`, error);
    }
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
