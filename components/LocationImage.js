"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const imageSrc = "/WhatsApp%20Image%202026-10-09%20at%202.03.06%20PM.jpeg";
const imageAlt = "Ubicación de WeMaster en 8260 NW 27 St, suite 409, Doral, Florida";

export default function LocationImage() {
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    function handleKeyDown(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function openImage() {
    setZoom(1);
    setIsOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={openImage}
        aria-label="Ampliar imagen de la ubicación de WeMaster"
        className="block w-full cursor-zoom-in text-left"
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={1536}
          height={1024}
          sizes="(min-width: 1280px) 1152px, 100vw"
          className="h-auto w-full border border-line"
        />
      </button>
      <p className="mt-2 text-right text-xs text-ink-soft/60">Toca la imagen para ampliarla.</p>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 bg-black/90 p-3 sm:p-6"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Imagen ampliada de la ubicación de WeMaster"
            className="mx-auto flex h-full w-full max-w-6xl flex-col"
          >
            <div className="flex shrink-0 justify-end gap-2 pb-3">
              <button
                type="button"
                onClick={() => setZoom((current) => Math.max(1, current - 0.5))}
                disabled={zoom <= 1}
                aria-label="Alejar imagen"
                className="h-10 w-10 border border-white/50 text-2xl text-white hover:bg-white/15 disabled:opacity-40"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => setZoom((current) => Math.min(4, current + 0.5))}
                disabled={zoom >= 4}
                aria-label="Acercar imagen"
                className="h-10 w-10 border border-white/50 text-2xl text-white hover:bg-white/15 disabled:opacity-40"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar imagen ampliada"
                className="ml-2 h-10 w-10 border border-white/50 text-2xl text-white hover:bg-white/15"
              >
                ×
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto">
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={1536}
                height={1024}
                sizes="100vw"
                className="h-auto max-w-none"
                style={{ width: `${zoom * 100}%` }}
              />
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
