import Link from "next/link";
import CourseForm from "@/components/CourseForm";

export default function NewCoursePage() {
  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin"
          className="inline-flex items-center text-sm font-medium text-ink-soft/70 transition-colors hover:text-ink"
        >
          ← Volver al panel
        </Link>
      </div>
      <h1 className="font-display text-3xl mb-8">Nuevo curso</h1>
      <CourseForm />
    </div>
  );
}
