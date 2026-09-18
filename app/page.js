import Hero from "@/components/Hero";
import CourseCard from "@/components/CourseCard";
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
          <Link href="/" className="relative block h-10 w-40 overflow-hidden" aria-label="WeMaster">
            <Image
              src="/Logo_We_Master_Stand%204.jpg"
              alt="WeMaster"
              fill
              sizes="160px"
              className="object-cover object-center"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wide">
            <a href="#cursos" className="hover:text-brass transition-colors">Clases</a>
            <a href="#membresia" className="hover:text-brass transition-colors">Membresía</a>
            <a href="#garantia" className="hover:text-brass transition-colors">Garantía</a>
            <a href="/admin" className="border border-paper/40 px-3 py-2 hover:border-brass hover:text-brass transition-colors">Ingresar</a>
          </nav>
        </div>
      </header>
      <Hero />

      <section id="membresia" className="bg-brass text-ink">
        <div className="mx-auto max-w-6xl px-6 py-10 md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-semibold">Membresía anual WeMaster</p>
            <h2 className="font-display text-4xl uppercase mt-2">Acceso por un año a más de 50 cursos online</h2>
            <p className="mt-3 text-sm font-semibold uppercase tracking-wide">USD 450 • Un solo pago</p>
          </div>
          <a href="#cursos" className="inline-block shrink-0 mt-6 md:mt-0 bg-ink text-paper px-6 py-3 text-sm font-semibold uppercase hover:bg-teal transition-colors">Conocer la membresía</a>
        </div>
      </section>

      <section id="cursos" className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="mb-10 flex items-end justify-between gap-5">
          <div>
            <p className="text-brass text-xs uppercase tracking-[0.2em] font-semibold mb-3">Certificado oficial y asesoría profesional</p>
            <h2 className="font-display text-5xl uppercase">Cursos online</h2>
          </div>
          <p className="hidden md:block max-w-xs text-right text-sm text-ink-soft/60">Elegí una técnica, aprendé a tu ritmo y sumá nuevas herramientas a tu práctica estética.</p>
        </div>

        {courses.length === 0 ? (
            <p className="text-ink-soft/60 border border-line p-8 text-center">
            Todavía no hay cursos cargados. Entrá al panel de administración para crear el primero.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      <section id="garantia" className="bg-teal text-paper">
        <div className="mx-auto max-w-6xl px-6 py-14 md:flex md:items-center md:justify-between md:gap-10">
          <div>
            <p className="text-brass text-xs uppercase tracking-[0.2em] font-semibold mb-3">Beneficios de WeMaster</p>
            <h2 className="font-display text-4xl uppercase">Formate con respaldo profesional</h2>
          </div>
          <p className="mt-5 md:mt-0 max-w-xl text-paper/75 leading-relaxed">Recibí certificado oficial, manual en PDF y asesoría de nuestros profesionales. Además, tenés 7 días para probar la membresía: si no cumple tus expectativas, podés cancelarla y solicitar la devolución.</p>
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="grid items-stretch md:grid-cols-2">
          <div className="relative aspect-[1275/1650] w-full overflow-hidden md:aspect-[1275/1650]">
            <Image
              src="/WemasterPost.jpg"
              alt="WeMaster: aprende con los mejores estés donde estés"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex items-center px-6 py-16 md:px-14 md:py-20 lg:px-20">
            <div className="max-w-xl">
              <p className="text-brass text-xs font-semibold uppercase tracking-[0.22em]">Formación sin fronteras</p>
              <h2 className="font-display mt-4 text-5xl uppercase leading-none md:text-7xl">Convertite en un Master en Estética</h2>
              <p className="mt-6 text-paper/80 leading-relaxed">
                Accedé a clases online creadas por profesionales de más de 10 países. Aprendé tendencias y técnicas de estética facial y corporal, aparatología, química cosmética, depilación, maquillaje, terapias holísticas, masaje, marketing y ventas.
              </p>
              <p className="mt-4 text-paper/80 leading-relaxed">
                Estudiá a tu ritmo, estés donde estés, con contenidos pensados para ayudarte a crecer y empezar a trabajar con más seguridad.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper py-0">
        <div className="w-full">
          <div className="grid grid-cols-2 gap-0 md:grid-cols-5">
            {[1, 2, 3, 4, 5].map((number) => (
              <div key={number} className="relative aspect-square overflow-hidden bg-ink">
                <Image
                  src={`/Post_Esp_0${number}.jpg`}
                  alt={`WeMaster publicación ${number}`}
                  fill
                  sizes="(min-width: 768px) 20vw, 50vw"
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="font-brand bg-[#393d36] text-paper">
        <div className="mx-auto flex min-h-48 w-full max-w-6xl items-center justify-between px-6 py-14 text-sm">
          <span className="relative block h-24 w-64 overflow-hidden" aria-label="WeMaster">
            <Image
              src="/Logo_We_Master_Stand-2.jpg"
              alt="WeMaster"
              fill
              sizes="256px"
              className="object-cover object-center"
            />
          </span>
          <a href="/admin" className="ml-auto text-paper hover:text-white">
            Ingreso administradores
          </a>
        </div>
      </footer>
    </main>
  );
}
