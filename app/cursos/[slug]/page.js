import { notFound } from "next/navigation";
import Link from "next/link";
import { getCourseBySlug } from "@/lib/db";
import EnrollForm from "@/components/EnrollForm";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export default async function CoursePage({ params }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course || !course.is_active) notFound();

  return (
    <main className="flex-1">
      <SiteHeader />
      <div className="bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Link href="/" className="text-paper/60 text-sm hover:text-paper">
            ← Volver a cursos
          </Link>
          <h1 className="font-display text-5xl md:text-7xl uppercase mt-5 max-w-2xl">{course.title}</h1>
          <p className="mt-4 text-brass uppercase text-sm tracking-wide">{course.duration}</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-14 grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <article className="prose-none">
          <p className="text-lg leading-relaxed whitespace-pre-line">
            {course.description}
          </p>
          <div className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-2">
            {course.includes ? (
              <div>
                <h2 className="font-display text-2xl uppercase">Incluye</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft/75">{course.includes}</p>
              </div>
            ) : null}
            {course.requirements ? (
              <div>
                <h2 className="font-display text-2xl uppercase">Requisitos</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft/75">{course.requirements}</p>
              </div>
            ) : null}
            {course.payment ? (
              <div>
                <h2 className="font-display text-2xl uppercase">Pago</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft/75">{course.payment}</p>
              </div>
            ) : null}
          </div>
        </article>

        <div>
          <EnrollForm course={course} />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
