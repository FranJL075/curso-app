import Link from "next/link";
import Image from "next/image";

function formatPrice(course) {
  if (course.price_label) return course.price_label;
  if (!course.is_paid) return "Sin costo";
  const amount = (course.price_cents || 0) / 100;
  return amount.toLocaleString("es-AR", {
    style: "currency",
    currency: course.currency || "ARS",
    maximumFractionDigits: 0,
  });
}

export default function CourseCard({ course }) {
  return (
    <article className="group block h-full min-h-[500px] border border-line bg-panel transition-all hover:-translate-y-1 hover:border-brass md:min-h-[440px]">
      <div className="grid h-full md:grid-cols-[minmax(150px,34%)_1fr]">
        <Link href={`/cursos/${course.slug}`} className="relative block min-h-40 h-full bg-teal" aria-label={`Ver ${course.title}`}>
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
        <div className="relative flex min-h-0 flex-col p-6 pb-20 md:p-7 md:pb-20">
          <div className="flex items-baseline justify-between gap-4 text-xs uppercase tracking-wide text-ink-soft/60">
            <span>{course.modality || course.duration}</span>
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brass">{course.category}</p>
          <h3 className="mt-4 font-display text-3xl uppercase transition-colors group-hover:text-brass">
            <Link href={`/cursos/${course.slug}`}>{course.title}</Link>
          </h3>
          <p className="mt-3 text-ink-soft/75 text-sm leading-relaxed">{course.summary}</p>
          {course.includes ? <p className="relative top-[5px] mt-4 text-xs leading-relaxed text-ink-soft/60"><strong>Incluye:</strong> {course.includes}</p> : null}
          <p className="mt-auto pt-5 text-xs font-semibold uppercase tracking-wide text-teal">{formatPrice(course)}</p>
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
