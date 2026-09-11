import "./globals.css";

export const metadata = {
  title: "Academia Cursos — Inscribite a nuestros cursos",
  description:
    "Elegí un curso, dejá tus datos y te confirmamos el cupo. Formación práctica, cupos limitados.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-paper text-ink-soft font-body">
        {children}
      </body>
    </html>
  );
}
