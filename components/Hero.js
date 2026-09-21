export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.84),rgba(0,0,0,.36)),url('https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=2000&q=85')] bg-cover bg-center" />
      <div className="relative mx-auto grid min-h-[680px] max-w-6xl items-end gap-12 px-6 py-20 md:grid-cols-[1.1fr_.7fr] md:items-center md:py-28">
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-brass">Miami, USA · Formación profesional</p>
          <h1 className="max-w-3xl font-display text-6xl uppercase leading-[0.88] md:text-8xl">
            <span className="block">WeMaster</span>
            <span className="mt-5 block">Prácticas Presenciales</span>
          </h1>
          <p className="mt-6 font-display text-3xl uppercase text-paper/90 md:text-4xl">Un instructor a tu lado</p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/75 md:text-lg">
            Combiná clases online con prácticas presenciales supervisadas. Aprendé estética facial y corporal en un entorno real, seguro y pensado para ayudarte a trabajar con confianza.
          </p>
          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a href="#catalogo" className="bg-brass px-7 py-4 font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-brass-dark">
              Reservar una práctica
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
