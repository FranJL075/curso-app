"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="relative z-20 font-brand bg-[#393d36] text-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="relative block h-[52px] w-[208px] overflow-hidden" aria-label="WeMaster">
          <Image
            src="/Logo_We_Master_Stand%204.jpg"
            alt="WeMaster"
            fill
            sizes="208px"
            className="object-cover object-center"
          />
        </Link>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="relative z-10 flex h-11 w-11 flex-col items-center justify-center gap-1.5 border border-paper/40 text-paper md:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          >
            <span className="block h-0.5 w-6 bg-current" />
            <span className="block h-0.5 w-6 bg-current" />
            <span className="block h-0.5 w-6 bg-current" />
          </button>
          <nav
            id="mobile-navigation"
            aria-label="Navegación móvil"
            className={`absolute right-0 top-full flex w-64 flex-col gap-5 bg-[#393d36] px-6 py-6 text-right text-lg font-semibold uppercase tracking-wide shadow-lg transition-transform duration-300 md:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <Link href="/#catalogo" onClick={closeMenu} className="transition-colors hover:text-brass hover:underline underline-offset-4">Prácticas</Link>
            <Link href="/#beneficios" onClick={closeMenu} className="transition-colors hover:text-brass hover:underline underline-offset-4">Beneficios</Link>
            <Link href="/#garantia" onClick={closeMenu} className="transition-colors hover:text-brass hover:underline underline-offset-4">Garantía</Link>
          </nav>
        </div>
        <nav className="hidden items-center gap-7 text-lg font-semibold uppercase tracking-wide md:flex">
          <Link href="/#catalogo" className="transition-colors hover:text-brass hover:underline underline-offset-4">Prácticas</Link>
          <Link href="/#beneficios" className="transition-colors hover:text-brass hover:underline underline-offset-4">Beneficios</Link>
          <Link href="/#garantia" className="transition-colors hover:text-brass hover:underline underline-offset-4">Garantía</Link>
        </nav>
      </div>
    </header>
  );
}
