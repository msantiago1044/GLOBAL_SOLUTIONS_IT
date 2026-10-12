'use client';

import React, { useState } from 'react';
import { FloorItem } from '@/src/schemas/floor-item.schema';
import { X, CheckCircle2, Clock, Wrench, ShieldCheck, Cable, GitBranch } from 'lucide-react';

interface Props {
  items: FloorItem[];
  currentZone: string;
  isEditable: boolean;
  selectedItemId?: string | null;
  onSelectItem?: (item: FloorItem) => void;
}

export default function EstadioBlueprint({
  items,
  currentZone,
  isEditable,
  selectedItemId,
  onSelectItem,
}: Props) {
  const [internalSelected, setInternalSelected] = useState<FloorItem | null>(null);
  const [hoveredNode, setHoveredNode] = useState<FloorItem | null>(null);

  // Synchronize externally selected item if prop provided
  const activeSelected = selectedItemId
    ? items.find((i) => i.code === selectedItemId || i.id === selectedItemId) || internalSelected
    : internalSelected;

  const handleSelect = (item: FloorItem) => {
    setInternalSelected(item);
    if (onSelectItem) {
      onSelectItem(item);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inspected':
        return '#10B981'; // emerald-500 (CONFORME)
      case 'installed':
        return '#0077B6'; // brand-primary blue (INSTALADO)
      case 'pending':
      default:
        return '#F59E0B'; // amber-500 (PLANIFICADO)
    }
  };

  const isAutonomous = (item: FloorItem) => {
    const text = `${item.name} ${item.type} ${item.notes || ''}`.toLowerCase();
    return text.includes('autónomo') && !text.includes('direccionable') && !text.includes('conduit');
  };

  // Find tubería and cable items in current scope for reference
  const mainTuberia = items.find((i) => i.type === 'tuberia' || i.code.includes('TUB')) || {
    code: 'EST-TUB-01',
    name: 'Tubería Conduit EMT 1" Galvanizada en Caliente',
    status: 'inspected',
  };

  const mainCable = items.find((i) => i.type === 'cableado' || i.code.includes('CAB')) || {
    code: 'EST-CAB-01',
    name: 'Cable FPLR 2x14 AWG Apantallado para Intemperie',
    status: 'inspected',
  };

  // Pre-calculated physical device positions on stadium map
  const getDeviceCoordinates = (item: FloorItem, index: number) => {
    const code = item.code.toUpperCase();
    if (code.includes('FACP')) {
      return { cx: 855, cy: 82, trunkX: 855, trunkY: 125, label: 'Sala de Control FACP' };
    }
    if (code.includes('BOM')) {
      return { cx: 145, cy: 565, trunkX: 145, trunkY: 520, label: 'Cuarto de Bombas' };
    }
    if (code.includes('DET')) {
      return { cx: 480, cy: 155, trunkX: 500, trunkY: 135, label: 'Tribuna Occidental - Gradería Alta' };
    }
    if (code.includes('PAL')) {
      return { cx: 320, cy: 180, trunkX: 340, trunkY: 155, label: 'Tribuna Occidental - Acceso Prensa' };
    }
    if (code.includes('SIR')) {
      return { cx: 650, cy: 175, trunkX: 630, trunkY: 150, label: 'Tribuna Occidental - Viga Cubierta' };
    }

    // Dynamic fallback placement according to zone
    if (item.zone.includes('Occidental')) {
      const cx = 360 + (index * 110) % 320;
      return { cx, cy: 170, trunkX: cx, trunkY: 145, label: 'Tribuna Occidental' };
    }
    if (item.zone.includes('Oriental')) {
      const cx = 360 + (index * 110) % 320;
      return { cx, cy: 490, trunkX: cx, trunkY: 510, label: 'Tribuna Oriental' };
    }
    if (item.zone.includes('Norte')) {
      return { cx: 160, cy: 300 + (index * 40) % 80, trunkX: 160, trunkY: 280, label: 'Tribuna Norte' };
    }
    if (item.zone.includes('Sur')) {
      return { cx: 835, cy: 300 + (index * 40) % 80, trunkX: 835, trunkY: 280, label: 'Tribuna Sur' };
    }
    if (item.zone.includes('Bombas')) {
      return { cx: 145, cy: 565, trunkX: 145, trunkY: 520, label: 'Cuarto de Bombas' };
    }
    return { cx: 500, cy: 160, trunkX: 500, trunkY: 135, label: 'Sector Deportivo General' };
  };

  // Only plot discrete equipment devices as nodes (tuberías & cables are the lines themselves)
  const discreteDevices = items.filter((i) => i.type !== 'tuberia' && i.type !== 'cableado');
  const activeDisplayNode = hoveredNode || activeSelected;

  return (
    <div className="relative w-full rounded-2xl border border-surface-border bg-white p-5 overflow-hidden shadow-sm">
      {/* Blueprint Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-surface-border text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="font-mono font-bold uppercase text-brand-deep">
            Esquema Técnico de Canalización &middot; Estadio Metropolitano
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-ice text-brand-deep font-mono font-bold border border-brand-light">
            {currentZone}
          </span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-gsitText-secondary">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-1.5 rounded-full bg-cyan-400"></span>
            <span>Tubería Conduit EMT</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Conforme / Aprobado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-primary"></span>
            <span>Instalado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Planificado</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full overflow-x-auto bg-slate-950 rounded-xl border border-slate-800 p-3 flex justify-center shadow-inner">
        <svg
          viewBox="0 0 1000 650"
          className="w-full max-w-[950px] h-auto select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="stadiumGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#090d16" stopOpacity="0.95" />
            </radialGradient>
            <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.6" />
            </pattern>
            {/* Filter for glowing selected items */}
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <rect width="1000" height="650" fill="url(#gridPattern)" />

          {/* Exterior Stadium Contour */}
          <ellipse
            cx="500"
            cy="325"
            rx="460"
            ry="290"
            fill="url(#stadiumGlow)"
            stroke="#334155"
            strokeWidth="2.5"
            strokeDasharray="6,4"
          />

          {/* Outer Ring & Stands Corridors */}
          <ellipse
            cx="500"
            cy="325"
            rx="400"
            ry="240"
            fill="#0f172a"
            stroke="#475569"
            strokeWidth="1.5"
          />

          {/* Tribuna Occidental (Top) */}
          <path
            d="M 180 180 Q 500 110 820 180 L 760 215 Q 500 155 240 215 Z"
            fill={currentZone.includes('Occidental') ? '#0284c7' : '#1e293b'}
            fillOpacity={currentZone.includes('Occidental') ? '0.35' : '0.6'}
            stroke="#0ea5e9"
            strokeWidth={currentZone.includes('Occidental') ? '2' : '1'}
          />
          <text x="500" y="165" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            TRIBUNA OCCIDENTAL &middot; CABINAS VIP &amp; PRENSA
          </text>

          {/* Tribuna Oriental (Bottom) */}
          <path
            d="M 180 470 Q 500 540 820 470 L 760 435 Q 500 495 240 435 Z"
            fill={currentZone.includes('Oriental') ? '#0284c7' : '#1e293b'}
            fillOpacity={currentZone.includes('Oriental') ? '0.35' : '0.6'}
            stroke="#475569"
            strokeWidth="1"
          />
          <text x="500" y="520" fill="#94a3b8" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            TRIBUNA ORIENTAL &middot; ACCESOS GENERALES
          </text>

          {/* Tribuna Norte (Left) */}
          <path
            d="M 140 250 Q 110 325 140 400 L 195 380 Q 170 325 195 270 Z"
            fill={currentZone.includes('Norte') ? '#0284c7' : '#1e293b'}
            fillOpacity={currentZone.includes('Norte') ? '0.35' : '0.6'}
            stroke="#475569"
            strokeWidth="1"
          />
          <text x="145" y="330" fill="#64748b" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle" transform="rotate(-90 145 330)">
            TRIBUNA NORTE
          </text>

          {/* Tribuna Sur (Right) */}
          <path
            d="M 860 250 Q 890 325 860 400 L 805 380 Q 830 325 805 270 Z"
            fill={currentZone.includes('Sur') ? '#0284c7' : '#1e293b'}
            fillOpacity={currentZone.includes('Sur') ? '0.35' : '0.6'}
            stroke="#475569"
            strokeWidth="1"
          />
          <text x="855" y="330" fill="#64748b" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle" transform="rotate(90 855 330)">
            TRIBUNA SUR
          </text>

          {/* Athletic Track / Pista Atlética */}
          <ellipse
            cx="500"
            cy="325"
            rx="330"
            ry="190"
            fill="#2c1511"
            stroke="#7c2d12"
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
          <rect x="250" y="210" width="500" height="230" fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.5" />
          <line x1="500" y1="210" x2="500" y2="440" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.5" />
          <circle cx="500" cy="325" r="45" fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.5" />

          {/* Sala Principal de Control y FACP */}
          <rect
            x="770"
            y="40"
            width="170"
            height="85"
            rx="6"
            fill="#0f172a"
            stroke="#0284c7"
            strokeWidth="2"
          />
          <text x="855" y="65" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            SALA DE CONTROL FACP
          </text>
          <text x="855" y="80" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
            Monitoreo Centralizado NFPA 72
          </text>

          {/* Cuarto de Bombas y Subestación */}
          <rect
            x="60"
            y="520"
            width="170"
            height="90"
            rx="6"
            fill="#0f172a"
            stroke="#0284c7"
            strokeWidth={currentZone.includes('Bombas') ? '2' : '1.5'}
          />
          <text x="145" y="545" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            CUARTO DE BOMBAS RCI
          </text>
          <text x="145" y="560" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
            Subestación Técnica Red Contra Incendio
          </text>

          {/* ============================================================ */}
          {/* RED DE TUBERÍA CONDUIT EMT (VISIBLE & ACCESSIBLE)           */}
          {/* ============================================================ */}

          {/* Main Trunk Line: Sala de Control -> Tribuna Occidental -> Tribuna Norte -> Bombas */}
          <g
            className="cursor-pointer"
            onClick={() => {
              const tubItem = items.find((i) => i.code === 'EST-TUB-01') || items.find((i) => i.type === 'tuberia');
              if (tubItem) handleSelect(tubItem);
            }}
          >
            {/* Conduit Pipe Glow on hover/select */}
            <path
              d="M 855 125 L 855 175 Q 500 120 180 185 L 145 520"
              fill="none"
              stroke="#00b4d8"
              strokeWidth="6"
              strokeOpacity={activeSelected?.type === 'tuberia' ? '0.6' : '0.2'}
              strokeLinecap="round"
            />
            {/* Conduit Rigid Pipe Outer Body */}
            <path
              d="M 855 125 L 855 175 Q 500 120 180 185 L 145 520"
              fill="none"
              stroke="#00b4d8"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Cableado FPLR / Lazo SLC Centerline traveling inside Conduit */}
            <path
              d="M 855 125 L 855 175 Q 500 120 180 185 L 145 520"
              fill="none"
              stroke="#f8fafc"
              strokeWidth="1.2"
              strokeDasharray="5,4"
              opacity="0.9"
            />
          </g>

          {/* Secondary Conduit Loop to Tribuna Oriental */}
          <path
            d="M 180 185 Q 110 325 180 465 Q 500 535 820 465 L 855 175"
            fill="none"
            stroke="#00b4d8"
            strokeWidth="2.5"
            strokeDasharray="6,4"
            opacity="0.75"
          />

          {/* Conduit Cajas de Paso Condulet / Junction Boxes at key bends */}
          {[
            { x: 855, y: 175 },
            { x: 500, y: 135 },
            { x: 340, y: 155 },
            { x: 180, y: 185 },
            { x: 145, y: 350 },
            { x: 145, y: 520 },
          ].map((box, i) => (
            <rect
              key={i}
              x={box.x - 5}
              y={box.y - 5}
              width="10"
              height="10"
              rx="1.5"
              fill="#0f172a"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />
          ))}

          {/* Text labels on the physical conduit path */}
          <text
            x="500"
            y="126"
            fill="#38bdf8"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
          >
            TUBERÍA CONDUIT EMT 1" TRONCAL (EST-TUB-01)
          </text>
          <text
            x="120"
            y="435"
            fill="#38bdf8"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
            transform="rotate(-90 120 435)"
          >
            TUBERÍA CONDUIT EMT 3/4" A BOMBAS
          </text>

          {/* ============================================================ */}
          {/* BRANCH CONDUIT PIPES & CABLES CONNECTING EACH EQUIPMENT     */}
          {/* ============================================================ */}
          {discreteDevices.map((item, index) => {
            const coords = getDeviceCoordinates(item, index);
            const autonomous = isAutonomous(item);
            const isSelected = activeSelected?.id === item.id || activeSelected?.code === item.code;

            // If not autonomous, render the physical pipe branch connecting device to conduit trunk
            return (
              <g key={`branch-${item.id}`}>
                {!autonomous && (
                  <g>
                    {/* Branch Pipe from Trunk to Device */}
                    <line
                      x1={coords.trunkX}
                      y1={coords.trunkY}
                      x2={coords.cx}
                      y2={coords.cy}
                      stroke={isSelected ? '#38bdf8' : '#00b4d8'}
                      strokeWidth={isSelected ? '3' : '2'}
                      strokeLinecap="round"
                    />
                    {/* Cable inside the branch pipe */}
                    <line
                      x1={coords.trunkX}
                      y1={coords.trunkY}
                      x2={coords.cx}
                      y2={coords.cy}
                      stroke="#f1f5f9"
                      strokeWidth="0.8"
                      strokeDasharray="3,2"
                    />
                    {/* Condulet fitting at equipment inlet */}
                    <circle cx={coords.trunkX} cy={coords.trunkY} r="3" fill="#38bdf8" />
                  </g>
                )}
              </g>
            );
          })}

          {/* ============================================================ */}
          {/* DISCRETE TECHNICAL NODES (EQUIPMENT) - JITTER-FREE INTERACTION */}
          {/* ============================================================ */}
          {discreteDevices.map((item, index) => {
            const coords = getDeviceCoordinates(item, index);
            const color = getStatusColor(item.status);
            const isSelected = activeSelected?.id === item.id || activeSelected?.code === item.code;
            const isHovered = hoveredNode?.id === item.id;
            const autonomous = isAutonomous(item);

            return (
              <g
                key={item.id}
                className="cursor-pointer"
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setHoveredNode(item)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Steady non-jittering hover/selection aura */}
                {(isSelected || isHovered) && (
                  <circle
                    cx={coords.cx}
                    cy={coords.cy}
                    r="18"
                    fill={color}
                    fillOpacity="0.25"
                    stroke={color}
                    strokeWidth="1.5"
                  />
                )}

                {/* Main Node Housing */}
                <circle
                  cx={coords.cx}
                  cy={coords.cy}
                  r="9.5"
                  fill="#090d16"
                  stroke={isSelected ? '#ffffff' : color}
                  strokeWidth={isSelected ? '2.5' : '2'}
                />

                {/* Status Dot / Checkmark */}
                <circle cx={coords.cx} cy={coords.cy} r="4" fill={color} />

                {item.status === 'inspected' && (
                  <text
                    x={coords.cx}
                    y={coords.cy + 2.5}
                    fill="#ffffff"
                    fontSize="7"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    ✓
                  </text>
                )}

                {/* Tag Badge */}
                <rect
                  x={coords.cx - 26}
                  y={coords.cy - 24}
                  width="52"
                  height="13"
                  rx="3"
                  fill="#090d16"
                  fillOpacity="0.95"
                  stroke={isSelected ? '#38bdf8' : '#334155'}
                  strokeWidth={isSelected ? '1.2' : '0.8'}
                />
                <text
                  x={coords.cx}
                  y={coords.cy - 14.5}
                  fill={isSelected ? '#38bdf8' : '#f1f5f9'}
                  fontSize="7.5"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {item.code}
                </text>

                {/* Autonomous indicator icon if applicable */}
                {autonomous && (
                  <circle cx={coords.cx + 8} cy={coords.cy + 8} r="3" fill="#a855f7" />
                )}
              </g>
            );
          })}
        </svg>

        {/* ============================================================ */}
        {/* PINNED TECHNICAL DETAIL CARD                                */}
        {/* ============================================================ */}
        {activeDisplayNode && (
          <div className="absolute bottom-4 left-4 z-20 max-w-sm w-full rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md text-white animate-in fade-in duration-150">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5 mb-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-sky-400">
                    {activeDisplayNode.code}
                  </span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase border ${
                      activeDisplayNode.status === 'inspected'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : activeDisplayNode.status === 'installed'
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    }`}
                  >
                    {activeDisplayNode.status === 'inspected'
                      ? 'Conforme / Aprobado'
                      : activeDisplayNode.status === 'installed'
                      ? 'Instalado en Obra'
                      : 'Planificado'}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-white mt-1 leading-snug">
                  {activeDisplayNode.name}
                </h5>
              </div>

              {internalSelected && (
                <button
                  onClick={() => setInternalSelected(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Cerrar ficha"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Technical Specifications */}
            <div className="space-y-2 text-[11px] font-mono text-slate-300">
              <div className="flex items-center justify-between text-slate-400">
                <span>Modelo:</span>
                <span className="text-slate-200 font-bold">{activeDisplayNode.model}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Ubicación:</span>
                <span className="text-slate-200">{activeDisplayNode.zone}</span>
              </div>

              {/* Infrastructure connections: Tubería & Cable */}
              <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 mt-2">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Wrench className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[10px] leading-tight">
                    {activeDisplayNode.type === 'tuberia'
                      ? 'Canalización Troncal Conduit EMT 1" (Anclaje antisísmico)'
                      : isAutonomous(activeDisplayNode)
                      ? 'Equipo Autónomo (Batería interna litio - Sin tubería externa)'
                      : `Conectado a ${mainTuberia.code} — Tubería Conduit EMT`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sky-300">
                  <Cable className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[10px] leading-tight">
                    {activeDisplayNode.type === 'cableado'
                      ? 'Lazo SLC Clase B Cable FPLR 2x14 AWG Certificado'
                      : isAutonomous(activeDisplayNode)
                      ? 'Comunicación autónoma / inalámbrica'
                      : `Alimentado por ${mainCable.code} (Lazo SLC / Potencia)`}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-slate-400">
                <span>Cantidad:</span>
                <span className="text-white font-bold">
                  {activeDisplayNode.quantity} {activeDisplayNode.unit} &bull; ${(activeDisplayNode.quantity * activeDisplayNode.unitPrice).toLocaleString('es-CO')}
                </span>
              </div>

              {activeDisplayNode.notes && (
                <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800">
                  "{activeDisplayNode.notes}"
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Blueprint Footer Bar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-gsitText-secondary pt-2 border-t border-surface-border">
        <div className="flex items-center gap-3">
          <span>
            Elementos Técnicos: <strong className="text-brand-deep">{items.length}</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-600 font-bold">
            Conformes: {items.filter((i) => i.status === 'inspected').length}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-blue-600 font-bold">
            Instalados: {items.filter((i) => i.status === 'installed').length}
          </span>
        </div>

        <div className="flex items-center gap-2 text-brand-primary font-bold">
          <GitBranch className="w-3.5 h-3.5" />
          <span>Red Conduit EMT &bull; NFPA 72</span>
        </div>
      </div>
    </div>
  );
}
