import Link from "next/link";
import { getAllCourses, getAllEnrollments } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [courses, enrollments] = await Promise.all([
    getAllCourses(),
    getAllEnrollments(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl">Cursos</h1>
          <p className="text-ink-soft/70 text-sm mt-1">
            {enrollments.length} inscripciones en total
          </p>
        </div>
        <Link
          href="/admin/cursos/nuevo"
          className="bg-brass text-ink font-medium px-5 py-2.5 hover:bg-brass-dark transition-colors"
        >
          + Nuevo curso
        </Link>
      </div>

      {courses.length === 0 ? (
        <p className="text-ink-soft/60 border border-line p-8 text-center">
          Todavía no cargaste ningún curso.
        </p>
      ) : (
        <div className="divide-y divide-line border border-line bg-panel">
          {courses.map((course) => {
            const count = enrollments.filter((e) => e.course_id === course.id).length;
            return (
              <Link
                key={course.id}
                href={`/admin/cursos/${course.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-white transition-colors"
              >
                <div>
                  <p className="font-medium">
                    {course.title}
                    {!course.is_active ? (
                      <span className="ml-2 text-xs text-ink-soft/50">(oculto)</span>
                    ) : null}
                  </p>
                  <p className="text-sm text-ink-soft/60">{course.duration}</p>
                </div>
                <span className="text-sm text-ink-soft/70">{count} inscriptos</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
