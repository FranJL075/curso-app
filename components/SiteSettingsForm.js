"use client";

import { useState } from "react";
import Image from "next/image";

export default function SiteSettingsForm({ initialBannerUrl = "" }) {
  const [value, setValue] = useState(initialBannerUrl);
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "courses_banner_url", value }) });
    setMessage(response.ok ? "Configuración guardada." : "No se pudo guardar la configuración.");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 border border-line bg-panel p-6">
      <div>
        <label className="mb-1 block text-sm" htmlFor="bannerUrl">URL de imagen del banner</label>
        <input id="bannerUrl" type="url" value={value} onChange={(event) => setValue(event.target.value)} placeholder="https://..." className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal" />
      </div>
      {value ? <div className="relative h-40 w-full"><Image src={value} alt="Vista previa del banner" fill unoptimized className="object-cover" /></div> : null}
      {message ? <p className="text-sm text-ink-soft/70">{message}</p> : null}
      <button className="bg-brass px-6 py-3 font-medium text-ink hover:bg-brass-dark">Guardar cambios</button>
    </form>
  );
}
