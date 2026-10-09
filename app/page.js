import Image from "next/image";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import CourseCatalog from "@/components/CourseCatalog";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getActiveCourses, getAllCategories } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [courses, categories, bannerUrl] = await Promise.all([
    getActiveCourses(),
    getAllCategories(),
    import("@/lib/db").then(({ getSiteSetting }) => getSiteSetting("courses_banner_url")),
  ]);

  return (
    <main className="flex-1">
      <SiteHeader />
      <Hero bannerUrl={bannerUrl} />

      <section id="catalogo" className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="mb-10 flex items-end justify-between gap-5">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brass">Encuentra tu próxima capacitación</p>
            <h2 className="font-display text-5xl uppercase">Explora nuestras clases</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft/60">Explora nuestras clases presenciales de estética, depilación y formación estético-médica. Elige la capacitación que te interesa y reserva tu lugar.</p>
          </div>
        </div>

        <CourseCatalog courses={courses} categories={categories} />
        <p className="mt-10 max-w-3xl border-l-2 border-brass pl-5 text-sm leading-relaxed text-ink-soft/70">
          La formación y los certificados no sustituyen una licencia profesional ni amplían su alcance. La realización de procedimientos depende de las credenciales, la supervisión y la normativa aplicable.
        </p>
      </section>

      <Benefits />

      <section id="ubicacion" className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brass">Visítanos en Doral</p>
            <h2 className="font-display text-5xl uppercase">Nuestra ubicación</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft/70">
              Te esperamos para tus prácticas presenciales en nuestra sede de Doral, Florida.
            </p>
          </div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=8260+NW+27+St+%23409%2C+Doral%2C+FL+33122"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit shrink-0 bg-teal px-5 py-3 text-xs font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-ink"
          >
            Cómo llegar
          </a>
        </div>
        <Image
          src="/WhatsApp%20Image%202026-10-09%20at%202.03.06%20PM.jpeg"
          alt="Ubicación de WeMaster en 8260 NW 27 St, suite 409, Doral, Florida"
          width={1536}
          height={1024}
          sizes="(min-width: 1280px) 1152px, 100vw"
          className="h-auto w-full border border-line"
        />
      </section>

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
