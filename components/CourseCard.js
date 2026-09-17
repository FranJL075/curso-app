import Link from "next/link";

function formatPrice(course) {
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
      className="group block bg-panel border border-line hover:border-brass hover:-translate-y-1 transition-all"
    >
      <div className="p-6 md:p-7">
        <div className="flex items-baseline justify-between gap-4 text-xs uppercase tracking-wide text-ink-soft/60">
          <span>{course.duration}</span>
          <span>{formatPrice(course)}</span>
        </div>
        <h3 className="font-display text-3xl uppercase mt-4 group-hover:text-brass transition-colors">
          {course.title}
        </h3>
        <p className="mt-3 text-ink-soft/75 text-sm leading-relaxed">{course.summary}</p>
        {course.spots ? (
          <p className="mt-5 text-xs uppercase tracking-wide text-teal font-semibold">{course.spots} cupos disponibles</p>
        ) : null}
      </div>
    </Link>
  );
}
