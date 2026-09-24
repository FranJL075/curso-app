"use client";

import { useState } from "react";

export default function SendReminderButton({ courseId, courseTitle, recipientCount }) {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  function openModal() {
    setFeedback(null);
    setIsOpen(true);
  }

  function closeModal() {
    if (!sending) setIsOpen(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (sending || !subject.trim() || !message.trim()) return;
    if (!window.confirm(`¿Enviar este recordatorio a ${recipientCount} inscriptos?`)) return;

    setSending(true);
    setFeedback(null);
    try {
      const response = await fetch(`/api/admin/courses/${courseId}/reminder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setFeedback({ type: "error", text: data.error || "No se pudo enviar el recordatorio." });
        return;
      }
      if (data.failed > 0) {
        setFeedback({
          type: "error",
          text: `Se enviaron ${data.sent} de ${data.total} emails. ${data.failed} envíos fallaron.`,
        });
      } else {
        setFeedback({
          type: "success",
          text: `Recordatorio enviado correctamente a ${data.sent} inscriptos.`,
        });
      }
    } catch {
      setFeedback({ type: "error", text: "No se pudo conectar con el servicio de email." });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        disabled={recipientCount === 0}
        className="shrink-0 bg-teal px-3 py-2 text-xs font-semibold uppercase tracking-wide text-paper hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
      >
        Enviar recordatorio
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="reminder-title"
            className="max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto border border-line bg-panel p-6 shadow-xl"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 id="reminder-title" className="font-display text-2xl">
                  Enviar recordatorio
                </h2>
                <p className="mt-1 text-sm text-ink-soft/70">{courseTitle}</p>
                <p className="mt-2 text-sm font-medium">
                  {recipientCount} {recipientCount === 1 ? "inscripto" : "inscriptos"} recibirán el email.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={sending}
                aria-label="Cerrar"
                className="text-2xl leading-none text-ink-soft/60 hover:text-ink disabled:opacity-40"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="reminder-subject" className="mb-1 block text-sm">
                  Asunto
                </label>
                <input
                  id="reminder-subject"
                  required
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-teal"
                />
              </div>

              <div>
                <label htmlFor="reminder-message" className="mb-1 block text-sm">
                  Mensaje
                </label>
                <textarea
                  id="reminder-message"
                  required
                  rows={8}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="w-full resize-y border border-line bg-white px-3 py-2 outline-none focus:border-teal"
                />
              </div>

              {feedback ? (
                <p className={`text-sm ${feedback.type === "success" ? "text-teal" : "text-red-700"}`}>
                  {feedback.text}
                </p>
              ) : null}

              <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={sending}
                  className="border border-line px-4 py-2 text-sm hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={sending || !subject.trim() || !message.trim()}
                  className="bg-brass px-4 py-2 text-sm font-semibold text-ink hover:bg-brass-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sending ? "Enviando..." : `Enviar a ${recipientCount} inscriptos`}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}
