"use client";

import { useState } from "react";

function formatPrice(course) {
  if (!course.is_paid) return "Sin costo";
  return ((course.price_cents || 0) / 100).toLocaleString("en-US", {
    style: "currency",
    currency: course.currency || "USD",
    maximumFractionDigits: 0,
  });
}

export default function EnrollForm({ course = null, courses = [] }) {
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [errorMsg, setErrorMsg] = useState("");
  const availableCourses = course ? [course] : courses;

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = new FormData(e.currentTarget);
    const payload = {
      courseId: form.get("courseId"),
      fullName: form.get("fullName"),
      email: form.get("email"),
      phone: form.get("phone"),
      message: form.get("message"),
      wantsReminders: form.get("wantsReminders") === "on",
    };

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "No pudimos registrar tu inscripción.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setErrorMsg("Hubo un problema de conexión. Intenta nuevamente.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="bg-teal text-paper p-6">
        <p className="font-display text-2xl uppercase">¡Listo, completaste tu inscripción!</p>
        <p className="mt-2 text-paper/80">
          {course?.is_paid
            ? "Te vamos a contactar para coordinar el pago y confirmar tu lugar."
            : "Te escribiremos por email con los próximos pasos. También puedes llamarnos al 1-305-866-8163."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {course ? <input type="hidden" name="courseId" value={course.id} /> : (
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide" htmlFor="courseId">Práctica de interés</label>
          <select id="courseId" name="courseId" required defaultValue="" className="w-full border border-line bg-white px-3 py-3 outline-none focus:border-teal">
            <option value="" disabled>Selecciona una práctica</option>
            {availableCourses.map((availableCourse) => (
              <option key={availableCourse.id} value={availableCourse.id}>{availableCourse.title} · {formatPrice(availableCourse)}</option>
            ))}
          </select>
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide" htmlFor="fullName">
          Nombre y apellido
          </label>
        <input
          id="fullName"
          name="fullName"
          required
          autoComplete="name"
          maxLength={100}
          className="w-full border border-line bg-white px-3 py-3 outline-none focus:border-teal"
        />
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide" htmlFor="email">
          Email
          </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full border border-line bg-white px-3 py-3 outline-none focus:border-teal"
        />
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide" htmlFor="phone">
          Teléfono
          </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          maxLength={30}
          className="w-full border border-line bg-white px-3 py-3 outline-none focus:border-teal"
        />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide" htmlFor="message">Consulta</label>
          <textarea id="message" name="message" rows="4" maxLength={1000} className="w-full resize-y border border-line bg-white px-3 py-3 outline-none focus:border-teal" placeholder="¿Qué te gustaría aprender?" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="wantsReminders" />
        Quiero recibir recordatorios por email
      </label>

      {errorMsg ? <p className="text-red-700 text-sm">{errorMsg}</p> : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-teal px-6 py-4 font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-ink disabled:opacity-60"
      >
        {status === "sending"
          ? "Enviando..."
          : course?.is_paid
          ? "Inscribirme y coordinar el pago"
          : "Quiero reservar mi lugar"}
      </button>
    </form>
  );
}
