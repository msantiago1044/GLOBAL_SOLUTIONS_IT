import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Global Solutions IT — Redes, Seguridad Electrónica & NFPA 72',
  description: 'Plataforma Corporativa de Gestión Técnica y Ejecución de Obras en Redes, Detección y Notificación de Incendios NFPA 72',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-industrial-950 text-industrial-100 antialiased selection:bg-radar-500 selection:text-industrial-950">
        {children}
      </body>
    </html>
  );
}
