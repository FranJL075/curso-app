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
      className="group block bg-panel border-l-4 border-teal hover:border-brass transition-colors"
    >
      <div className="p-6">
        <div className="flex items-baseline justify-between gap-4 text-sm text-ink-soft/70">
          <span>{course.duration}</span>
          <span>{formatPrice(course)}</span>
        </div>
        <h3 className="font-display text-2xl mt-3 group-hover:text-teal transition-colors">
          {course.title}
        </h3>
        <p className="mt-3 text-ink-soft/80 leading-relaxed">{course.summary}</p>
        {course.spots ? (
          <p className="mt-4 text-sm text-brass-dark">{course.spots} cupos disponibles</p>
        ) : null}
      </div>
    </Link>
  );
}
