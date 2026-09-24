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
  for (const enrollment of enrollments) {
    await sendCourseReminder({
      to: enrollment.email,
      name: enrollment.full_name,
      courseTitle: enrollment.course_title,
      startDate: enrollment.start_date,
    });
    await markReminderSent(enrollment.id);
    sent += 1;
  }
  return NextResponse.json({ ok: true, sent });
}
