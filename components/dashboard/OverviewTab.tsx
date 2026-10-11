'use client';

import React from 'react';
import { Project } from '@/src/schemas/project.schema';
import { FloorZone } from '@/src/lib/projects-data';
import { FloorItem } from '@/src/schemas/floor-item.schema';
import { Activity, Gauge, Layers, Wrench, ShieldCheck, DollarSign, CheckCircle2, Clock } from 'lucide-react';

interface Props {
  project: Project;
  floors: FloorZone[];
  items: FloorItem[];
}

export default function OverviewTab({ project, floors, items }: Props) {
  // Compute metrics
  const totalItems = items.length;
  const inspectedCount = items.filter((i) => i.status === 'inspected').length;
  const installedCount = items.filter((i) => i.status === 'installed').length;

  const tuberiaItems = items.filter((i) => i.type === 'tuberia');
  const totalTuberiaMetros = tuberiaItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const installedTuberiaMetros = tuberiaItems
    .filter((i) => i.status !== 'pending')
    .reduce((acc, curr) => acc + curr.quantity, 0);

  const cableItems = items.filter((i) => i.type === 'cableado');
  const totalCableMetros = cableItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const installedCableMetros = cableItems
    .filter((i) => i.status !== 'pending')
    .reduce((acc, curr) => acc + curr.quantity, 0);

  const totalBudget = items.reduce((acc, curr) => acc + curr.quantity * curr.unitPrice, 0);
  const executedBudget = items
    .filter((i) => i.status !== 'pending')
    .reduce((acc, curr) => acc + curr.quantity * curr.unitPrice, 0);

  return (
    <div className="space-y-6">
      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Avance Global */}
        <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-gsitText-secondary mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avance Físico Global</span>
            <Gauge className="w-4 h-4 text-brand-primary" strokeWidth={2} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 font-mono">{project.globalProgress}%</span>
            <span className="text-xs text-gsitText-muted font-mono">
              ({inspectedCount + installedCount} / {totalItems} ítems)
            </span>
          </div>
          <div className="w-full bg-surface-subtle h-2.5 rounded-full mt-3 overflow-hidden border border-surface-border">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${project.globalProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Metrado Tubería EMT */}
        <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-gsitText-secondary mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tubería Conduit EMT</span>
            <Wrench className="w-4 h-4 text-network-pipe" strokeWidth={2} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-brand-deep font-mono">{totalTuberiaMetros}</span>
            <span className="text-xs text-gsitText-muted font-mono">m lineales</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-gsitText-secondary">
            <span>Instalado: <strong className="text-network-pipe">{installedTuberiaMetros} m</strong></span>
            <span className="font-bold">{totalTuberiaMetros > 0 ? Math.round((installedTuberiaMetros / totalTuberiaMetros) * 100) : 0}%</span>
          </div>
        </div>

        {/* Metrado Cableado FPLR */}
        <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-gsitText-secondary mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Cable FPLR Blindado</span>
            <Activity className="w-4 h-4 text-network-cable" strokeWidth={2} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-brand-deep font-mono">{totalCableMetros}</span>
            <span className="text-xs text-gsitText-muted font-mono">m lineales</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-gsitText-secondary">
            <span>Tirado: <strong className="text-network-cable">{installedCableMetros} m</strong></span>
            <span className="font-bold">{totalCableMetros > 0 ? Math.round((installedCableMetros / totalCableMetros) * 100) : 0}%</span>
          </div>
        </div>

        {/* Presupuesto Ejecutado */}
        <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-gsitText-secondary mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Corte Financiero Obra</span>
            <DollarSign className="w-4 h-4 text-emerald-600" strokeWidth={2} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-brand-deep font-mono">
              ${(executedBudget / 1000000).toFixed(1)}M
            </span>
            <span className="text-xs text-gsitText-muted font-mono">
              / ${(totalBudget / 1000000).toFixed(1)}M COP
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-gsitText-secondary">
            <span>Ejecutado: <strong className="text-emerald-600">{totalBudget > 0 ? Math.round((executedBudget / totalBudget) * 100) : 0}%</strong></span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Certificable</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Zones breakdown & Quality */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Zones Breakdown */}
        <div className="lg:col-span-2 rounded-2xl border border-surface-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-border">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-primary" strokeWidth={2} />
              <h4 className="text-sm font-bold text-brand-deep tracking-wide">
                Desglose Técnico por Zonas / Niveles
              </h4>
            </div>
            <span className="text-xs font-mono text-gsitText-muted">
              Total: {floors.length} zonas configuradas
            </span>
          </div>

          <div className="space-y-3">
            {floors.map((fl) => {
              const zoneItems = items.filter((i) => i.zone.toLowerCase().includes(fl.name.toLowerCase()) || i.zone.includes(`Piso ${fl.number}`) || i.zone.includes(`Zona ${fl.number}`));
              const zoneTotal = zoneItems.length;
              const zoneDone = zoneItems.filter((i) => i.status !== 'pending').length;
              const zonePercent = zoneTotal > 0 ? Math.round((zoneDone / zoneTotal) * 100) : fl.progress;

              return (
                <div
                  key={fl.id}
                  className="rounded-xl border border-surface-border bg-surface-main p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-brand-primary/40 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-brand-deep font-mono">{fl.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-ice text-brand-deep font-mono uppercase font-bold">
                        {fl.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-gsitText-secondary font-mono">
                      {zoneTotal} elementos asignados &bull; {zoneDone} instalados
                    </p>
                  </div>

                  <div className="flex items-center gap-3 sm:w-48">
                    <div className="w-full bg-surface-subtle h-2.5 rounded-full overflow-hidden border border-surface-border">
                      <div
                        className={`h-full rounded-full transition-all ${
                          zonePercent === 100 ? 'bg-emerald-500' : zonePercent > 0 ? 'bg-brand-primary' : 'bg-surface-border'
                        }`}
                        style={{ width: `${zonePercent}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold font-mono text-brand-deep shrink-0 w-10 text-right">
                      {zonePercent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Quality & NFPA 72 Compliance */}
        <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-surface-border">
            <ShieldCheck className="w-4 h-4 text-emerald-600" strokeWidth={2} />
            <h4 className="text-sm font-bold text-brand-deep tracking-wide">
              Auditoría &amp; Cumplimiento NFPA 72
            </h4>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-surface-main border border-surface-border flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <span className="font-bold text-brand-deep">Lazos SLC &amp; Continuidad</span>
                <p className="text-[11px] text-gsitText-secondary mt-0.5">
                  Verificación de lazo cerrado en cable FPLR sin ramales T no autorizados.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-main border border-surface-border flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <span className="font-bold text-brand-deep">Soportes &amp; Tubería EMT</span>
                <p className="text-[11px] text-gsitText-secondary mt-0.5">
                  Anclaje cada 1.5 metros con abrazaderas tipo riel unistrut y uniones metálicas.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-main border border-surface-border flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <span className="font-bold text-brand-deep">Pruebas de Baterías 24H</span>
                <p className="text-[11px] text-gsitText-secondary mt-0.5">
                  Cálculo de autonomía del tablero central FACP bajo condición de alarma simultánea.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-surface-border text-[11px] text-gsitText-secondary">
              <div className="flex justify-between py-1">
                <span>Interventoría:</span>
                <span className="text-brand-deep font-semibold">{project.interventoria}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
