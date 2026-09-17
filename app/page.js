import Hero from "@/components/Hero";
import CourseCard from "@/components/CourseCard";
import { getActiveCourses } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const courses = getActiveCourses();

  return (
    <main className="flex-1">
      <header className="bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-6">
          <Link href="/" className="font-display text-2xl uppercase tracking-[0.16em]">Academia</Link>
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wide">
            <a href="#cursos" className="hover:text-brass transition-colors">Clases</a>
            <a href="#membresia" className="hover:text-brass transition-colors">Membresía</a>
            <a href="#garantia" className="hover:text-brass transition-colors">Garantía</a>
            <a href="/admin" className="border border-paper/40 px-3 py-2 hover:border-brass hover:text-brass transition-colors">Ingresar</a>
          </nav>
        </div>
      </header>
      <Hero />

      <section id="membresia" className="bg-brass text-ink">
        <div className="mx-auto max-w-6xl px-6 py-10 md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-semibold">Membresía anual</p>
            <h2 className="font-display text-4xl uppercase mt-2">Acceso a todos los cursos y nuevos lanzamientos</h2>
          </div>
          <a href="#cursos" className="inline-block shrink-0 mt-6 md:mt-0 bg-ink text-paper px-6 py-3 text-sm font-semibold uppercase hover:bg-teal transition-colors">Conocer la membresía</a>
        </div>
      </section>

      <section id="cursos" className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="mb-10 flex items-end justify-between gap-5">
          <div>
            <p className="text-brass text-xs uppercase tracking-[0.2em] font-semibold mb-3">Aprendé a tu ritmo</p>
            <h2 className="font-display text-5xl uppercase">Clases online</h2>
          </div>
          <p className="hidden md:block max-w-xs text-right text-sm text-ink-soft/60">Elegí una clase, mirá el detalle y reservá tu lugar.</p>
        </div>

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

      <section id="garantia" className="bg-teal text-paper">
        <div className="mx-auto max-w-6xl px-6 py-14 md:flex md:items-center md:justify-between md:gap-10">
          <div>
            <p className="text-brass text-xs uppercase tracking-[0.2em] font-semibold mb-3">Garantía de satisfacción</p>
            <h2 className="font-display text-4xl uppercase">Probá tu curso con tranquilidad</h2>
          </div>
          <p className="mt-5 md:mt-0 max-w-xl text-paper/75 leading-relaxed">Tenés 7 días para probar la experiencia. Si no cumple tus expectativas, escribinos y te ayudamos a resolverlo.</p>
        </div>
      </section>

      <footer className="bg-ink text-paper/60">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm flex justify-between gap-5">
          <span className="font-display uppercase tracking-wide">Academia Cursos</span>
          <a href="/admin" className="hover:text-ink-soft">
            Ingreso administradores
          </a>
        </div>
      </footer>
    </main>
  );
}
