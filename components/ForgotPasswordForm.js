"use client";

import { useState } from "react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await fetch("/api/admin/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    const data = await response.json();
    setMessage(data.message);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-panel border border-line p-8 w-full max-w-sm">
      <h1 className="mb-1 font-display text-2xl">Recuperar contraseña</h1>
      <p className="mb-6 text-sm text-ink-soft/70">Ingresá tu email y revisá tu bandeja de entrada.</p>
      <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal" />
      <button className="mt-4 w-full bg-brass px-6 py-3 font-medium text-ink hover:bg-brass-dark">Enviar enlace</button>
      {message ? <p className="mt-4 text-sm text-ink-soft/70">{message}</p> : null}
      <a href="/admin/login" className="mt-4 block text-center text-sm text-ink-soft/70 underline">Volver al login</a>
    </form>
  );
}
