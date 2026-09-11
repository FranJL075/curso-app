export default function Hero() {
  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <p className="text-brass text-sm tracking-wide mb-6">Próxima cohorte abierta</p>
        <h1 className="font-display text-4xl md:text-6xl leading-[1.05] max-w-3xl">
          Aprendé un oficio que se nota en tu primer trabajo.
        </h1>
        <p className="mt-6 max-w-xl text-paper/80 text-lg">
          Cursos cortos, dictados por gente que trabaja en esto todos los días.
          Elegí el que te sirve, dejá tus datos y te guardamos el lugar.
        </p>
        <a
          href="#cursos"
          className="inline-block mt-10 bg-brass text-ink font-medium px-6 py-3 hover:bg-brass-dark transition-colors"
        >
          Ver cursos disponibles
        </a>
      </div>
    </section>
  );
}
