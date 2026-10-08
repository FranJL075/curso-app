import Link from "next/link";
import Image from "next/image";
import { formatCoursePrice } from "@/lib/coursePricing";
import { formatCourseDate } from "@/lib/courseDate";

export default function CourseCard({ course }) {
  return (
    <article className="group flex h-[480px] flex-col border border-line bg-panel transition-all hover:-translate-y-1 hover:border-brass md:h-[485px]">
      {course.start_date ? (
        <div className="flex min-h-12 flex-wrap items-center justify-center gap-x-3 gap-y-0.5 bg-teal px-4 py-2 text-center text-paper md:px-6">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-paper/75">
            Fecha de inicio
          </span>
          <span className="font-display text-lg uppercase leading-tight md:text-xl">
            {formatCourseDate(course.start_date)}
          </span>
        </div>
      ) : null}
      <div className="grid min-h-0 flex-1 md:grid-cols-[minmax(150px,34%)_1fr]">
        <Link href={`/cursos/${course.slug}`} className="relative block h-44 w-full shrink-0 border-b border-line bg-teal md:min-h-40 md:h-full md:border-b-0" aria-label={`Ver ${course.title}`}>
          {course.image_url ? (
            <Image
              src={course.image_url}
              alt={course.title}
              fill
              sizes="(min-width: 1280px) 392px, (min-width: 768px) 34vw, 100vw"
              quality={100}
              className="object-cover"
            />
          ) : null}
        </Link>
        <div className="relative flex min-h-0 flex-col p-4 pt-5 pb-14 md:p-7 md:pb-20">
          <div className="hidden items-baseline justify-between gap-4 text-xs uppercase tracking-wide text-ink-soft/60 md:flex">
            <span>{course.modality || course.duration}</span>
          </div>
          <p className="mt-4 hidden text-xs font-semibold uppercase tracking-wide text-brass md:block">{course.category}</p>
          <h3 className="mt-0 font-display text-2xl uppercase transition-colors group-hover:text-brass md:mt-4 md:text-3xl">
            <Link href={`/cursos/${course.slug}`}>{course.title}</Link>
          </h3>
          <p className="mt-3 hidden text-ink-soft/75 text-sm leading-relaxed md:block">{course.summary}</p>
          {course.includes ? <p className="mt-3 text-xs leading-relaxed text-ink-soft/60 md:mt-4"><strong>Incluye:</strong> {course.includes}</p> : null}
          <p className="mt-auto pt-3 text-sm font-semibold uppercase tracking-wide text-teal md:pt-5">{formatCoursePrice(course)}</p>
          <Link
            href={`/cursos/${course.slug}`}
            className="absolute bottom-0 right-0 bg-teal px-4 py-3 text-xs font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-ink"
          >
            Inscribirse
          </Link>
        </div>
      </div>
    </article>
  );
}
