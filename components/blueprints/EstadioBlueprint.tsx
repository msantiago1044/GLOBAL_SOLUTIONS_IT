'use client';

import React, { useState } from 'react';
import { FloorItem } from '@/src/schemas/floor-item.schema';

interface Props {
  items: FloorItem[];
  currentZone: string;
  isEditable: boolean;
  onSelectItem?: (item: FloorItem) => void;
}

export default function EstadioBlueprint({ items, currentZone, isEditable, onSelectItem }: Props) {
  const [hoveredNode, setHoveredNode] = useState<FloorItem | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inspected':
        return '#10B981'; // emerald-500
      case 'installed':
        return '#0077B6'; // brand-primary blue
      case 'pending':
      default:
        return '#F59E0B'; // amber-500
    }
  };

  return (
    <div className="relative w-full rounded-2xl border border-surface-border bg-white p-5 overflow-hidden shadow-sm">
      {/* Blueprint Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-surface-border text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="font-mono font-bold uppercase text-brand-deep">
            Esquema Técnico Deportivo &middot; Estadio Metropolitano
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-ice text-brand-deep font-mono font-bold border border-brand-light">
            {currentZone}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono text-gsitText-secondary">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Planificado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-primary"></span>
            <span>Instalado en Obra</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Comisionado / Aprobado</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-x-auto bg-slate-900 rounded-xl border border-slate-800 p-3 flex justify-center shadow-inner">
        <svg
          viewBox="0 0 1000 650"
          className="w-full max-w-[950px] h-auto select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="stadiumGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
            </radialGradient>
            <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
          </defs>

          <rect width="1000" height="650" fill="url(#gridPattern)" />

          {/* Exterior Stadium Contour */}
          <ellipse
            cx="500"
            cy="325"
            rx="460"
            ry="290"
            fill="url(#stadiumGlow)"
            stroke="#475569"
            strokeWidth="3"
            strokeDasharray="6,4"
          />

          {/* Outer Ring & Stands Corridors */}
          <ellipse
            cx="500"
            cy="325"
            rx="400"
            ry="240"
            fill="#1e293b"
            stroke="#64748b"
            strokeWidth="2"
          />

          {/* Tribuna Occidental (Top) */}
          <path
            d="M 180 180 Q 500 110 820 180 L 760 215 Q 500 155 240 215 Z"
            fill={currentZone.includes('Occidental') ? '#0077B6' : '#334155'}
            fillOpacity={currentZone.includes('Occidental') ? '0.4' : '0.6'}
            stroke="#00b4d8"
            strokeWidth={currentZone.includes('Occidental') ? '2' : '1'}
          />
          <text x="500" y="165" fill="#38bdf8" fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            TRIBUNA OCCIDENTAL &middot; PRENSA Y CABINAS VIP
          </text>

          {/* Tribuna Oriental (Bottom) */}
          <path
            d="M 180 470 Q 500 540 820 470 L 760 435 Q 500 495 240 435 Z"
            fill={currentZone.includes('Oriental') ? '#0077B6' : '#334155'}
            fillOpacity={currentZone.includes('Oriental') ? '0.4' : '0.6'}
            stroke="#64748b"
            strokeWidth="1"
          />
          <text x="500" y="520" fill="#cbd5e1" fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            TRIBUNA ORIENTAL &middot; ACCESOS GENERALES
          </text>

          {/* Tribuna Norte (Left) */}
          <path
            d="M 140 250 Q 110 325 140 400 L 195 380 Q 170 325 195 270 Z"
            fill={currentZone.includes('Norte') ? '#0077B6' : '#334155'}
            fillOpacity={currentZone.includes('Norte') ? '0.4' : '0.6'}
            stroke="#64748b"
            strokeWidth="1"
          />
          <text x="145" y="330" fill="#94a3b8" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle" transform="rotate(-90 145 330)">
            TRIBUNA NORTE
          </text>

          {/* Tribuna Sur (Right) */}
          <path
            d="M 860 250 Q 890 325 860 400 L 805 380 Q 830 325 805 270 Z"
            fill={currentZone.includes('Sur') ? '#0077B6' : '#334155'}
            fillOpacity={currentZone.includes('Sur') ? '0.4' : '0.6'}
            stroke="#64748b"
            strokeWidth="1"
          />
          <text x="855" y="330" fill="#94a3b8" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle" transform="rotate(90 855 330)">
            TRIBUNA SUR
          </text>

          {/* Athletic Track / Pista Atlética */}
          <ellipse
            cx="500"
            cy="325"
            rx="330"
            ry="190"
            fill="#3f1d16"
            stroke="#9a3412"
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
            fill="#064e3b"
            stroke="#059669"
            strokeWidth="2"
          />

          {/* Pitch Lines */}
          <rect x="250" y="210" width="500" height="230" fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.6" />
          <line x1="500" y1="210" x2="500" y2="440" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.6" />
          <circle cx="500" cy="325" r="45" fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.6" />
          <circle cx="500" cy="325" r="2" fill="#10b981" strokeOpacity="0.8" />
          <rect x="250" y="260" width="60" height="130" fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.6" />
          <rect x="250" y="290" width="25" height="70" fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.6" />
          <rect x="690" y="260" width="60" height="130" fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.6" />
          <rect x="725" y="290" width="25" height="70" fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.6" />

          {/* Cuarto de Bombas y Subestación */}
          <rect
            x="60"
            y="520"
            width="170"
            height="90"
            rx="6"
            fill="#1e293b"
            stroke="#00b4d8"
            strokeWidth={currentZone.includes('Bombas') ? '2' : '1'}
          />
          <text x="145" y="550" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            CUARTO DE BOMBAS
          </text>
          <text x="145" y="568" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
            RCI &amp; Subestación Técnica
          </text>

          {/* Sala Principal de Control y FACP */}
          <rect
            x="770"
            y="40"
            width="170"
            height="85"
            rx="6"
            fill="#1e293b"
            stroke="#0077b6"
            strokeWidth="1.5"
          />
          <text x="855" y="70" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            SALA DE CONTROL FACP
          </text>
          <text x="855" y="88" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
            Monitoreo Centralizado NFPA 72
          </text>

          {/* Conduit EMT Main Trunk Line */}
          <path
            d="M 855 125 L 855 180 Q 500 130 180 190 L 145 520"
            fill="none"
            stroke="#00b4d8"
            strokeWidth="2.5"
            strokeDasharray="6,4"
            opacity="0.85"
          />

          {/* Render dynamic Technical Nodes */}
          {items.map((item, index) => {
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
                <circle cx={cx} cy={cy} r="14" fill={color} fillOpacity="0.2" className="animate-ping" />
                <circle cx={cx} cy={cy} r="9" fill="#0f172a" stroke={color} strokeWidth="2.5" />
                <circle cx={cx} cy={cy} r="4" fill={color} />

                {/* Node Tag */}
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

        {/* Hovered node floating tooltip */}
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
            {hoveredNode.notes && (
              <p className="mt-2 text-[10px] text-slate-400 italic border-t border-slate-800 pt-1">
                "{hoveredNode.notes}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Blueprint Footer Bar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-gsitText-secondary pt-2 border-t border-surface-border">
        <div>
          Total Elementos Ploteados: <strong className="text-brand-deep font-bold">{items.length}</strong>
        </div>
        <div className="flex items-center gap-2 text-brand-primary font-bold">
          <span>Global Solutions IT &middot; Estándar NFPA 72</span>
        </div>
      </div>
    </div>
  );
}
