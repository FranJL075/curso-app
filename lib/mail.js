async function sendEmail({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    console.warn("Email omitido: RESEND_API_KEY y EMAIL_FROM no están configuradas.");
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: process.env.EMAIL_FROM, to, subject, html }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`No se pudo enviar el email: ${detail}`);
  }
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

export async function sendCourseReminder({ to, name, courseTitle, startDate }) {
  return sendEmail({
    to,
    subject: `Recordatorio de tu curso: ${courseTitle}`,
    html: `<p>Hola ${escapeHtml(name)},</p><p>Te recordamos que tu curso <strong>${escapeHtml(courseTitle)}</strong> comienza el ${escapeHtml(startDate)}.</p>`,
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  }[character]));
}
