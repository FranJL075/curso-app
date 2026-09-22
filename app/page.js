import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import CourseCatalog from "@/components/CourseCatalog";
import { getActiveCourses } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const courses = getActiveCourses();

  return (
    <main className="flex-1">
      <header className="font-brand bg-[#393d36] text-paper">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-6">
          <Link href="/" className="relative block h-[52px] w-[208px] overflow-hidden" aria-label="WeMaster">
            <Image
              src="/Logo_We_Master_Stand%204.jpg"
              alt="WeMaster"
              fill
              sizes="160px"
              className="object-cover object-center"
            />
          </Link>
          <nav className="hidden items-center gap-7 text-lg font-semibold uppercase tracking-wide md:flex">
            <a href="#beneficios" className="transition-colors hover:text-brass">Beneficios</a>
            <a href="#catalogo" className="transition-colors hover:text-brass">Prácticas</a>
            <a href="#garantia" className="transition-colors hover:text-brass">Garantía</a>
          </nav>
        </div>
      </header>
      <Hero />

      <section id="catalogo" className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="mb-10 flex items-end justify-between gap-5">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brass">Elige tu próxima práctica</p>
            <h2 className="font-display text-5xl uppercase">Catálogo presencial</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft/60">Precios en USD. Grupos profesionales, modelos reales y acompañamiento durante toda la clase.</p>
          </div>
        </div>

        <CourseCatalog courses={courses} />
        <p className="mt-10 max-w-3xl border-l-2 border-brass pl-5 text-sm leading-relaxed text-ink-soft/70">
          La formación y los certificados no sustituyen una licencia profesional ni amplían su alcance. La realización de procedimientos depende de las credenciales, la supervisión y la normativa aplicable.
        </p>
      </section>

      <Benefits />

      <section id="garantia" className="bg-brass text-white">
        <div className="mx-auto max-w-6xl px-6 py-14 md:flex md:items-start md:justify-between md:gap-10">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white">Garantía WeMaster</p>
            <h2 className="font-display text-4xl uppercase text-white">Fórmate con respaldo profesional</h2>
          </div>
          <p className="mt-5 max-w-xl leading-relaxed text-white md:mt-7">Recibe certificado oficial, material de apoyo y asesoría de nuestros profesionales. Practica con acompañamiento y lleva herramientas para trabajar con más seguridad.</p>
        </div>
      </section>

      <footer className="font-brand bg-[#393d36] text-paper">
        <div className="mx-auto flex min-h-48 w-full max-w-6xl flex-col justify-center px-6 py-14 text-sm">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <nav className="flex flex-col gap-3 text-lg font-semibold uppercase tracking-wide">
              <a href="#beneficios" className="transition-colors hover:text-brass">Beneficios</a>
              <a href="#catalogo" className="transition-colors hover:text-brass">Prácticas</a>
              <a href="#garantia" className="transition-colors hover:text-brass">Garantía</a>
            </nav>
            <span className="relative block h-24 w-64 overflow-hidden" aria-label="WeMaster">
              <Image
                src="/Logo_We_Master_Stand-2.jpg"
                alt="WeMaster"
                fill
                sizes="256px"
                className="object-cover object-center"
              />
            </span>
          </div>
          <p className="mt-8 border-t border-paper/20 pt-5 text-xs tracking-normal text-paper/60">© 2026 WeMaster. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
