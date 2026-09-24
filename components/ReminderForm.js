"use client";

import { useState } from "react";

export default function ReminderForm({ courseId, courseTitle, recipientCount, testMode }) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(`Recordatorio - ${courseTitle}`);
  const [message, setMessage] = useState(
    "Hola {{nombre}},\n\nTe recordamos la información de tu curso {{curso}}."
  );
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  function close() {
    if (!sending) setOpen(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!window.confirm(`¿Enviar este recordatorio a ${recipientCount} inscriptos?`)) return;

    setSending(true);
    setFeedback(null);
    let response;
    let data;
    try {
      response = await fetch(`/api/admin/courses/${courseId}/reminder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      data = await response.json().catch(() => ({}));
    } catch {
      setSending(false);
      setFeedback({ type: "error", text: "No se pudo conectar con el servidor." });
      return;
    }
    setSending(false);

    if (!response.ok) {
      setFeedback({ type: "error", text: data.error || "No se pudo enviar el recordatorio." });
      return;
    }
    setFeedback({ type: data.failed ? "warning" : "success", text: data.message });
  }

  return (
    <div className="mb-0">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-auto min-w-[140px] border border-teal px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-teal transition-colors hover:bg-teal hover:text-paper"
      >
        Recordatorio ({recipientCount})
      </button>

      {feedback ? (
        <p className={`mt-3 text-sm ${feedback.type === "success" ? "text-green-700" : "text-red-700"}`}>
          {feedback.text}
        </p>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-ink/50 p-4" role="dialog" aria-modal="true" aria-labelledby="reminder-title">
          <form onSubmit={handleSubmit} className="w-full max-w-xl border border-line bg-panel p-6 shadow-xl">
            <h2 id="reminder-title" className="font-display text-2xl">Enviar recordatorio</h2>
            <p className="mt-1 text-sm text-ink-soft/70">{courseTitle} · {recipientCount} destinatarios</p>
            {testMode ? <p className="mt-3 border border-brass bg-brass/10 px-3 py-2 text-xs text-brass-dark">Modo de prueba activo: los emails se enviarán únicamente al destinatario de prueba.</p> : null}
            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="reminder-subject" className="mb-1 block text-sm">Asunto</label>
                <input id="reminder-subject" required maxLength={180} value={subject} onChange={(event) => setSubject(event.target.value)} className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal" />
              </div>
              <div>
                <label htmlFor="reminder-message" className="mb-1 block text-sm">Mensaje</label>
                <textarea id="reminder-message" required maxLength={10000} rows={8} value={message} onChange={(event) => setMessage(event.target.value)} className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal" />
                <p className="mt-1 text-xs text-ink-soft/60">{"Podés usar {{nombre}} y {{curso}}."}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={close} disabled={sending} className="border border-line px-4 py-2 text-sm hover:bg-paper disabled:opacity-60">Cancelar</button>
              <button type="submit" disabled={sending || recipientCount === 0} className="bg-brass px-4 py-2 text-sm font-semibold text-ink hover:bg-brass-dark disabled:opacity-60">
                {sending ? "Enviando..." : `Enviar a ${recipientCount} inscriptos`}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}