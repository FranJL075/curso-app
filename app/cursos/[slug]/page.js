import { notFound } from "next/navigation";
import Link from "next/link";
import { getCourseBySlug } from "@/lib/db";
import EnrollForm from "@/components/EnrollForm";

export const dynamic = "force-dynamic";

export default async function CoursePage({ params }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course || !course.is_active) notFound();

  return (
    <main className="flex-1">
      <div className="bg-ink text-paper">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <Link href="/" className="text-paper/60 text-sm hover:text-paper">
            ← Volver a cursos
          </Link>
          <h1 className="font-display text-4xl mt-4 max-w-2xl">{course.title}</h1>
          <p className="mt-3 text-paper/70">{course.duration}</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-14 grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <article className="prose-none">
          <p className="text-lg leading-relaxed whitespace-pre-line">
            {course.description}
          </p>
        </article>

        <div>
          <EnrollForm course={course} />
        </div>
      </div>
    </main>
  );
}
