import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/requireAdmin";
import { getCourseById, getEnrollmentsByCourse, markEnrollmentReminderSent } from "@/lib/db";
import { sendEmail, formatCourseDate } from "@/lib/mail";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_SUBJECT_LENGTH = 180;
const MAX_MESSAGE_LENGTH = 10000;

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character]);
}

function personalize(value, enrollment, courseTitle) {
  return value.replaceAll("{{nombre}}", enrollment.full_name).replaceAll("{{curso}}", courseTitle);
}

function textToHtml(value) {
  return escapeHtml(value).replaceAll("\n", "<br />");
}

export async function POST(request, { params }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { id } = await params;
  if (!/^\d+$/.test(String(id))) return NextResponse.json({ error: "Curso inválido." }, { status: 400 });

  const data = await request.json().catch(() => ({}));
  const subject = typeof data.subject === "string" ? data.subject.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";
  if (!subject || subject.length > MAX_SUBJECT_LENGTH) return NextResponse.json({ error: "El asunto es obligatorio y demasiado largo." }, { status: 400 });
  if (!message || message.length > MAX_MESSAGE_LENGTH) return NextResponse.json({ error: "El mensaje es obligatorio y demasiado largo." }, { status: 400 });

  const course = await getCourseById(id);
  if (!course) return NextResponse.json({ error: "Curso no encontrado." }, { status: 404 });

  const enrollments = (await getEnrollmentsByCourse(id)).filter(
    (enrollment) => !enrollment.reminder_sent_at
      && EMAIL_PATTERN.test(enrollment.email)
  );
  if (enrollments.length === 0) return NextResponse.json({ error: "No hay inscriptos pendientes con email válido." }, { status: 400 });

  const testMode = process.env.EMAIL_TEST_MODE === "true";
  const testRecipient = process.env.EMAIL_TEST_RECIPIENT;
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM || (testMode && !EMAIL_PATTERN.test(testRecipient || ""))) {
    console.error("Configuración de email incompleta para recordatorios.");
    return NextResponse.json({ error: "El servicio de email no está configurado." }, { status: 500 });
  }

  const results = await Promise.allSettled(enrollments.map(async (enrollment) => {
    const personalizedMessage = personalize(message, enrollment, course.title);
    const courseDetails = [
      `Curso: ${course.title}`,
      course.start_date && `Fecha: ${formatCourseDate(course.start_date)}`,
      course.duration && `Duración: ${course.duration}`,
      course.modality && `Modalidad: ${course.modality}`,
    ].filter(Boolean);
    const completeMessage = `${personalizedMessage}\n\n${courseDetails.join("\n")}`;
    const sent = await sendEmail({
      to: testMode ? testRecipient : enrollment.email,
      subject: personalize(subject, enrollment, course.title),
      text: completeMessage,
      html: `<p>${textToHtml(personalizedMessage)}</p><ul>${courseDetails.map((detail) => `<li>${textToHtml(detail)}</li>`).join("")}</ul>`,
    });
    if (!sent) throw new Error("Email no enviado: configuración incompleta de Resend.");
    if (!testMode) await markEnrollmentReminderSent(enrollment.id);
  }));

  const sent = results.filter((result) => result.status === "fulfilled").length;
  const failed = results.length - sent;
  results.forEach((result, index) => {
    if (result.status === "rejected") console.error("Falló el recordatorio para enrollment", enrollments[index].id, result.reason);
  });
  if (sent === 0) return NextResponse.json({ error: "No se pudieron enviar los recordatorios." }, { status: 502 });
  return NextResponse.json({
    sent,
    failed,
    total: results.length,
    message: failed ? `Se enviaron ${sent} de ${results.length} recordatorios. ${failed} envíos fallaron.` : `Recordatorio enviado correctamente a ${sent} inscriptos.`,
  });
}
