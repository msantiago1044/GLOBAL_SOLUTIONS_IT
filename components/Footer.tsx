import React from 'react';
import { Shield, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-surface-border text-gsitText-muted text-xs py-8 no-print mt-auto shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Logo Global Solutions IT" className="h-8 w-auto object-contain" />
              <div>
                <span className="font-extrabold text-sm text-brand-deep tracking-tight block">GLOBAL SOLUTIONS IT</span>
                <span className="text-[10px] text-brand-accent font-mono font-bold tracking-wider uppercase block">S.A.S. &bull; NIT 901.458.921-3</span>
              </div>
            </div>
            <p className="text-gsitText-secondary text-xs leading-relaxed">
              Ingeniería especializada en infraestructura de telecomunicaciones, detección temprana de incendios bajo código NFPA 72, canalizaciones conduit EMT/IMC y automatización de redes de servicios.
            </p>
          </div>

          <div>
            <h4 className="text-brand-deep font-bold mb-3 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4 text-brand-primary" strokeWidth={2} />
              Normativas &amp; Códigos
            </h4>
            <ul className="space-y-1.5 font-mono text-[11px] text-gsitText-secondary">
              <li>&bull; NFPA 72 &mdash; National Fire Alarm Code</li>
              <li>&bull; NTC 2050 &mdash; Código Eléctrico Colombiano</li>
              <li>&bull; RETIE &mdash; Reglamento Técnico de Instalaciones</li>
              <li>&bull; TIA/EIA 568-C &mdash; Cableado Estructurado</li>
            </ul>
          </div>

          <div>
            <h4 className="text-brand-deep font-bold mb-3 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-brand-primary" strokeWidth={2} />
              Especialidades de Red
            </h4>
            <ul className="space-y-1.5 text-gsitText-secondary text-xs">
              <li>&bull; Detección Inteligente &amp; Notificación Masiva</li>
              <li>&bull; Tubería Conduit EMT / IMC Certificada</li>
              <li>&bull; Cableado FPLR Blindado Clase A/B</li>
              <li>&bull; Interventoría y Actas de Metrado Oficial</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} Global Solutions IT S.A.S. &mdash; Todos los derechos reservados.
          </div>
          <div className="text-gsitText-muted">
            Plataforma de Control Operativo y Ejecución de Obras
          </div>
        </div>
      </div>
    </footer>
  );
}
