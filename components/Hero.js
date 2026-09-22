export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.84),rgba(0,0,0,.36)),url('https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=2000&q=85')] bg-cover bg-center" />
      <div className="relative mx-auto flex min-h-[560px] max-w-6xl items-center px-6 py-20 md:py-24">
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-brass">Formación profesional en estética</p>
          <h1 className="max-w-3xl font-display text-6xl uppercase leading-[0.88] md:text-8xl">
            <span className="block">WeMaster</span>
            <span className="mt-5 block">Prácticas Presenciales</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-paper/85 md:text-xl">
            Clases online y prácticas presenciales supervisadas para aprender estética con seguridad.
          </p>
          <div className="mt-8 flex items-center">
            <a href="#catalogo" className="bg-brass px-7 py-4 font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-brass-dark">
              Reserva tus clases aquí
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
