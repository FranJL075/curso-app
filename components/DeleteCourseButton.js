"use client";

import { useRouter } from "next/navigation";

export default function DeleteCourseButton({ courseId }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("¿Borrar este curso? Esta acción no se puede deshacer.")) return;
    const res = await fetch(`/api/admin/courses/${courseId}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-sm text-red-700 hover:text-red-900 underline"
    >
      Borrar curso
    </button>
  );
}
