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
  Building2,
  MapPin,
  CheckCircle2,
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
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-ice border border-brand-cyan/40 text-brand-deep text-xs font-mono font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
                <span>Ingeniería en Redes &middot; NFPA 72 &middot; RETIE &middot; NTC 2050</span>
              </div>

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

        {/* Featured Projects Showcase (Matching media_1791659190816.png Card Style) */}
        <section className="py-14 bg-surface-main">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xs font-mono font-bold uppercase text-brand-accent tracking-widest">
                  Obras en Ejecución
                </h2>
                <p className="text-2xl font-bold text-brand-deep mt-1">
                  Portafolio de Proyectos Activos
                </p>
              </div>
              <Link
                href="/projects"
                className="text-xs font-bold text-brand-primary hover:text-brand-deep flex items-center gap-1 transition-colors"
              >
                <span>Ver Portafolio Completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1: Torre Titanium */}
              <div className="relative rounded-2xl border-2 border-brand-primary bg-white p-6 shadow-gsit-md flex flex-col justify-between overflow-hidden">
                {/* Diagonal Ribbon EN OBRA */}
                <div className="absolute top-4 -right-12 bg-brand-deep text-white text-[10px] font-extrabold uppercase py-1 px-12 rotate-45 shadow-sm tracking-wider">
                  EN OBRA
                </div>

                <div className="space-y-4">
                  {/* Category Pill */}
                  <div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-brand-ice text-brand-deep uppercase tracking-wide">
                      EDIFICACIÓN VERTICAL
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-2xl font-black text-brand-deep tracking-tight">
                      Torre Titanium Plaza
                    </h3>
                    <p className="text-xs text-gsitText-secondary mt-1 leading-relaxed">
                      Instalación integral de sistema de detección y alarma contra incendios NFPA 72. Riser troncal, cuarto de control en Piso 1, oficinas y parqueaderos.
                    </p>
                  </div>

                  {/* Progress Bar with Green Metric */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gsitText-secondary">Avance de Ejecución</span>
                      <span className="font-black text-emerald-600 text-sm">58.0%</span>
                    </div>
                    <div className="w-full bg-surface-subtle h-2.5 rounded-full overflow-hidden border border-surface-border">
                      <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '58%' }}></div>
                    </div>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap gap-2 text-[11px] font-medium text-gsitText-secondary pt-2">
                    <span className="px-2.5 py-1 rounded-md bg-surface-subtle border border-surface-border flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-brand-primary" /> 15 Niveles
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-surface-subtle border border-surface-border flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-500" /> Bogotá D.C.
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-surface-subtle border border-surface-border">
                      Notifier NFS2-3030
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-surface-subtle border border-surface-border flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Esquema Bloqueado
                    </span>
                  </div>
                </div>

                {/* Big Action Button */}
                <div className="pt-6 mt-4 border-t border-surface-border">
                  <Link
                    href="/projects/torre-titanium"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-deep hover:bg-brand-hover text-white font-bold text-xs tracking-wide transition-all shadow-gsit-sm"
                  >
                    <span>Ingresar al Estudio Técnico de Obra</span>
                    <ArrowRight className="w-4 h-4 text-brand-cyan" />
                  </Link>
                </div>
              </div>

              {/* Card 2: Estadio Metropolitano */}
              <div className="relative rounded-2xl border-2 border-brand-accent bg-white p-6 shadow-gsit-md flex flex-col justify-between overflow-hidden">
                {/* Diagonal Ribbon EN DISEÑO */}
                <div className="absolute top-4 -right-12 bg-brand-accent text-white text-[10px] font-extrabold uppercase py-1 px-12 rotate-45 shadow-sm tracking-wider">
                  EN DISEÑO
                </div>

                <div className="space-y-4">
                  {/* Category Pill */}
                  <div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-brand-ice text-brand-deep uppercase tracking-wide">
                      COMPLEJO DEPORTIVO
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-2xl font-black text-brand-deep tracking-tight">
                      Estadio Metropolitano Roberto Meléndez
                    </h3>
                    <p className="text-xs text-gsitText-secondary mt-1 leading-relaxed">
                      Detección temprana por haz proyectado (beam) y canalizaciones conduit en graderías Occidental, Oriental, Norte, Sur, palcos VIP y cuarto de bombas RCI.
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gsitText-secondary">Avance de Ejecución</span>
                      <span className="font-black text-brand-accent text-sm">0.0% (Configurable)</span>
                    </div>
                    <div className="w-full bg-surface-subtle h-2.5 rounded-full overflow-hidden border border-surface-border">
                      <div className="bg-brand-accent h-full rounded-full transition-all duration-500" style={{ width: '8%' }}></div>
                    </div>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap gap-2 text-[11px] font-medium text-gsitText-secondary pt-2">
                    <span className="px-2.5 py-1 rounded-md bg-surface-subtle border border-surface-border flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-brand-primary" /> 6 Zonas Deportivas
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-surface-subtle border border-surface-border flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-500" /> Barranquilla, Atlántico
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-surface-subtle border border-surface-border">
                      Haz BEAM &middot; Clase B
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800">
                      Borrador en Diseño
                    </span>
                  </div>
                </div>

                {/* Big Action Button */}
                <div className="pt-6 mt-4 border-t border-surface-border">
                  <Link
                    href="/projects/estadio-metropolitano"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-accent hover:bg-brand-primary text-white font-bold text-xs tracking-wide transition-all shadow-gsit-sm"
                  >
                    <span>Ver Proyecto y Estudio Técnico</span>
                    <ArrowRight className="w-4 h-4 text-brand-ice" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
