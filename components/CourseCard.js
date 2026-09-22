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
    <Link
      href={`/cursos/${course.slug}`}
      className="group block min-h-[380px] overflow-hidden border border-line bg-panel transition-all hover:-translate-y-1 hover:border-brass"
    >
      <div className="grid h-full md:grid-cols-[minmax(150px,34%)_1fr]">
        <div className="relative min-h-40 h-full bg-teal">
          {course.image_url ? (
            <Image
              src={course.image_url}
              alt={course.title}
              fill
              sizes="(min-width: 768px) 18vw, 100vw"
              className="object-cover"
            />
          ) : null}
        </div>
        <div className="flex min-h-0 flex-col p-6 md:p-7">
          <div className="flex items-baseline justify-between gap-4 text-xs uppercase tracking-wide text-ink-soft/60">
            <span>{course.modality || course.duration}</span>
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brass">{course.category}</p>
          <h3 className="font-display text-3xl uppercase mt-4 group-hover:text-brass transition-colors">
            {course.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-ink-soft/75 text-sm leading-relaxed">{course.summary}</p>
          {course.includes ? <p className="mt-4 line-clamp-2 text-xs leading-relaxed text-ink-soft/60"><strong>Incluye:</strong> {course.includes}</p> : null}
          <p className="mt-auto pt-5 text-xs font-semibold uppercase tracking-wide text-teal">{formatPrice(course)}</p>
        </div>
      </div>
    </Link>
  );
}
