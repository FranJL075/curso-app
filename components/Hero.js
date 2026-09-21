export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.84),rgba(0,0,0,.36)),url('https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=2000&q=85')] bg-cover bg-center" />
      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-36">
        <p className="text-brass text-sm font-semibold uppercase tracking-[0.22em] mb-5">Cursos y clases presenciales</p>
        <h1 className="font-display text-6xl md:text-8xl uppercase leading-[0.88] max-w-3xl">
          Aprendé con los mejores, en persona.
        </h1>
        <p className="mt-7 max-w-xl text-paper/85 text-base md:text-lg leading-relaxed">
          WeMaster te conecta con profesionales para que aprendas, practiques y te conviertas en un Master en Estética.
        </p>
        <a
          href="#cursos"
          className="inline-block mt-9 bg-brass text-ink font-semibold uppercase tracking-wide px-7 py-4 hover:bg-brass-dark transition-colors"
        >
          Ver cursos y clases
        </a>
      </div>
    </section>
  );
}
