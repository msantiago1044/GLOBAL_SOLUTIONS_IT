'use client';

import React, { useState } from 'react';
import { FloorItem } from '@/src/schemas/floor-item.schema';
import { Radio, Flame, ShieldAlert, Cpu, CheckCircle2, Clock } from 'lucide-react';

interface Props {
  items: FloorItem[];
  currentZone: string;
  isEditable: boolean;
  onSelectItem?: (item: FloorItem) => void;
}

export default function EstadioBlueprint({ items, currentZone, isEditable, onSelectItem }: Props) {
  const [hoveredNode, setHoveredNode] = useState<FloorItem | null>(null);

  // Status badge styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inspected':
        return '#10B981'; // emerald-500
      case 'installed':
        return '#3B82F6'; // blue-500
      case 'pending':
      default:
        return '#EAA023'; // radar-amber
    }
  };

  return (
    <div className="relative w-full rounded-xl border border-industrial-800 bg-industrial-950/80 p-4 overflow-hidden shadow-industrial-md">
      {/* Blueprint Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-industrial-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="font-mono font-semibold uppercase text-industrial-300">
            Esquema Técnico Deportivo &middot; Estadio Metropolitano
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-radar-500/10 text-radar-500 font-mono border border-radar-500/20">
            {currentZone}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono text-industrial-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-radar-500"></span>
            <span>Planificado / En Esquema</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Instalado Físicamente</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Comisionado / Auditoría OK</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-x-auto bg-industrial-900/60 rounded-lg border border-industrial-800/80 p-2 flex justify-center bg-blueprint-radar">
        <svg
          viewBox="0 0 1000 650"
          className="w-full max-w-[950px] h-auto select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="stadiumGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1E2229" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#15181D" stopOpacity="0.95" />
            </radialGradient>
            <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2A303C" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
          </defs>

          {/* Grid background */}
          <rect width="1000" height="650" fill="url(#gridPattern)" />

          {/* Exterior Stadium Contour */}
          <ellipse
            cx="500"
            cy="325"
            rx="460"
            ry="290"
            fill="url(#stadiumGlow)"
            stroke="#2A303C"
            strokeWidth="3"
            strokeDasharray="6,4"
          />

          {/* Outer Ring & Stands Corridors */}
          <ellipse
            cx="500"
            cy="325"
            rx="400"
            ry="240"
            fill="#1E2229"
            stroke="#3D4556"
            strokeWidth="2"
          />

          {/* Stands Division Labels */}
          {/* Gradería Occidental (Top) */}
          <path
            d="M 180 180 Q 500 110 820 180 L 760 215 Q 500 155 240 215 Z"
            fill={currentZone.includes('Occidental') ? '#EAA023' : '#242932'}
            fillOpacity={currentZone.includes('Occidental') ? '0.3' : '0.6'}
            stroke="#EAA023"
            strokeWidth={currentZone.includes('Occidental') ? '2' : '1'}
          />
          <text x="500" y="165" fill="#EAA023" fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            TRIBUNA OCCIDENTAL &middot; PRENSA Y CABINAS VIP
          </text>

          {/* Gradería Oriental (Bottom) */}
          <path
            d="M 180 470 Q 500 540 820 470 L 760 435 Q 500 495 240 435 Z"
            fill={currentZone.includes('Oriental') ? '#EAA023' : '#242932'}
            fillOpacity={currentZone.includes('Oriental') ? '0.3' : '0.6'}
            stroke="#3D4556"
            strokeWidth="1"
          />
          <text x="500" y="520" fill="#CBD5E1" fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            TRIBUNA ORIENTAL &middot; ACCESOS GENERALES
          </text>

          {/* Gradería Norte (Left) */}
          <path
            d="M 140 250 Q 110 325 140 400 L 195 380 Q 170 325 195 270 Z"
            fill={currentZone.includes('Norte') ? '#EAA023' : '#242932'}
            fillOpacity={currentZone.includes('Norte') ? '0.3' : '0.6'}
            stroke="#3D4556"
            strokeWidth="1"
          />
          <text x="145" y="330" fill="#94A3B8" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle" transform="rotate(-90 145 330)">
            TRIBUNA NORTE
          </text>

          {/* Gradería Sur (Right) */}
          <path
            d="M 860 250 Q 890 325 860 400 L 805 380 Q 830 325 805 270 Z"
            fill={currentZone.includes('Sur') ? '#EAA023' : '#242932'}
            fillOpacity={currentZone.includes('Sur') ? '0.3' : '0.6'}
            stroke="#3D4556"
            strokeWidth="1"
          />
          <text x="855" y="330" fill="#94A3B8" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle" transform="rotate(90 855 330)">
            TRIBUNA SUR
          </text>

          {/* Athletic Track / Pista Atlética */}
          <ellipse
            cx="500"
            cy="325"
            rx="330"
            ry="190"
            fill="#2A201A"
            stroke="#8B3A1C"
            strokeWidth="1.5"
            strokeDasharray="4,2"
          />

          {/* Pitch Field / Césped */}
          <rect
            x="240"
            y="200"
            width="520"
            height="250"
            rx="8"
            fill="#122A1E"
            stroke="#2E7D32"
            strokeWidth="2"
          />

          {/* Pitch Lines */}
          {/* Perimeter line */}
          <rect x="250" y="210" width="500" height="230" fill="none" stroke="#4CAF50" strokeWidth="1.5" strokeOpacity="0.6" />
          {/* Halfway line */}
          <line x1="500" y1="210" x2="500" y2="440" stroke="#4CAF50" strokeWidth="1.5" strokeOpacity="0.6" />
          {/* Center circle */}
          <circle cx="500" cy="325" r="45" fill="none" stroke="#4CAF50" strokeWidth="1.5" strokeOpacity="0.6" />
          <circle cx="500" cy="325" r="2" fill="#4CAF50" strokeOpacity="0.8" />
          {/* Penalty Areas Left */}
          <rect x="250" y="260" width="60" height="130" fill="none" stroke="#4CAF50" strokeWidth="1.5" strokeOpacity="0.6" />
          <rect x="250" y="290" width="25" height="70" fill="none" stroke="#4CAF50" strokeWidth="1.5" strokeOpacity="0.6" />
          {/* Penalty Areas Right */}
          <rect x="690" y="260" width="60" height="130" fill="none" stroke="#4CAF50" strokeWidth="1.5" strokeOpacity="0.6" />
          <rect x="725" y="290" width="25" height="70" fill="none" stroke="#4CAF50" strokeWidth="1.5" strokeOpacity="0.6" />

          {/* Technical Zones / Facilities */}
          {/* Cuarto de Bombas y Subestación (Bottom Left) */}
          <rect
            x="60"
            y="520"
            width="170"
            height="90"
            rx="6"
            fill="#1E2229"
            stroke="#EAA023"
            strokeWidth={currentZone.includes('Bombas') ? '2' : '1'}
            strokeDasharray={currentZone.includes('Bombas') ? 'none' : '4,2'}
          />
          <text x="145" y="550" fill="#EAA023" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            CUARTO DE BOMBAS
          </text>
          <text x="145" y="568" fill="#94A3B8" fontSize="9" fontFamily="monospace" textAnchor="middle">
            RCI &amp; Subestación Técnica
          </text>

          {/* Sala Principal de Control y FACP (Top Right) */}
          <rect
            x="770"
            y="40"
            width="170"
            height="85"
            rx="6"
            fill="#1E2229"
            stroke="#3B82F6"
            strokeWidth="1.5"
          />
          <text x="855" y="70" fill="#60A5FA" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            SALA DE CONTROL FACP
          </text>
          <text x="855" y="88" fill="#94A3B8" fontSize="9" fontFamily="monospace" textAnchor="middle">
            Monitoreo Centralizado NFPA 72
          </text>

          {/* Conduit EMT Main Trunk Line (Perimeter conduit run in yellow) */}
          <path
            d="M 855 125 L 855 180 Q 500 130 180 190 L 145 520"
            fill="none"
            stroke="#EAA023"
            strokeWidth="2.5"
            strokeDasharray="6,4"
            opacity="0.85"
          />

          {/* Render dynamic Technical Nodes from Items */}
          {items.map((item, index) => {
            // Distribute points logically based on index and zone
            let cx = 500;
            let cy = 325;
            if (item.zone.includes('Occidental')) {
              cx = 320 + (index * 90) % 360;
              cy = 150 + (index % 2) * 25;
            } else if (item.zone.includes('Oriental')) {
              cx = 320 + (index * 90) % 360;
              cy = 490 + (index % 2) * 25;
            } else if (item.zone.includes('Norte')) {
              cx = 160;
              cy = 280 + (index * 40) % 100;
            } else if (item.zone.includes('Sur')) {
              cx = 830;
              cy = 280 + (index * 40) % 100;
            } else if (item.zone.includes('Bombas')) {
              cx = 110 + (index * 40) % 80;
              cy = 570;
            } else {
              // General distribution
              cx = 280 + (index * 110) % 440;
              cy = 170 + (index % 3) * 60;
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
                {/* Pulsing ring for pending or inspected nodes */}
                <circle cx={cx} cy={cy} r="14" fill={color} fillOpacity="0.2" className="animate-ping" />
                <circle cx={cx} cy={cy} r="9" fill="#15181D" stroke={color} strokeWidth="2.5" />
                <circle cx={cx} cy={cy} r="4" fill={color} />

                {/* Node Tag */}
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

        {/* Hovered node floating tooltip */}
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
            {hoveredNode.notes && (
              <p className="mt-2 text-[10px] text-industrial-400 italic border-t border-industrial-850 pt-1">
                "{hoveredNode.notes}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Blueprint Footer Bar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-industrial-400 pt-2 border-t border-industrial-800">
        <div>
          Total Elementos Ploteados: <span className="text-white font-bold">{items.length}</span>
        </div>
        <div className="flex items-center gap-2 text-radar-500">
          <span>Estándar NFPA 72 - Capítulos 14 & 17</span>
        </div>
      </div>
    </div>
  );
}
