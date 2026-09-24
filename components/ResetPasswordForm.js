"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordForm({ token }) {
  const router = useRouter();
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, token }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "No se pudo restablecer la contraseña.");
      return;
    }
    router.push("/admin/login?reset=success");
  }

  return (
    <form onSubmit={handleSubmit} className="bg-panel border border-line p-8 w-full max-w-sm">
      <h1 className="mb-1 font-display text-2xl">Nueva contraseña</h1>
      <p className="mb-6 text-sm text-ink-soft/70">Elegí una contraseña de al menos 8 caracteres.</p>
      <input type="password" required minLength={8} value={form.newPassword} onChange={(event) => setForm({ ...form, newPassword: event.target.value })} placeholder="Nueva contraseña" className="mb-3 w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal" />
      <input type="password" required minLength={8} value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} placeholder="Confirmar contraseña" className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal" />
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      <button className="mt-4 w-full bg-brass px-6 py-3 font-medium text-ink hover:bg-brass-dark">Guardar contraseña</button>
    </form>
  );
}
