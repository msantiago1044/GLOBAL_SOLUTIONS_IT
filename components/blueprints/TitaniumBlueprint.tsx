'use client';

import React, { useState } from 'react';
import { FloorItem } from '@/src/schemas/floor-item.schema';

interface Props {
  items: FloorItem[];
  currentFloorName: string;
  isEditable: boolean;
  onSelectItem?: (item: FloorItem) => void;
}

export default function TitaniumBlueprint({ items, currentFloorName, isEditable, onSelectItem }: Props) {
  const [hoveredNode, setHoveredNode] = useState<FloorItem | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inspected':
        return '#10B981';
      case 'installed':
        return '#0077B6';
      case 'pending':
      default:
        return '#F59E0B';
    }
  };

  return (
    <div className="relative w-full rounded-2xl border border-surface-border bg-white p-5 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-surface-border text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse"></div>
          <span className="font-mono font-bold uppercase text-brand-deep">
            Plano Arquitectónico &middot; Torre Titanium Plaza
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-ice text-brand-deep font-mono font-bold border border-brand-light">
            {currentFloorName}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono text-gsitText-secondary">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Planificado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-primary"></span>
            <span>Instalado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Inspeccionado</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-x-auto bg-slate-900 rounded-xl border border-slate-800 p-3 flex justify-center shadow-inner">
        <svg
          viewBox="0 0 1000 600"
          className="w-full max-w-[950px] h-auto select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="gridTitanium" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
          </defs>

          <rect width="1000" height="600" fill="url(#gridTitanium)" />

          {/* Building Outer Perimeter */}
          <rect x="50" y="50" width="900" height="500" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="3" />

          {/* Central Core / Elevator Shafts & Stairs */}
          <rect x="400" y="180" width="200" height="240" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
          <text x="500" y="215" fill="#94a3b8" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            NÚCLEO CENTRAL &middot; ASCENSORES
          </text>
          {/* Elevator Cabins */}
          <rect x="420" y="235" width="70" height="75" fill="#0f172a" stroke="#475569" strokeWidth="1" />
          <text x="455" y="278" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">ELEV 1</text>
          <rect x="510" y="235" width="70" height="75" fill="#0f172a" stroke="#475569" strokeWidth="1" />
          <text x="545" y="278" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">ELEV 2</text>

          {/* Emergency Stairs */}
          <rect x="420" y="325" width="160" height="80" fill="#0f172a" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,2" />
          <text x="500" y="368" fill="#ef4444" fontSize="10" fontFamily="monospace" textAnchor="middle">ESCALERA EMERGENCIA NFPA</text>

          {/* Office Wings */}
          {/* North Wing */}
          <rect x="80" y="70" width="840" height="90" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <text x="500" y="115" fill="#e2e8f0" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            ALA NORTE &middot; SALAS DE REUNIONES &amp; AUDITORIO
          </text>

          {/* West Wing / Datacenter */}
          <rect x="80" y="180" width="300" height="340" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <text x="230" y="220" fill="#e2e8f0" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            ALA OCCIDENTE &middot; DATACENTER &amp; NOC
          </text>
          <rect x="110" y="250" width="240" height="240" fill="#0f172a" stroke="#0077b6" strokeWidth="1" strokeDasharray="4,2" />
          <text x="230" y="375" fill="#38bdf8" fontSize="11" fontFamily="monospace" textAnchor="middle">
            CUARTO TÉCNICO DE TELECOMUNICACIONES
          </text>

          {/* East Wing / Open Office */}
          <rect x="620" y="180" width="300" height="340" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <text x="770" y="220" fill="#e2e8f0" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            ALA ORIENTE &middot; OPEN OFFICE &amp; COWORKING
          </text>

          {/* Conduit EMT Main Busway (Blue line) */}
          <path
            d="M 230 400 L 230 115 L 770 115 L 770 400"
            fill="none"
            stroke="#00b4d8"
            strokeWidth="3"
            strokeDasharray="6,3"
            opacity="0.8"
          />

          {/* Technical Nodes Plotted */}
          {items.map((item, index) => {
            let cx = 200 + (index * 130) % 600;
            let cy = 115;
            if (index % 3 === 0) {
              cx = 200 + (index * 40) % 150;
              cy = 300 + (index * 45) % 160;
            } else if (index % 3 === 1) {
              cx = 700 + (index * 40) % 150;
              cy = 280 + (index * 45) % 180;
            }

            const color = getStatusColor(item.status);

            return (
              <g
                key={item.id}
                className="cursor-pointer transition-transform hover:scale-125"
                onMouseEnter={() => setHoveredNode(item)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => onSelectItem && onSelectItem(item)}
              >
                <circle cx={cx} cy={cy} r="14" fill={color} fillOpacity="0.2" className="animate-ping" />
                <circle cx={cx} cy={cy} r="9" fill="#0f172a" stroke={color} strokeWidth="2.5" />
                <circle cx={cx} cy={cy} r="4" fill={color} />

                {/* Label */}
                <rect
                  x={cx - 24}
                  y={cy - 24}
                  width="48"
                  height="14"
                  rx="3"
                  fill="#0f172a"
                  fillOpacity="0.9"
                  stroke="#334155"
                  strokeWidth="0.8"
                />
                <text
                  x={cx}
                  y={cy - 14}
                  fill="#f1f5f9"
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {item.code}
                </text>
              </g>
            );
          })}
        </svg>

        {hoveredNode && (
          <div className="absolute bottom-4 left-4 z-20 max-w-xs rounded-xl border border-slate-700 bg-slate-900/95 p-3.5 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
              <span className="font-mono text-xs font-bold text-sky-400">{hoveredNode.code}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                  hoveredNode.status === 'inspected'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : hoveredNode.status === 'installed'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {hoveredNode.status}
              </span>
            </div>
            <p className="text-xs font-bold text-white">{hoveredNode.name}</p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">Modelo: {hoveredNode.model}</p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-300 font-mono">
              <span>Cant: {hoveredNode.quantity} {hoveredNode.unit}</span>
              <span className="text-sky-400 font-bold">${hoveredNode.unitPrice.toLocaleString('es-CO')}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-gsitText-secondary pt-2 border-t border-surface-border">
        <div>
          Total Elementos Ploteados: <strong className="text-brand-deep font-bold">{items.length}</strong>
        </div>
        <div className="flex items-center gap-2 text-brand-primary font-bold">
          <span>Global Solutions IT &middot; Lazo SLC Clase A</span>
        </div>
      </div>
    </div>
  );
}
