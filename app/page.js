import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import CourseCatalog from "@/components/CourseCatalog";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getActiveCourses } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const courses = getActiveCourses();

  return (
    <main className="flex-1">
      <SiteHeader />
      <Hero />

      <section id="catalogo" className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="mb-10 flex items-end justify-between gap-5">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brass">Encuentra tu próxima capacitación</p>
            <h2 className="font-display text-5xl uppercase">Explora nuestras clases</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft/60">Explora nuestras clases presenciales de estética, depilación y formación estético-médica. Elige la capacitación que te interesa y reserva tu lugar.</p>
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

      <SiteFooter />
    </main>
  );
}
