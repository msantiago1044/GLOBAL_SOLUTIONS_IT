import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Global Solutions IT | Plataforma de Gestión y Ejecución de Obras',
  description: 'Gestión centralizada de redes de detección y alarma contra incendios NFPA 72 — Global Solutions IT S.A.S.',
  icons: {
    icon: '/favicon.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-surface-main text-gsitText-main antialiased selection:bg-brand-ice selection:text-brand-deep">
        {children}
      </body>
    </html>
  );
}
