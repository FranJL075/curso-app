import { notFound } from "next/navigation";
import { getCourseById, getEnrollmentsByCourse } from "@/lib/db";
import CourseForm from "@/components/CourseForm";
import DeleteCourseButton from "@/components/DeleteCourseButton";
import SendReminderButton from "@/components/SendReminderButton";

export const dynamic = "force-dynamic";

export default async function EditCoursePage({ params }) {
  const { id } = await params;
  const course = getCourseById(id);
  if (!course) notFound();
  const enrollments = getEnrollmentsByCourse(id);

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl">Editar curso</h1>
          <DeleteCourseButton courseId={course.id} />
        </div>
        <CourseForm courseId={course.id} initialCourse={course} />
      </div>

      <div>
        <div className="mb-4 flex flex-nowrap items-center">
          <h2 className="shrink-0 whitespace-nowrap font-display text-xl">
            Inscriptos ({enrollments.length})
          </h2>
          <div className="ml-[200px] flex flex-nowrap gap-2">
            <SendReminderButton
              courseId={course.id}
              courseTitle={course.title}
              recipientCount={enrollments.length}
            />
            <a
              href={`/api/admin/courses/${course.id}/contacts`}
              download
              className="shrink-0 bg-teal px-3 py-2 text-xs font-semibold uppercase tracking-wide text-paper hover:bg-ink transition-colors"
            >
              Descargar Excel
            </a>
          </div>
        </div>
        {enrollments.length === 0 ? (
          <p className="text-left text-ink-soft/60 text-sm">Todavía no hay inscripciones.</p>
        ) : (
          <div className="divide-y divide-line border border-line bg-panel text-sm">
            {enrollments.map((en) => (
              <div key={en.id} className="p-4">
                <p className="font-medium">{en.full_name}</p>
                <p className="text-ink-soft/70">{en.email}</p>
                <p className="text-ink-soft/70">{en.phone}</p>
                {course.is_paid ? (
                  <p className="mt-1 text-xs uppercase tracking-wide text-brass-dark">
                    {en.payment_status === "paid" ? "Pagado" : "Pago pendiente"}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
