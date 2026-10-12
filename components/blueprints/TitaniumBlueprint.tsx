'use client';

import React, { useState } from 'react';
import { FloorItem } from '@/src/schemas/floor-item.schema';
import { X, Wrench, Cable, GitBranch } from 'lucide-react';

interface Props {
  items: FloorItem[];
  currentFloorName: string;
  isEditable: boolean;
  selectedItemId?: string | null;
  onSelectItem?: (item: FloorItem) => void;
}

export default function TitaniumBlueprint({
  items,
  currentFloorName,
  isEditable,
  selectedItemId,
  onSelectItem,
}: Props) {
  const [internalSelected, setInternalSelected] = useState<FloorItem | null>(null);
  const [hoveredNode, setHoveredNode] = useState<FloorItem | null>(null);

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

  const mainTuberia = items.find((i) => i.type === 'tuberia' || i.code.includes('TUB')) || {
    code: 'TUB-EMT-34',
    name: 'Tubería Metálica Eléctrica Conduit EMT 3/4"',
    status: 'inspected',
  };

  const mainCable = items.find((i) => i.type === 'cableado' || i.code.includes('CAB')) || {
    code: 'CAB-FPLR-214',
    name: 'Cable FPLR Blindado 2x14 AWG Rojo Certificado UL',
    status: 'inspected',
  };

  const getDeviceCoordinates = (item: FloorItem, index: number) => {
    const code = item.code.toUpperCase();
    if (code.includes('FACP')) {
      return { cx: 230, cy: 375, trunkX: 230, trunkY: 340, label: 'Lobby Principal / Cuarto FACP' };
    }
    if (code.includes('DET')) {
      return { cx: 770, cy: 230, trunkX: 770, trunkY: 180, label: 'Ala Oriente - Oficinas' };
    }
    if (code.includes('PAL')) {
      return { cx: 420, cy: 365, trunkX: 420, trunkY: 320, label: 'Núcleo Central - Escalera NFPA' };
    }
    if (code.includes('SIR')) {
      return { cx: 500, cy: 115, trunkX: 500, trunkY: 115, label: 'Ala Norte - Pasillo Central' };
    }

    // Dynamic placement
    if (index % 3 === 0) {
      const cx = 200 + (index * 40) % 150;
      return { cx, cy: 290 + (index * 35) % 150, trunkX: 230, trunkY: 340, label: 'Ala Occidente - Telecomunicaciones' };
    }
    if (index % 3 === 1) {
      const cx = 700 + (index * 40) % 150;
      return { cx, cy: 260 + (index * 35) % 180, trunkX: 770, trunkY: 180, label: 'Ala Oriente - Coworking' };
    }
    const cx = 350 + (index * 110) % 300;
    return { cx, cy: 115, trunkX: cx, trunkY: 115, label: 'Ala Norte - Salas Técnicas' };
  };

  const discreteDevices = items.filter((i) => i.type !== 'tuberia' && i.type !== 'cableado');
  const activeDisplayNode = hoveredNode || activeSelected;

  return (
    <div className="relative w-full rounded-2xl border border-surface-border bg-white p-5 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-surface-border text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse"></div>
          <span className="font-mono font-bold uppercase text-brand-deep">
            Plano Arquitectónico y Red Conduit &middot; Torre Titanium Plaza
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-ice text-brand-deep font-mono font-bold border border-brand-light">
            {currentFloorName}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-gsitText-secondary">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-1.5 rounded-full bg-cyan-400"></span>
            <span>Tubería Conduit EMT</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Conforme</span>
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

      {/* SVG Canvas */}
      <div className="relative w-full overflow-x-auto bg-slate-950 rounded-xl border border-slate-800 p-3 flex justify-center shadow-inner">
        <svg
          viewBox="0 0 1000 600"
          className="w-full max-w-[950px] h-auto select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="gridTitanium" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.6" />
            </pattern>
          </defs>

          <rect width="1000" height="600" fill="url(#gridTitanium)" />

          {/* Building Outer Perimeter */}
          <rect x="50" y="50" width="900" height="500" rx="6" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />

          {/* Central Core / Elevator Shafts & Stairs */}
          <rect x="400" y="180" width="200" height="240" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
          <text x="500" y="210" fill="#94a3b8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            NÚCLEO CENTRAL &middot; DUCTO RISER
          </text>
          {/* Elevator Cabins */}
          <rect x="420" y="225" width="70" height="80" fill="#0f172a" stroke="#475569" strokeWidth="1" />
          <text x="455" y="270" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">ELEV 1</text>
          <rect x="510" y="225" width="70" height="80" fill="#0f172a" stroke="#475569" strokeWidth="1" />
          <text x="545" y="270" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">ELEV 2</text>

          {/* Emergency Stairs */}
          <rect x="420" y="325" width="160" height="80" fill="#0f172a" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,2" />
          <text x="500" y="368" fill="#ef4444" fontSize="9" fontFamily="monospace" textAnchor="middle">
            ESCALERA EMERGENCIA NFPA
          </text>

          {/* Office Wings */}
          {/* North Wing */}
          <rect x="80" y="70" width="840" height="90" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <text x="500" y="100" fill="#e2e8f0" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            ALA NORTE &middot; SALAS DE REUNIONES &amp; AUDITORIO
          </text>

          {/* West Wing / Datacenter */}
          <rect x="80" y="180" width="300" height="340" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <text x="230" y="210" fill="#e2e8f0" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            ALA OCCIDENTE &middot; DATACENTER &amp; NOC
          </text>
          <rect x="110" y="250" width="240" height="240" fill="#0f172a" stroke="#0077b6" strokeWidth="1" strokeDasharray="4,2" />
          <text x="230" y="375" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle">
            CUARTO TÉCNICO TELECOMUNICACIONES
          </text>

          {/* East Wing / Open Office */}
          <rect x="620" y="180" width="300" height="340" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <text x="770" y="210" fill="#e2e8f0" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            ALA ORIENTE &middot; OPEN OFFICE &amp; COWORKING
          </text>

          {/* ============================================================ */}
          {/* RED DE TUBERÍA CONDUIT EMT (TRONCAL & ANILLO DISTRIBUCIÓN) */}
          {/* ============================================================ */}
          <g
            className="cursor-pointer"
            onClick={() => {
              const tubItem = items.find((i) => i.type === 'tuberia');
              if (tubItem) handleSelect(tubItem);
            }}
          >
            {/* Outer Conduit Body */}
            <path
              d="M 230 400 L 230 115 L 770 115 L 770 400"
              fill="none"
              stroke="#00b4d8"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Cableado FPLR Centerline */}
            <path
              d="M 230 400 L 230 115 L 770 115 L 770 400"
              fill="none"
              stroke="#f8fafc"
              strokeWidth="1.2"
              strokeDasharray="5,3"
            />
          </g>

          {/* Conduit Cajas de Paso en quiebres */}
          {[
            { x: 230, y: 400 },
            { x: 230, y: 115 },
            { x: 500, y: 115 },
            { x: 770, y: 115 },
            { x: 770, y: 400 },
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

          <text x="500" y="132" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            TUBERÍA CONDUIT EMT 3/4" - DISTRIBUCIÓN PERIMETRAL
          </text>

          {/* ============================================================ */}
          {/* DERIVACIONES DE TUBERÍA CONECTANDO EQUIPOS                   */}
          {/* ============================================================ */}
          {discreteDevices.map((item, index) => {
            const coords = getDeviceCoordinates(item, index);
            const autonomous = isAutonomous(item);
            const isSelected = activeSelected?.id === item.id || activeSelected?.code === item.code;

            return (
              <g key={`branch-ti-${item.id}`}>
                {!autonomous && (
                  <g>
                    <line
                      x1={coords.trunkX}
                      y1={coords.trunkY}
                      x2={coords.cx}
                      y2={coords.cy}
                      stroke={isSelected ? '#38bdf8' : '#00b4d8'}
                      strokeWidth={isSelected ? '2.5' : '1.8'}
                      strokeLinecap="round"
                    />
                    <circle cx={coords.trunkX} cy={coords.trunkY} r="2.5" fill="#38bdf8" />
                  </g>
                )}
              </g>
            );
          })}

          {/* ============================================================ */}
          {/* NODOS DE EQUIPOS TÉCNICOS (SIN TEMBLOR / JITTER-FREE)         */}
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

                <circle
                  cx={coords.cx}
                  cy={coords.cy}
                  r="9.5"
                  fill="#090d16"
                  stroke={isSelected ? '#ffffff' : color}
                  strokeWidth={isSelected ? '2.5' : '2'}
                />

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

                {autonomous && (
                  <circle cx={coords.cx + 8} cy={coords.cy + 8} r="3" fill="#a855f7" />
                )}
              </g>
            );
          })}
        </svg>

        {/* Technical Detail Card */}
        {activeDisplayNode && (
          <div className="absolute bottom-4 left-4 z-20 max-w-sm w-full rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md text-white animate-in fade-in duration-150">
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

            <div className="space-y-2 text-[11px] font-mono text-slate-300">
              <div className="flex items-center justify-between text-slate-400">
                <span>Modelo:</span>
                <span className="text-slate-200 font-bold">{activeDisplayNode.model}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Ubicación:</span>
                <span className="text-slate-200">{activeDisplayNode.zone}</span>
              </div>

              <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 mt-2">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Wrench className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[10px] leading-tight">
                    {activeDisplayNode.type === 'tuberia'
                      ? 'Tubería Conduit EMT (Ducto vertical y distribución)'
                      : isAutonomous(activeDisplayNode)
                      ? 'Equipo Autónomo (Batería interna litio - Sin tubería externa)'
                      : `Conectado a ${mainTuberia.code} — Conduit EMT`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sky-300">
                  <Cable className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[10px] leading-tight">
                    {activeDisplayNode.type === 'cableado'
                      ? 'Cable FPLR Blindado 2x14 AWG (Lazo SLC Clase A)'
                      : isAutonomous(activeDisplayNode)
                      ? 'Comunicación local autónoma'
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
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-gsitText-secondary pt-2 border-t border-surface-border">
        <div>
          Total Elementos Ploteados: <strong className="text-brand-deep font-bold">{items.length}</strong>
        </div>
        <div className="flex items-center gap-2 text-brand-primary font-bold">
          <GitBranch className="w-3.5 h-3.5" />
          <span>Lazo SLC Clase A &bull; NFPA 72</span>
        </div>
      </div>
    </div>
  );
}
