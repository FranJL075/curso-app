"use client";

import { useState } from "react";

export default function PasswordChangeForm() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    const response = await fetch("/api/admin/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "No se pudo cambiar la contraseña.");
      return;
    }
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setMessage("Contraseña actualizada.");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5 border border-line bg-panel p-6">
      {[['currentPassword', 'Contraseña actual'], ['newPassword', 'Nueva contraseña'], ['confirmPassword', 'Confirmar nueva contraseña']].map(([field, label]) => (
        <div key={field}>
          <label className="mb-1 block text-sm" htmlFor={field}>{label}</label>
          <input id={field} type="password" required minLength={field === "currentPassword" ? undefined : 8} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal" />
        </div>
      ))}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {message ? <p className="text-sm text-teal">{message}</p> : null}
      <button className="bg-brass px-6 py-3 font-medium text-ink hover:bg-brass-dark">Cambiar contraseña</button>
    </form>
  );
}
