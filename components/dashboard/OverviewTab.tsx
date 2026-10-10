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
  const pendingCount = items.filter((i) => i.status === 'pending').length;

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

  const equiposItems = items.filter((i) => !['tuberia', 'cableado'].includes(i.type));
  const totalEquipos = equiposItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const installedEquipos = equiposItems
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
        <div className="rounded-xl border border-industrial-800 bg-industrial-900 p-4 shadow-industrial-sm">
          <div className="flex items-center justify-between text-industrial-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Avance Físico Global</span>
            <Gauge className="w-4 h-4 text-radar-500" strokeWidth={1.75} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{project.globalProgress}%</span>
            <span className="text-xs text-industrial-400 font-mono">
              ({inspectedCount + installedCount} / {totalItems} ítems)
            </span>
          </div>
          <div className="w-full bg-industrial-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-radar-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${project.globalProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Metrado Tubería EMT */}
        <div className="rounded-xl border border-industrial-800 bg-industrial-900 p-4 shadow-industrial-sm">
          <div className="flex items-center justify-between text-industrial-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Tubería Conduit EMT</span>
            <Wrench className="w-4 h-4 text-blue-400" strokeWidth={1.75} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{totalTuberiaMetros}</span>
            <span className="text-xs text-industrial-400 font-mono">m lineales</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-industrial-400">
            <span>Instalado: <strong className="text-blue-400">{installedTuberiaMetros} m</strong></span>
            <span>{totalTuberiaMetros > 0 ? Math.round((installedTuberiaMetros / totalTuberiaMetros) * 100) : 0}%</span>
          </div>
        </div>

        {/* Metrado Cableado FPLR */}
        <div className="rounded-xl border border-industrial-800 bg-industrial-900 p-4 shadow-industrial-sm">
          <div className="flex items-center justify-between text-industrial-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Cable FPLR Blindado</span>
            <Activity className="w-4 h-4 text-amber-400" strokeWidth={1.75} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{totalCableMetros}</span>
            <span className="text-xs text-industrial-400 font-mono">m lineales</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-industrial-400">
            <span>Tirado: <strong className="text-amber-400">{installedCableMetros} m</strong></span>
            <span>{totalCableMetros > 0 ? Math.round((installedCableMetros / totalCableMetros) * 100) : 0}%</span>
          </div>
        </div>

        {/* Presupuesto Ejecutado */}
        <div className="rounded-xl border border-industrial-800 bg-industrial-900 p-4 shadow-industrial-sm">
          <div className="flex items-center justify-between text-industrial-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Corte Financiero Obra</span>
            <DollarSign className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-white font-mono">
              ${(executedBudget / 1000000).toFixed(1)}M
            </span>
            <span className="text-xs text-industrial-400 font-mono">
              / ${(totalBudget / 1000000).toFixed(1)}M COP
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-industrial-400">
            <span>Ejecutado: <strong className="text-emerald-400">{totalBudget > 0 ? Math.round((executedBudget / totalBudget) * 100) : 0}%</strong></span>
            <span className="text-emerald-500 font-semibold">Certificable</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Zones breakdown & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Zones Breakdown */}
        <div className="lg:col-span-2 rounded-xl border border-industrial-800 bg-industrial-900 p-5 shadow-industrial-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-industrial-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-radar-500" strokeWidth={1.75} />
              <h4 className="text-sm font-bold text-white tracking-wide">
                Desglose Técnico por Zonas / Niveles
              </h4>
            </div>
            <span className="text-xs font-mono text-industrial-400">
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
                  className="rounded-lg border border-industrial-850 bg-industrial-950/60 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-industrial-700 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono">{fl.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-industrial-800 text-industrial-300 font-mono uppercase">
                        {fl.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-industrial-400 font-mono">
                      {zoneTotal} elementos asignados &bull; {zoneDone} instalados
                    </p>
                  </div>

                  <div className="flex items-center gap-3 sm:w-48">
                    <div className="w-full bg-industrial-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          zonePercent === 100 ? 'bg-emerald-500' : zonePercent > 0 ? 'bg-radar-500' : 'bg-industrial-700'
                        }`}
                        style={{ width: `${zonePercent}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold font-mono text-white shrink-0 w-10 text-right">
                      {zonePercent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Quality & NFPA 72 Compliance Checklist */}
        <div className="rounded-xl border border-industrial-800 bg-industrial-900 p-5 shadow-industrial-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-industrial-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />
            <h4 className="text-sm font-bold text-white tracking-wide">
              Auditoría & Cumplimiento NFPA 72
            </h4>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-industrial-950/80 border border-industrial-850 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" strokeWidth={1.75} />
              <div>
                <span className="font-semibold text-white">Lazos SLC &amp; Topología</span>
                <p className="text-[11px] text-industrial-400 mt-0.5">
                  Verificación de continuidad en cables FPLR sin derivaciones tipo T no autorizadas.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-industrial-950/80 border border-industrial-850 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" strokeWidth={1.75} />
              <div>
                <span className="font-semibold text-white">Soportes &amp; Tubería EMT</span>
                <p className="text-[11px] text-industrial-400 mt-0.5">
                  Anclaje cada 1.5 metros con abrazaderas tipo riel unistrut y uniones metálicas.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-industrial-950/80 border border-industrial-850 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-radar-500 shrink-0 mt-0.5" strokeWidth={1.75} />
              <div>
                <span className="font-semibold text-white">Pruebas de Baterías 24H</span>
                <p className="text-[11px] text-industrial-400 mt-0.5">
                  Cálculo de autonomía del tablero central FACP bajo condición de alarma simultánea.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-industrial-800 text-[11px] text-industrial-400">
              <div className="flex justify-between py-1">
                <span>Estado del Esquema:</span>
                <span className={`font-bold uppercase ${project.schemaStatus === 'locked' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {project.schemaStatus === 'locked' ? '🔒 Bloqueado' : '📝 Editable'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>Interventoría:</span>
                <span className="text-white">{project.interventoria}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
