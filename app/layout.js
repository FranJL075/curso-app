import "./globals.css";

export const metadata = {
  title: "WeMaster — Inscribite a nuestros cursos",
  description:
    "Elegí un curso, dejá tus datos y te confirmamos el cupo. Formación práctica, cupos limitados.",
  icons: {
    icon: {
      url: "/Logo_We_Master_Stand-2copia.jpg",
      type: "image/jpeg",
    },
  },
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
