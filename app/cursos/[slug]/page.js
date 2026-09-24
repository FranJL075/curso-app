import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCourseBySlug } from "@/lib/db";
import EnrollForm from "@/components/EnrollForm";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export default async function CoursePage({ params }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course || !course.is_active) notFound();

  return (
    <main className="flex-1">
      <SiteHeader />
      <div className="relative isolate min-h-[520px] overflow-hidden bg-ink text-paper md:min-h-[600px]">
        {course.image_url ? (
          <Image
            src={course.image_url}
            alt=""
            fill
            sizes="100vw"
            quality={100}
            className="-z-20 object-cover"
            priority
          />
        ) : null}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/55 to-black/15" />
        <div className="mx-auto flex min-h-[520px] max-w-6xl flex-col justify-end px-6 py-10 md:min-h-[600px] md:py-14">
          <Link href="/" className="text-paper/60 text-sm hover:text-paper">
            ← Volver a cursos
          </Link>
          <h1 className="mt-5 max-w-3xl font-display text-5xl uppercase leading-[0.9] md:text-8xl">{course.title}</h1>
          <p className="mt-5 text-sm uppercase tracking-wide text-brass">{course.duration}</p>
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
