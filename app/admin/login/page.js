"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Email o contraseña incorrectos.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex-1 flex items-center justify-center bg-ink">
      <form
        onSubmit={handleSubmit}
        className="bg-panel border border-line p-8 w-full max-w-sm"
      >
        <h1 className="font-display text-2xl mb-1">Panel de administración</h1>
        <p className="text-ink-soft/70 text-sm mb-6">Ingresá con tu cuenta de administrador.</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="email"
          required
          className="mb-3 w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          autoComplete="current-password"
          required
          className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal"
        />
        {error ? <p className="text-red-700 text-sm mt-2">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-brass text-ink font-medium px-6 py-3 hover:bg-brass-dark transition-colors disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
        <a href="/admin/forgot-password" className="mt-4 block text-center text-sm text-ink-soft/70 underline hover:text-ink">
          ¿Olvidaste tu contraseña?
        </a>
      </form>
    </main>
  );
}
