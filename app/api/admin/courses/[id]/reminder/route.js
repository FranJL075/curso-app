import { NextResponse } from "next/server";
import { Resend } from "resend";
import { isAdminRequest } from "@/lib/requireAdmin";
import { getCourseById, getEnrollmentsByCourse } from "@/lib/db";

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request, { params }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const course = getCourseById(id);
  if (!course) {
    return NextResponse.json({ error: "Curso no encontrado." }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Los datos no son válidos." }, { status: 400 });
  }

  const subject = clean(body?.subject);
  const message = clean(body?.message);
  if (!subject || !message) {
    return NextResponse.json(
      { error: "El asunto y el mensaje son obligatorios." },
      { status: 400 }
    );
  }
  if (subject.length > 200 || message.length > 10000) {
    return NextResponse.json(
      { error: "El asunto o el mensaje exceden el largo permitido." },
      { status: 400 }
    );
  }

  const recipients = getEnrollmentsByCourse(id).reduce((unique, enrollment) => {
    const email = clean(enrollment.email).toLowerCase();
    if (email && !unique.has(email)) unique.set(email, enrollment.full_name);
    return unique;
  }, new Map());

  if (recipients.size === 0) {
    return NextResponse.json(
      { error: "No hay inscriptos con email para este curso." },
      { status: 400 }
    );
  }

  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    return NextResponse.json(
      { error: "El servicio de email no está configurado en el servidor." },
      { status: 500 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const results = await Promise.all(
    [...recipients].map(async ([email, fullName]) => {
      const greeting = fullName ? `Hola ${fullName},\n\n` : "";
      try {
        const { error } = await resend.emails.send({
          from: process.env.EMAIL_FROM,
          to: email,
          subject,
          text: `${greeting}${message}`,
        });
        return !error;
      } catch {
        return false;
      }
    })
  );

  const sent = results.filter(Boolean).length;
  const failed = results.length - sent;
  if (sent === 0) {
    return NextResponse.json(
      {
        error: "No se pudo enviar ningún email. Revisá la configuración del servicio.",
        sent,
        failed,
        total: results.length,
      },
      { status: 502 }
    );
  }
  return NextResponse.json({ sent, failed, total: results.length });
}
