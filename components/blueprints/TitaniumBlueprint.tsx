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
        return '#3B82F6';
      case 'pending':
      default:
        return '#EAA023';
    }
  };

  return (
    <div className="relative w-full rounded-xl border border-industrial-800 bg-industrial-950/80 p-4 overflow-hidden shadow-industrial-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-industrial-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="font-mono font-semibold uppercase text-industrial-300">
            Plano Arquitectónico &middot; Torre Titanium Plaza
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono border border-blue-500/20">
            {currentFloorName}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono text-industrial-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-radar-500"></span>
            <span>Planificado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Instalado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Inspeccionado</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-x-auto bg-industrial-900/60 rounded-lg border border-industrial-800/80 p-2 flex justify-center bg-blueprint-grid">
        <svg
          viewBox="0 0 1000 600"
          className="w-full max-w-[950px] h-auto select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="gridTitanium" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#2A303C" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
          </defs>

          <rect width="1000" height="600" fill="url(#gridTitanium)" />

          {/* Building Outer Perimeter */}
          <rect x="50" y="50" width="900" height="500" rx="4" fill="#1A1E24" stroke="#3D4556" strokeWidth="3" />

          {/* Central Core / Elevator Shafts & Stairs */}
          <rect x="400" y="180" width="200" height="240" fill="#242932" stroke="#4B5563" strokeWidth="2" />
          <text x="500" y="215" fill="#94A3B8" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            NÚCLEO CENTRAL &middot; ASCENSORES
          </text>
          {/* Elevator Cabins */}
          <rect x="420" y="235" width="70" height="75" fill="#1E2229" stroke="#64748B" strokeWidth="1" />
          <text x="455" y="278" fill="#64748B" fontSize="10" fontFamily="monospace" textAnchor="middle">ELEV 1</text>
          <rect x="510" y="235" width="70" height="75" fill="#1E2229" stroke="#64748B" strokeWidth="1" />
          <text x="545" y="278" fill="#64748B" fontSize="10" fontFamily="monospace" textAnchor="middle">ELEV 2</text>

          {/* Emergency Stairs */}
          <rect x="420" y="325" width="160" height="80" fill="#1E2229" stroke="#EF4444" strokeWidth="1" strokeDasharray="3,2" />
          <text x="500" y="368" fill="#EF4444" fontSize="10" fontFamily="monospace" textAnchor="middle">ESCALERA EMERGENCIA NFPA</text>

          {/* Office Wings */}
          {/* North Wing */}
          <rect x="80" y="70" width="840" height="90" fill="#1E2229" stroke="#3D4556" strokeWidth="1.5" />
          <text x="500" y="115" fill="#CBD5E1" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            ALA NORTE &middot; SALAS DE REUNIONES &amp; AUDITORIO
          </text>

          {/* West Wing / Datacenter & Racks */}
          <rect x="80" y="180" width="300" height="340" fill="#1E2229" stroke="#3D4556" strokeWidth="1.5" />
          <text x="230" y="220" fill="#CBD5E1" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            ALA OCCIDENTE &middot; DATACENTER &amp; NOC
          </text>
          {/* Server Rack Area */}
          <rect x="110" y="250" width="240" height="240" fill="#15181D" stroke="#3B82F6" strokeWidth="1" strokeDasharray="4,2" />
          <text x="230" y="375" fill="#60A5FA" fontSize="11" fontFamily="monospace" textAnchor="middle">
            CUARTO TÉCNICO DE TELECOMUNICACIONES
          </text>

          {/* East Wing / Open Office */}
          <rect x="620" y="180" width="300" height="340" fill="#1E2229" stroke="#3D4556" strokeWidth="1.5" />
          <text x="770" y="220" fill="#CBD5E1" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            ALA ORIENTE &middot; OPEN OFFICE &amp; COWORKING
          </text>

          {/* Conduit EMT Main Busway (Red / Amber line) */}
          <path
            d="M 230 400 L 230 115 L 770 115 L 770 400"
            fill="none"
            stroke="#EAA023"
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
                <circle cx={cx} cy={cy} r="9" fill="#15181D" stroke={color} strokeWidth="2.5" />
                <circle cx={cx} cy={cy} r="4" fill={color} />

                {/* Label */}
                <rect
                  x={cx - 24}
                  y={cy - 24}
                  width="48"
                  height="14"
                  rx="3"
                  fill="#15181D"
                  fillOpacity="0.9"
                  stroke="#2A303C"
                  strokeWidth="0.8"
                />
                <text
                  x={cx}
                  y={cy - 14}
                  fill="#CBD5E1"
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
          <div className="absolute bottom-4 left-4 z-20 max-w-xs rounded-lg border border-industrial-700 bg-industrial-900/95 p-3 shadow-industrial-md backdrop-blur-md">
            <div className="flex items-center justify-between gap-2 border-b border-industrial-800 pb-2 mb-2">
              <span className="font-mono text-xs font-bold text-radar-500">{hoveredNode.code}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold uppercase ${
                  hoveredNode.status === 'inspected'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : hoveredNode.status === 'installed'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-radar-500/20 text-radar-500 border border-radar-500/30'
                }`}
              >
                {hoveredNode.status}
              </span>
            </div>
            <p className="text-xs font-semibold text-white">{hoveredNode.name}</p>
            <p className="text-[11px] text-industrial-400 font-mono mt-0.5">Modelo: {hoveredNode.model}</p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-industrial-300 font-mono">
              <span>Cant: {hoveredNode.quantity} {hoveredNode.unit}</span>
              <span className="text-radar-500">${hoveredNode.unitPrice.toLocaleString('es-CO')}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-industrial-400 pt-2 border-t border-industrial-800">
        <div>
          Total Elementos Ploteados: <span className="text-white font-bold">{items.length}</span>
        </div>
        <div className="flex items-center gap-2 text-radar-500">
          <span>Estándar NFPA 72 - Lazo SLC Clase A</span>
        </div>
      </div>
    </div>
  );
}
