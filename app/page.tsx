'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ShieldCheck,
  Radio,
  Flame,
  Wrench,
  FileCheck2,
  ArrowRight,
  Layers,
  Activity,
  Cpu,
  Lock,
  Building2,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-industrial-950 text-industrial-100">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-28 border-b border-industrial-850 bg-blueprint-radar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-radar-500/10 border border-radar-500/30 text-radar-500 text-xs font-mono font-semibold">
                <span className="w-2 h-2 rounded-full bg-radar-500 animate-pulse"></span>
                <span>Ingeniería en Redes &middot; NFPA 72 &middot; RETIE &middot; NTC 2050</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Plataforma de Control &amp; Ejecución de Obras en <span className="text-radar-500">Redes y Seguridad</span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-industrial-400 font-mono leading-relaxed">
                Gestión técnica integral para proyectos de detección y alarma de incendios, canalizaciones conduit EMT/IMC y cableado estructurado. Diseñado para integrarse a la suite de ingeniería de <strong>PROCIMEC</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/projects"
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-radar-500 hover:bg-radar-400 text-industrial-950 font-bold text-sm tracking-wide transition-all shadow-industrial-glow"
                >
                  <Layers className="w-4 h-4" strokeWidth={2} />
                  <span>Explorar Proyectos en Obra</span>
                  <ArrowRight className="w-4 h-4 ml-1" strokeWidth={2} />
                </Link>

                <Link
                  href="/login"
                  className="flex items-center gap-2 px-5 py-3 rounded-lg bg-industrial-900 hover:bg-industrial-850 border border-industrial-800 hover:border-radar-500/40 text-sm font-semibold text-white transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-radar-500" strokeWidth={1.75} />
                  <span>Portal Administrativo</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Background ambient gradient */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-radar-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        </section>

        {/* Technical Capabilities Grid */}
        <section className="py-16 border-b border-industrial-850 bg-industrial-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-xs font-mono font-bold uppercase text-radar-500 tracking-widest">
                Especialidades de Red
              </h2>
              <p className="text-2xl font-bold text-white mt-1">
                Ingeniería de Precisión en Cada Metro Instalado
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="rounded-xl border border-industrial-800 bg-industrial-900 p-6 shadow-industrial-sm space-y-3 hover:border-radar-500/40 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-radar-500/10 border border-radar-500/30 flex items-center justify-center text-radar-500">
                  <Flame className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <h3 className="text-base font-bold text-white">Detección Inteligente NFPA 72</h3>
                <p className="text-xs text-industrial-400 font-mono leading-relaxed">
                  Planos de direccionamiento de sensores fotoeléctricos, térmicos, estaciones manuales y lazos SLC Clase A con aislamiento de falla.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-xl border border-industrial-800 bg-industrial-900 p-6 shadow-industrial-sm space-y-3 hover:border-radar-500/40 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Wrench className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <h3 className="text-base font-bold text-white">Canalización &amp; Tubería Conduit</h3>
                <p className="text-xs text-industrial-400 font-mono leading-relaxed">
                  Cálculo de ocupación y metrado en tuberías EMT / IMC de 3/4" y 1", soportería antisísmica y uniones herméticas a intemperie.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-xl border border-industrial-800 bg-industrial-900 p-6 shadow-industrial-sm space-y-3 hover:border-radar-500/40 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <FileCheck2 className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <h3 className="text-base font-bold text-white">Metrado &amp; Cortes Oficiales</h3>
                <p className="text-xs text-industrial-400 font-mono leading-relaxed">
                  Generación de actas legales de avance para interventoría, valorizaciones en pesos colombianos y congelamiento formal de esquemas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects Showcase */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <h2 className="text-xs font-mono font-bold uppercase text-radar-500 tracking-widest">
                  Obras en Curso
                </h2>
                <p className="text-2xl font-bold text-white mt-1">
                  Proyectos en Ejecución &amp; Diseño
                </p>
              </div>
              <Link
                href="/projects"
                className="text-xs font-mono text-radar-500 hover:text-radar-400 flex items-center gap-1 font-semibold"
              >
                <span>Ver Portafolio Completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card: Estadio Metropolitano */}
              <div className="rounded-xl border border-radar-500/30 bg-industrial-900 p-6 shadow-industrial-md flex flex-col justify-between hover:border-radar-500 transition-colors">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-radar-500/20 text-radar-500 font-bold uppercase border border-radar-500/30">
                        Borrador &middot; Esquema Editable
                      </span>
                      <h3 className="text-xl font-bold text-white mt-2">
                        Estadio Metropolitano Roberto Meléndez
                      </h3>
                      <p className="text-xs text-industrial-400 font-mono mt-0.5">
                        Barranquilla, Atlántico &middot; 6 Zonas Deportivas
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-industrial-300 font-mono leading-relaxed">
                    Proyecto deportivo de gran escala. Cuenta con un dashboard de diseño interactivo para configurar detectores de haz proyectado (beam), tubería conduit perimetral y lazos de voceo masivo.
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-xs font-mono">
                    <div className="p-2.5 rounded bg-industrial-950 border border-industrial-800">
                      <span className="text-industrial-500 block text-[10px]">ESTADO:</span>
                      <span className="text-radar-500 font-bold">Configurable</span>
                    </div>
                    <div className="p-2.5 rounded bg-industrial-950 border border-industrial-800">
                      <span className="text-industrial-500 block text-[10px]">SISTEMA:</span>
                      <span className="text-white font-bold">Haz &middot; Haz BEAM</span>
                    </div>
                    <div className="p-2.5 rounded bg-industrial-950 border border-industrial-800">
                      <span className="text-industrial-500 block text-[10px]">AVANCE:</span>
                      <span className="text-white font-bold">0% Inicial</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-industrial-800 flex items-center justify-between">
                  <Link
                    href="/projects/estadio-metropolitano"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-radar-500 hover:bg-radar-400 text-industrial-950 font-bold text-xs font-mono transition-colors shadow-industrial-sm"
                  >
                    <span>Abrir Dashboard y Configurar Esquema</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Card: Torre Titanium Plaza */}
              <div className="rounded-xl border border-industrial-800 bg-industrial-900 p-6 shadow-industrial-md flex flex-col justify-between hover:border-industrial-700 transition-colors">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase border border-emerald-500/30">
                        En Obra &middot; Esquema Bloqueado
                      </span>
                      <h3 className="text-xl font-bold text-white mt-2">
                        Torre Titanium Plaza
                      </h3>
                      <p className="text-xs text-industrial-400 font-mono mt-0.5">
                        Bogotá D.C. &middot; 15 Niveles Corporativos
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-industrial-300 font-mono leading-relaxed">
                    Edificio de oficinas de alta densidad con lazo SLC redundante Notifier NFS2-3030 Clase A. Esquema técnico congelado y certificado para corte de obra con interventoría.
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-xs font-mono">
                    <div className="p-2.5 rounded bg-industrial-950 border border-industrial-800">
                      <span className="text-industrial-500 block text-[10px]">AVANCE:</span>
                      <span className="text-emerald-400 font-bold">58% Físico</span>
                    </div>
                    <div className="p-2.5 rounded bg-industrial-950 border border-industrial-800">
                      <span className="text-industrial-500 block text-[10px]">SISTEMA:</span>
                      <span className="text-white font-bold">SLC Clase A</span>
                    </div>
                    <div className="p-2.5 rounded bg-industrial-950 border border-industrial-800">
                      <span className="text-industrial-500 block text-[10px]">TUBERÍA:</span>
                      <span className="text-white font-bold">340 m EMT</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-industrial-800 flex items-center justify-between">
                  <Link
                    href="/projects/torre-titanium"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-industrial-850 hover:bg-industrial-800 border border-industrial-700 text-white font-semibold text-xs font-mono transition-colors"
                  >
                    <span>Ver Dashboard de Control</span>
                    <ArrowRight className="w-4 h-4 text-radar-500" />
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
