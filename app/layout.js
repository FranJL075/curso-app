import "./globals.css";

export const metadata = {
  title: "WeMaster Prácticas Presenciales | Estética en Miami",
  description:
    "Clases online y prácticas presenciales supervisadas de estética en Miami, USA. Grupos reducidos, modelos reales y formación profesional.",
  icons: {
    icon: {
      url: "/Logo_We_Master_Stand-2copia.jpg",
      type: "image/jpeg",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col bg-paper text-ink-soft font-body">
        {children}
      </body>
    </html>
  );
}
