import { NextResponse } from "next/server";
import { getEnrollmentsForReminders, markReminderSent } from "@/lib/db";
import { sendCourseReminder } from "@/lib/mail";

export async function GET(request) {
  const authorization = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const enrollments = await getEnrollmentsForReminders();
  let sent = 0;
  let failed = 0;
  for (const enrollment of enrollments) {
    try {
      const emailSent = await sendCourseReminder({
        to: enrollment.email,
        name: enrollment.full_name,
        courseTitle: enrollment.course_title,
        startDate: enrollment.start_date,
        duration: enrollment.duration,
        modality: enrollment.modality,
      });
      if (!emailSent) throw new Error("Configuración de email incompleta.");
      await markReminderSent(enrollment.id);
      sent += 1;
    } catch (error) {
      failed += 1;
      console.error(`No se pudo enviar el recordatorio a enrollment ${enrollment.id}:`, error);
    }
  }
  return NextResponse.json({ ok: failed === 0, sent, failed });
}
