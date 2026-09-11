import Hero from "@/components/Hero";
import CourseCard from "@/components/CourseCard";
import { getActiveCourses } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const courses = getActiveCourses();

  return (
    <main className="flex-1">
      <Hero />

      <section id="cursos" className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="font-display text-3xl mb-2">Cursos disponibles</h2>
        <p className="text-ink-soft/70 mb-10">
          Elegí un curso para ver el detalle e inscribirte.
        </p>

        {courses.length === 0 ? (
          <p className="text-ink-soft/60 border border-line p-8 text-center">
            Todavía no hay cursos cargados. Entrá al panel de administración para crear el primero.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-ink-soft/60 flex justify-between">
          <span>Academia Cursos</span>
          <a href="/admin" className="hover:text-ink-soft">
            Ingreso administradores
          </a>
        </div>
      </footer>
    </main>
  );
}
