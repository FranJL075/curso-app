const benefits = [
  {
    number: "01",
    title: "Prácticas Presenciales",
    text: "Aplica todos los conocimientos aprendidos en nuestros Cursos Online a través de nuestras Prácticas Presenciales, donde dispondrás de todos los materiales, equipos y tecnología para realizar nuestros tratamientos.",
  },
  {
    number: "02",
    title: "Un profesional a tu lado",
    text: "Practica con tu modelo supervisado por un instructor WeMaster, quien te enseñará trucos y mejoras para el éxito del tratamiento. Nuestras prácticas intensivas se realizan en grupos reducidos y 100% supervisadas.",
  },
  {
    number: "03",
    title: "Seguridad y Confianza",
    text: "Nuestro sistema de excelencia que combina las Clases Online y las Prácticas Presenciales supervisadas, te brindarán la seguridad, confianza y experiencia necesaria para afrontar las nuevas oportunidades laborales.",
  },
];

export default function Benefits() {
  return (
    <section id="beneficios" className="bg-teal text-paper">
      <div className="mx-auto max-w-6xl px-6 py-8 md:py-10">
        <div className="max-w-2xl">
          <h2 className="font-display mt-3 text-5xl uppercase leading-none md:text-7xl">Aprendé haciendo</h2>
          <p className="mt-3 max-w-xl text-paper/75 leading-relaxed">
            La teoría online te prepara y la práctica presencial, con un instructor a tu lado, te transforma en profesional.
          </p>
        </div>
        <div className="mt-4 grid items-stretch gap-px bg-paper/20 md:grid-cols-3">
          {benefits.map((benefit) => (
            <article key={benefit.number} className="bg-teal p-4 md:p-5">
              <p className="font-display text-4xl text-brass">{benefit.number}</p>
              <h3 className="font-display mt-4 text-3xl uppercase">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/70">{benefit.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
