import React from 'react';
import { Shield, Cpu, Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-industrial-950 border-t border-industrial-800 text-industrial-500 text-xs py-8 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold tracking-wider">
              <span>GLOBAL SOLUTIONS IT</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-radar-500/10 text-radar-500 font-mono border border-radar-500/30">S.A.S.</span>
            </div>
            <p className="text-industrial-400 text-xs leading-relaxed">
              Ingeniería especializada en infraestructura de telecomunicaciones, detección temprana de incendios bajo código NFPA 72 y automatización de redes de servicios.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-radar-500" strokeWidth={1.75} />
              Normativas & Códigos
            </h4>
            <ul className="space-y-1.5 font-mono text-[11px] text-industrial-400">
              <li>&bull; NFPA 72 &mdash; National Fire Alarm Code</li>
              <li>&bull; NTC 2050 &mdash; Código Eléctrico Colombiano</li>
              <li>&bull; RETIE &mdash; Reglamento Técnico de Instalaciones</li>
              <li>&bull; TIA/EIA 568-C &mdash; Cableado Estructurado</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-radar-500" strokeWidth={1.75} />
              Especialidades
            </h4>
            <ul className="space-y-1.5 text-industrial-400 text-xs">
              <li>&bull; Detección Inteligente & Notificación Masiva</li>
              <li>&bull; Tubería Conduit EMT / IMC Certificada</li>
              <li>&bull; Cableado FPLR Blindado Clase A/B</li>
              <li>&bull; Interventoría y Actas de Metrado Oficial</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />
              Estado del Sistema
            </h4>
            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between text-industrial-400">
                <span>Arquitectura:</span>
                <span className="text-white">Next.js 14 App Router</span>
              </div>
              <div className="flex items-center justify-between text-industrial-400">
                <span>Design System:</span>
                <span className="text-radar-500 font-semibold">Industrial Precision</span>
              </div>
              <div className="flex items-center justify-between text-industrial-400">
                <span>Database Sync:</span>
                <span className="text-emerald-400">Supabase PostgreSQL</span>
              </div>
              <div className="flex items-center justify-between text-industrial-400">
                <span>Compatibilidad:</span>
                <span className="text-white">PROCIMEC Suite Ready</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-industrial-850 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} Global Solutions IT S.A.S. &mdash; Todos los derechos reservados.
          </div>
          <div className="text-industrial-600">
            Módulo Integrado para Suite de Ingeniería y Redes Industriales
          </div>
        </div>
      </div>
    </footer>
  );
}
