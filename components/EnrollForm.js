"use client";

import { useState } from "react";

export default function EnrollForm({ course }) {
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = new FormData(e.currentTarget);
    const payload = {
      courseId: course.id,
      fullName: form.get("fullName"),
      email: form.get("email"),
      phone: form.get("phone"),
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
      setErrorMsg("Hubo un problema de conexión. Probá de nuevo.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="bg-teal text-paper p-6">
        <p className="font-display text-xl">¡Listo, quedaste inscripto!</p>
        <p className="mt-2 text-paper/80">
          {course.is_paid
            ? "Te vamos a contactar para coordinar el pago y confirmar tu lugar."
            : "Te vamos a escribir por email con los próximos pasos."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-panel border border-line p-6 space-y-4">
      <div>
        <label className="block text-sm mb-1" htmlFor="fullName">
          Nombre y apellido
        </label>
        <input
          id="fullName"
          name="fullName"
          required
          className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal"
        />
      </div>
      <div>
        <label className="block text-sm mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal"
        />
      </div>
      <div>
        <label className="block text-sm mb-1" htmlFor="phone">
          Teléfono
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal"
        />
      </div>

      {errorMsg ? <p className="text-red-700 text-sm">{errorMsg}</p> : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-brass text-ink font-medium px-6 py-3 hover:bg-brass-dark transition-colors disabled:opacity-60"
      >
        {status === "sending"
          ? "Enviando..."
          : course.is_paid
          ? "Inscribirme y coordinar el pago"
          : "Inscribirme"}
      </button>
    </form>
  );
}
