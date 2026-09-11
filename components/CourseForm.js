"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const empty = {
  title: "",
  summary: "",
  description: "",
  duration: "",
  start_date: "",
  spots: "",
  image_url: "",
  is_paid: false,
  price: "",
  currency: "ARS",
  is_active: true,
};

export default function CourseForm({ courseId, initialCourse }) {
  const router = useRouter();
  const initial = initialCourse
    ? {
        ...initialCourse,
        price: initialCourse.price_cents ? initialCourse.price_cents / 100 : "",
      }
    : {};
  const [form, setForm] = useState({ ...empty, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(courseId);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      price_cents: form.is_paid ? Math.round(Number(form.price || 0) * 100) : null,
      spots: form.spots ? Number(form.spots) : null,
    };
    delete payload.price;

    const res = await fetch(
      isEdit ? `/api/admin/courses/${courseId}` : "/api/admin/courses",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "No se pudo guardar el curso.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-panel border border-line p-6 space-y-5 max-w-2xl">
      <div>
        <label className="block text-sm mb-1">Título</label>
        <input
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Resumen corto (para la tarjeta del listado)</label>
        <input
          required
          value={form.summary}
          onChange={(e) => update("summary", e.target.value)}
          className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Descripción completa</label>
        <textarea
          required
          rows={6}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Duración (texto libre)</label>
          <input
            required
            placeholder="Ej: 6 semanas, 4 hs/semana"
            value={form.duration}
            onChange={(e) => update("duration", e.target.value)}
            className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Cupos (opcional)</label>
          <input
            type="number"
            min="0"
            value={form.spots || ""}
            onChange={(e) => update("spots", e.target.value)}
            className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Fecha de inicio (opcional)</label>
        <input
          type="date"
          value={form.start_date || ""}
          onChange={(e) => update("start_date", e.target.value)}
          className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">URL de la imagen / banner (opcional)</label>
        <input
          value={form.image_url || ""}
          onChange={(e) => update("image_url", e.target.value)}
          placeholder="https://..."
          className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal"
        />
        <p className="text-xs text-ink-soft/50 mt-1">
          Por ahora se pega una URL. Se puede sumar subida de archivos más adelante
          (Vercel Blob / Supabase Storage) sin cambiar el resto del formulario.
        </p>
      </div>

      <div className="border-t border-line pt-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(form.is_paid)}
            onChange={(e) => update("is_paid", e.target.checked)}
          />
          Este curso es pago
        </label>

        {form.is_paid ? (
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Precio</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price || ""}
                onChange={(e) => update("price", e.target.value)}
                className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Moneda</label>
              <input
                value={form.currency || "ARS"}
                onChange={(e) => update("currency", e.target.value)}
                className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal"
              />
            </div>
          </div>
        ) : (
          <p className="text-xs text-ink-soft/50 mt-2">
            Todavía no hay pasarela de pago conectada: mientras esto quede sin marcar, la
            inscripción se confirma directo, sin pedir pago.
          </p>
        )}
      </div>

      <div className="border-t border-line pt-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(form.is_active)}
            onChange={(e) => update("is_active", e.target.checked)}
          />
          Visible en el sitio público
        </label>
      </div>

      {error ? <p className="text-red-700 text-sm">{error}</p> : null}

      <button
        type="submit"
        disabled={saving}
        className="bg-brass text-ink font-medium px-6 py-3 hover:bg-brass-dark transition-colors disabled:opacity-60"
      >
        {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear curso"}
      </button>
    </form>
  );
}
