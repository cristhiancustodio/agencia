import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mapa de seguridad de agencia",
  description: "Explora 31 dispositivos de seguridad en una agencia ficticia en 3D, consulta sus coberturas y registra pruebas de recorrido con guardado local.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
