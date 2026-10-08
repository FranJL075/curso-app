import "server-only";

import { Resend } from "resend";

let resendClient;
let configuredApiKey;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Email no enviado: falta configurar RESEND_API_KEY.");
    return null;
  }
  if (!resendClient || configuredApiKey !== apiKey) {
    resendClient = new Resend(apiKey);
    configuredApiKey = apiKey;
  }
  return resendClient;
}

function parseRecipients(value) {
  return (value || "").split(",").map((email) => email.trim()).filter(Boolean);
}

export async function sendEmail({ to, cc, subject, html, text }) {
  const from = process.env.EMAIL_FROM;
  const resend = getResendClient();
  if (!from) console.error("Email no enviado: falta configurar EMAIL_FROM.");
  if (!resend || !from) return false;

  const { error } = await resend.emails.send({
    from,
    to,
    ...(cc?.length ? { cc } : {}),
    subject,
    ...(html ? { html } : {}),
    ...(text ? { text } : {}),
  });
  if (error) throw new Error(`Resend rechazó el email: ${error.message}`);
  return true;
}

export async function sendPasswordResetEmail({ to, name, resetUrl }) {
  return sendEmail({
    to,
    subject: "Restablece tu contraseña",
    html: `<p>Hola ${escapeHtml(name)},</p><p>Usa este enlace para crear una nueva contraseña:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>El enlace vence en una hora y solo puede utilizarse una vez.</p>`,
  });
}

export async function sendEnrollmentConfirmation({ to, name, courseTitle }) {
  return sendEmail({
    to,
    subject: `Inscripción confirmada: ${courseTitle}`,
    html: `<p>Hola ${escapeHtml(name)},</p><p>Recibimos tu inscripción a <strong>${escapeHtml(courseTitle)}</strong>. Te contactaremos con los próximos pasos.</p>`,
  });
}

export async function sendEnrollmentNotification({ enrollment, course }) {
  const to = parseRecipients(process.env.ENROLLMENT_NOTIFICATION_TO);
  if (to.length === 0) {
    console.error("Alerta de inscripción no enviada: falta ENROLLMENT_NOTIFICATION_TO.");
    return false;
  }

  const cc = parseRecipients(process.env.ENROLLMENT_NOTIFICATION_CC);
  const details = [
    ["Nombre y apellido", enrollment.full_name],
    ["Email", enrollment.email],
    ["Teléfono", enrollment.phone],
    ["Curso", course.title],
    ["Fecha del curso", formatCourseDate(course.start_date)],
    ["Fecha y hora de inscripción", formatEasternDateTime(enrollment.created_at)],
  ].filter(([, value]) => value);
  const rows = details.map(([label, value]) =>
    `<tr><th style="padding:8px 12px;text-align:left">${escapeHtml(label)}</th><td style="padding:8px 12px">${escapeHtml(value)}</td></tr>`
  ).join("");

  return sendEmail({
    to,
    cc,
    subject: `Nueva inscripción — ${course.title}`,
    html: `<h1>Nueva inscripción</h1><table style="border-collapse:collapse">${rows}</table>`,
  });
}

export async function sendCourseReminder({ to, name, courseTitle, startDate, duration, modality }) {
  const courseDetails = [
    startDate && `Fecha: ${formatCourseDate(startDate)}`,
    duration && `Duración: ${duration}`,
    modality && `Modalidad: ${modality}`,
  ].filter(Boolean);
  const detailsHtml = courseDetails.length
    ? `<ul>${courseDetails.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "";
  return sendEmail({
    to,
    subject: `Recordatorio de tu curso: ${courseTitle}`,
    html: `<p>Hola ${escapeHtml(name)},</p><p>Te recordamos la información de tu curso <strong>${escapeHtml(courseTitle)}</strong>.</p>${detailsHtml}`,
  });
}

export function formatCourseDate(value) {
  if (!value) return "";
  const [year, month, day] = String(value).slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return String(value);
  return new Intl.DateTimeFormat("es-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function formatEasternDateTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("es-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  }[character]));
}
