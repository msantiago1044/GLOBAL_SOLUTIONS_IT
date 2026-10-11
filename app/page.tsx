'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Flame,
  Wrench,
  FileCheck2,
  ArrowRight,
  Layers,
  ShieldCheck,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-main text-gsitText-main">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 lg:py-24 border-b border-surface-border bg-gradient-to-b from-white to-surface-main">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-6">
              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-brand-deep leading-tight">
                Control Operativo &amp; Ejecución de Obras en <span className="text-brand-accent">Redes de Seguridad</span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-gsitText-secondary leading-relaxed">
                Plataforma técnica especializada de <strong>Global Solutions IT S.A.S.</strong> para el control, metrado y certificación in-situ de redes de detección de incendios, canalizaciones conduit EMT/IMC y cableado estructurado.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/projects"
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-deep hover:bg-brand-hover text-white font-bold text-sm tracking-wide transition-all shadow-gsit-md"
                >
                  <Layers className="w-4 h-4" strokeWidth={2} />
                  <span>Explorar Portafolio de Proyectos</span>
                  <ArrowRight className="w-4 h-4 ml-1" strokeWidth={2} />
                </Link>

                <Link
                  href="/login"
                  className="flex items-center gap-2 px-5 py-3 rounded-lg bg-white hover:bg-surface-subtle border border-surface-borderStrong text-sm font-bold text-brand-deep transition-colors shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4 text-brand-accent" strokeWidth={2} />
                  <span>Portal Administrativo</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Capabilities */}
        <section className="py-14 border-b border-surface-border bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-xs font-mono font-bold uppercase text-brand-accent tracking-widest">
                Especialidades de Ingeniería
              </h2>
              <p className="text-2xl font-bold text-brand-deep mt-1">
                Garantía y Precisión Técnica en Cada Tramo
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="rounded-xl border border-surface-border bg-surface-main p-6 shadow-sm space-y-3 hover:border-brand-primary transition-all">
                <div className="w-12 h-12 rounded-lg bg-brand-ice border border-brand-cyan/40 flex items-center justify-center text-brand-deep shadow-sm">
                  <Flame className="w-6 h-6 text-network-cable" strokeWidth={2} />
                </div>
                <h3 className="text-base font-bold text-brand-deep">Detección Temprana NFPA 72</h3>
                <p className="text-xs text-gsitText-secondary leading-relaxed">
                  Lazos SLC direccionables Clase A, detectores fotoeléctricos inteligentes, haz proyectado (beam) y estaciones manuales con mapeo en tiempo real.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-xl border border-surface-border bg-surface-main p-6 shadow-sm space-y-3 hover:border-brand-primary transition-all">
                <div className="w-12 h-12 rounded-lg bg-brand-ice border border-brand-cyan/40 flex items-center justify-center text-brand-deep shadow-sm">
                  <Wrench className="w-6 h-6 text-network-pipe" strokeWidth={2} />
                </div>
                <h3 className="text-base font-bold text-brand-deep">Canalizaciones Conduit EMT</h3>
                <p className="text-xs text-gsitText-secondary leading-relaxed">
                  Tubería metálica eléctrica de 3/4" y 1" galvanizada en caliente, soportería antisísmica con abrazaderas unistrut y cajas de paso NEMA.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-xl border border-surface-border bg-surface-main p-6 shadow-sm space-y-3 hover:border-brand-primary transition-all">
                <div className="w-12 h-12 rounded-lg bg-brand-ice border border-brand-cyan/40 flex items-center justify-center text-brand-deep shadow-sm">
                  <FileCheck2 className="w-6 h-6 text-emerald-600" strokeWidth={2} />
                </div>
                <h3 className="text-base font-bold text-brand-deep">Metrado &amp; Actas Oficiales</h3>
                <p className="text-xs text-gsitText-secondary leading-relaxed">
                  Control financiero de avance en obra, actas de corte suscritas con interventoría técnica y congelamiento formal de planos para ejecución.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
