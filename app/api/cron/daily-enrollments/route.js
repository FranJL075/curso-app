import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  claimDailyEnrollmentDigest,
  getEnrollmentsForEasternDate,
  markDailyEnrollmentDigestSent,
  releaseDailyEnrollmentDigest,
} from "@/lib/db";
import { formatEasternDateTime, sendEmail } from "@/lib/mail";

const TIME_ZONE = "America/New_York";

function getEasternDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function formatDigestDate(date) {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("es-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  }[character]));
}

function buildDigest(enrollments, date) {
  const grouped = new Map();
  for (const enrollment of enrollments) {
    grouped.set(enrollment.course_title, (grouped.get(enrollment.course_title) || 0) + 1);
  }

  const displayDate = formatDigestDate(date);
  const title = `Resumen diario de inscripciones — ${displayDate}`;
  const groupLines = [...grouped].map(([courseTitle, count]) => `${courseTitle}: ${count}`);
  const detailLines = enrollments.map((enrollment) =>
    `${enrollment.full_name} | ${enrollment.email} | ${enrollment.course_title} | ${formatEasternDateTime(enrollment.created_at)}`
  );
  const text = enrollments.length
    ? `${title}\n\nTotal de personas inscriptas: ${enrollments.length}\n\nPor curso:\n${groupLines.join("\n")}\n\nDetalle:\n${detailLines.join("\n")}`
    : `${title}\n\nTotal de personas inscriptas: 0\n\nHoy no se registraron nuevas inscripciones.`;
  const groupsHtml = groupLines.length
    ? `<ul>${groupLines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>`
    : "<p>Hoy no se registraron nuevas inscripciones.</p>";
  const detailsHtml = enrollments.length
    ? `<h2>Detalle</h2><ul>${enrollments.map((enrollment) => `<li><strong>${escapeHtml(enrollment.full_name)}</strong> · ${escapeHtml(enrollment.email)} · ${escapeHtml(enrollment.course_title)} · ${escapeHtml(formatEasternDateTime(enrollment.created_at))}</li>`).join("")}</ul>`
    : "";

  return {
    subject: title,
    text,
    html: `<h1>${escapeHtml(title)}</h1><p>Total de personas inscriptas: <strong>${enrollments.length}</strong></p><h2>Por curso</h2>${groupsHtml}${detailsHtml}`,
  };
}

export async function GET(request) {
  const authorization = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const recipients = (process.env.ENROLLMENT_NOTIFICATION_TO || "")
    .split(",").map((email) => email.trim()).filter(Boolean);
  if (recipients.length === 0) {
    console.error("Resumen diario no enviado: falta ENROLLMENT_NOTIFICATION_TO.");
    return NextResponse.json({ error: "Falta configurar el destinatario del resumen." }, { status: 503 });
  }

  const date = getEasternDate();
  const token = randomUUID();
  try {
    const claimed = await claimDailyEnrollmentDigest(date, token);
    if (!claimed) return NextResponse.json({ ok: true, skipped: true, date });

    const enrollments = await getEnrollmentsForEasternDate(date);
    const digest = buildDigest(enrollments, date);
    const cc = (process.env.ENROLLMENT_NOTIFICATION_CC || "")
      .split(",").map((email) => email.trim()).filter(Boolean);
    const sent = await sendEmail({ to: recipients, cc, ...digest });
    if (!sent) throw new Error("Configuración de Resend incompleta.");
    await markDailyEnrollmentDigestSent(date, token);
    return NextResponse.json({ ok: true, date, total: enrollments.length });
  } catch (error) {
    await releaseDailyEnrollmentDigest(date, token).catch((releaseError) => {
      console.error(`No se pudo liberar el resumen de ${date}:`, releaseError);
    });
    console.error(`No se pudo enviar el resumen diario de ${date}:`, error);
    return NextResponse.json({ error: "No se pudo enviar el resumen diario." }, { status: 500 });
  }
}