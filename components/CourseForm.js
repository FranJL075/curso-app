"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { COURSE_TEXT_LIMITS } from "@/lib/courseLimits";

const empty = {
  category: "",
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

export default function CourseForm({ courseId, initialCourse, categories = [] }) {
  const router = useRouter();
  const [availableCategories, setAvailableCategories] = useState(() => {
    if (initialCourse?.category && !categories.some((category) => category.name === initialCourse.category)) {
      return [...categories, { id: "current", name: initialCourse.category }];
    }
    return categories;
  });
  const initial = initialCourse
    ? {
        ...initialCourse,
        price: initialCourse.price_cents ? initialCourse.price_cents / 100 : "",
      }
    : {};
  const [form, setForm] = useState({ ...empty, ...initial });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const isEdit = Boolean(courseId);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleCreateCategory() {
    const name = newCategory.trim();
    if (!name) return;

    setCreatingCategory(true);
    setCategoryError("");
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setCategoryError(data.error || "No se pudo crear la categoría.");
        return;
      }

      setAvailableCategories((current) => (
        current.some((category) => category.id === data.category.id)
          ? current
          : [...current, data.category].sort((a, b) => a.name.localeCompare(b.name))
      ));
      update("category", data.category.name);
      setNewCategory("");
    } catch {
      setCategoryError("Hubo un problema de conexión. Intenta nuevamente.");
    } finally {
      setCreatingCategory(false);
    }
  }

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setUploadError("Solo podés subir JPG, PNG o WEBP.");
      event.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      setUploadError("La imagen debe pesar menos de 10 MB.");
      event.target.value = "";
      return;
    }

    setUploadingImage(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "No se pudo subir la imagen.");
      }

      update("image_url", data.url || "");
    } catch (uploadErr) {
      setUploadError(uploadErr.message || "No se pudo subir la imagen.");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
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
    <form onSubmit={handleSubmit} className="w-full bg-panel border border-line p-6 space-y-5 max-w-none">
      <div>
        <label className="block text-sm mb-1">Título</label>
        <input
          required
          maxLength={COURSE_TEXT_LIMITS.title}
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Categoría</label>
        <select
          required
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal"
        >
          <option value="" disabled>Selecciona una categoría</option>
          {availableCategories.map((category) => (
            <option key={category.id} value={category.name}>{category.name}</option>
          ))}
        </select>
        <div className="mt-2 flex gap-2">
          <input
            maxLength={COURSE_TEXT_LIMITS.category}
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nueva categoría"
            className="min-w-0 flex-1 border border-line bg-white px-3 py-2 text-sm outline-none focus:border-teal"
          />
          <button
            type="button"
            disabled={creatingCategory || !newCategory.trim()}
            onClick={handleCreateCategory}
            className="bg-teal px-3 py-2 text-xs font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-ink disabled:opacity-50"
          >
            {creatingCategory ? "Creando..." : "Crear categoría"}
          </button>
        </div>
        {categoryError ? <p className="mt-1 text-xs text-red-700">{categoryError}</p> : null}
      </div>

      <div>
        <label className="block text-sm mb-1">Resumen corto (para la tarjeta del listado)</label>
        <input
          required
          maxLength={COURSE_TEXT_LIMITS.summary}
          value={form.summary}
          onChange={(e) => update("summary", e.target.value)}
          className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Descripción completa</label>
        <textarea
          required
          maxLength={COURSE_TEXT_LIMITS.description}
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
            maxLength={COURSE_TEXT_LIMITS.duration}
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
        <label className="block text-sm mb-1">Modalidad</label>
        <input
          required
          maxLength={COURSE_TEXT_LIMITS.modality}
          value={form.modality || ""}
          onChange={(e) => update("modality", e.target.value)}
          placeholder="Ej: Presencial · 3 días"
          className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Qué incluye</label>
        <textarea
          maxLength={COURSE_TEXT_LIMITS.includes}
          rows={3}
          value={form.includes || ""}
          onChange={(e) => update("includes", e.target.value)}
          className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Requisitos</label>
        <textarea
          maxLength={COURSE_TEXT_LIMITS.requirements}
          rows={3}
          value={form.requirements || ""}
          onChange={(e) => update("requirements", e.target.value)}
          className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Información de pago</label>
        <input
          maxLength={COURSE_TEXT_LIMITS.payment}
          value={form.payment || ""}
          onChange={(e) => update("payment", e.target.value)}
          className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal"
        />
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
        <label className="block text-sm mb-1">Imagen del curso</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageUpload}
          disabled={uploadingImage}
          className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal"
        />
        <p className="mt-1 text-xs text-ink-soft/50">Máx. 10 MB · JPG, PNG o WEBP</p>
        {uploadingImage ? <p className="mt-2 text-xs text-teal">Subiendo imagen...</p> : null}
        {uploadError ? <p className="mt-2 text-xs text-red-700">{uploadError}</p> : null}

        <label className="mt-4 block text-sm mb-1">O pegá una URL pública</label>
        <input
          maxLength={COURSE_TEXT_LIMITS.image_url}
          value={form.image_url || ""}
          onChange={(e) => update("image_url", e.target.value)}
          placeholder="https://..."
          className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal"
        />
        {form.image_url ? (
          <div className="relative mt-3 h-40 w-full">
            <Image src={form.image_url} alt="Vista previa del curso" fill unoptimized className="object-cover" />
          </div>
        ) : null}
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
                maxLength={COURSE_TEXT_LIMITS.currency}
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
