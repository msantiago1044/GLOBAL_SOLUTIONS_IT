'use client';

import React, { useState } from 'react';
import { FloorItem } from '@/src/schemas/floor-item.schema';
import { X, Wrench, Cable, GitBranch, BatteryCharging, ShieldAlert } from 'lucide-react';

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
  const [showTramoPrompt, setShowTramoPrompt] = useState(false);

  const activeSelected = selectedItemId
    ? items.find((i) => i.code === selectedItemId || i.id === selectedItemId) || internalSelected
    : internalSelected;

  const handleSelect = (item: FloorItem) => {
    setInternalSelected(item);
    setShowTramoPrompt(false);
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
    const text = `${item.code} ${item.name} ${item.type} ${item.notes || ''}`.toLowerCase();
    return text.includes('aut-') || (text.includes('autónomo') && !text.includes('direccionable'));
  };

  // Find the tubería and cable of the active zone
  const currentTuberia =
    items.find((i) => i.type === 'tuberia') || {
      id: 'default-tub',
      projectId: 'estadio-metropolitano',
      code: 'EST-TUB-01',
      type: 'tuberia' as const,
      name: 'Tubería Conduit EMT 1" Galvanizada en Caliente',
      model: 'Conduit EMT 1 pulg Heavy Duty C-80',
      zone: currentZone,
      status: 'pending' as const,
      quantity: 380,
      unit: 'Metros Lineales',
      unitPrice: 46000,
      notes: '',
    };

  const currentCable =
    items.find((i) => i.type === 'cableado') || {
      id: 'default-cab',
      projectId: 'estadio-metropolitano',
      code: 'EST-CAB-01',
      type: 'cableado' as const,
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Dirección FACP',
      model: 'Honeywell Genesis UV-Resistant FPLR',
      zone: currentZone,
      status: 'pending' as const,
      quantity: 750,
      unit: 'Metros',
      unitPrice: 14500,
      notes: '',
    };

  // Central System FACP
  const centralFacp = items.find((i) => i.code.includes('FACP') || i.type === 'facp') || {
    id: 'em-facp-default',
    projectId: 'estadio-metropolitano',
    code: 'EST-FACP-01',
    type: 'facp' as const,
    name: 'Panel Principal de Alarma & Control Central FACP',
    model: 'Notifier NFS2-3030 / Red Noti-Fire-Net',
    zone: 'Sala de Control FACP',
    status: 'pending' as const,
    quantity: 1,
    unit: 'Unidad',
    unitPrice: 34500000,
    notes: '',
  };

  // Physical coordinates for the 3 active zones
  const getCoordinatesForZone = (item: FloorItem, index: number) => {
    const code = item.code.toUpperCase();
    const isZ2 = currentZone.includes('Oriental') || currentZone.includes('Zona 2');
    const isZ3 = currentZone.includes('Norte') || currentZone.includes('Zona 3');
    const isZ4 = currentZone.includes('Sur') || currentZone.includes('Zona 4');

    // Central FACP always in Control Room
    if (code.includes('FACP')) {
      return { cx: 855, cy: 82, trunkX: 855, trunkY: 125, label: 'Sala de Control FACP (Sistema Central)' };
    }
    // Cuarto de Bombas
    if (code.includes('BOM')) {
      return { cx: 145, cy: 565, trunkX: 145, trunkY: 520, label: 'Cuarto de Bombas RCI' };
    }

    if (isZ4) {
      // ZONA 4: Gradería Sur (Tribuna Derecha)
      if (code.includes('PAL-01')) return { cx: 855, cy: 250, trunkX: 855, trunkY: 250, label: 'Zona 4 &middot; Estación Manual 1' };
      if (code.includes('SEN-01')) return { cx: 850, cy: 290, trunkX: 855, trunkY: 290, label: 'Zona 4 &middot; Sensor Óptico 1' };
      if (code.includes('SEN-02')) return { cx: 865, cy: 330, trunkX: 865, trunkY: 330, label: 'Zona 4 &middot; Sensor Térmico 2' };
      if (code.includes('SEN-03')) return { cx: 850, cy: 370, trunkX: 855, trunkY: 370, label: 'Zona 4 &middot; Sensor 3' };
      if (code.includes('SIR-01')) return { cx: 820, cy: 270, trunkX: 855, trunkY: 270, label: 'Zona 4 &middot; Sirena 1' };
      if (code.includes('PAL-02')) return { cx: 820, cy: 350, trunkX: 855, trunkY: 350, label: 'Zona 4 &middot; Estación Manual 2' };
      if (code.includes('SIR-02')) return { cx: 820, cy: 395, trunkX: 855, trunkY: 395, label: 'Zona 4 &middot; Sirena 2' };
      if (code.includes('AUT')) return { cx: 890, cy: 325, trunkX: 890, trunkY: 325, label: 'Zona 4 &middot; Equipo Autónomo' };
      return { cx: 850, cy: 300 + ((index * 30) % 90), trunkX: 855, trunkY: 300, label: 'Zona 4 &middot; Dispositivo' };
    }

    if (isZ3) {
      // ZONA 3: Gradería Norte (Tribuna Izquierda)
      if (code.includes('PAL-01')) return { cx: 145, cy: 250, trunkX: 160, trunkY: 250, label: 'Zona 3 &middot; Estación Manual 1' };
      if (code.includes('SEN-01')) return { cx: 140, cy: 290, trunkX: 160, trunkY: 290, label: 'Zona 3 &middot; Sensor Óptico 1' };
      if (code.includes('SEN-02')) return { cx: 140, cy: 330, trunkX: 160, trunkY: 330, label: 'Zona 3 &middot; Sensor Térmico 2' };
      if (code.includes('SEN-03')) return { cx: 140, cy: 370, trunkX: 160, trunkY: 370, label: 'Zona 3 &middot; Sensor 3' };
      if (code.includes('SIR-01')) return { cx: 175, cy: 270, trunkX: 160, trunkY: 270, label: 'Zona 3 &middot; Sirena 1' };
      if (code.includes('PAL-02')) return { cx: 175, cy: 350, trunkX: 160, trunkY: 350, label: 'Zona 3 &middot; Estación Manual 2' };
      if (code.includes('SIR-02')) return { cx: 175, cy: 395, trunkX: 160, trunkY: 395, label: 'Zona 3 &middot; Sirena 2' };
      if (code.includes('AUT')) return { cx: 110, cy: 325, trunkX: 110, trunkY: 325, label: 'Zona 3 &middot; Equipo Autónomo' };
      return { cx: 155, cy: 300 + (index * 30) % 90, trunkX: 160, trunkY: 300, label: 'Zona 3 &middot; Dispositivo' };
    }

    if (isZ2) {
      // ZONA 2: Gradería Oriental & Accesos (Tribuna Inferior)
      if (code.includes('PAL-01')) return { cx: 280, cy: 475, trunkX: 280, trunkY: 495, label: 'Zona 2 &middot; Estación Manual 1' };
      if (code.includes('SEN-01')) return { cx: 380, cy: 505, trunkX: 380, trunkY: 515, label: 'Zona 2 &middot; Sensor Óptico 1' };
      if (code.includes('SEN-02')) return { cx: 500, cy: 520, trunkX: 500, trunkY: 530, label: 'Zona 2 &middot; Sensor Térmico 2' };
      if (code.includes('SEN-03')) return { cx: 620, cy: 505, trunkX: 620, trunkY: 515, label: 'Zona 2 &middot; Sensor 3' };
      if (code.includes('SIR-01')) return { cx: 720, cy: 475, trunkX: 720, trunkY: 495, label: 'Zona 2 &middot; Sirena 1' };
      if (code.includes('PAL-02')) return { cx: 650, cy: 445, trunkX: 650, trunkY: 470, label: 'Zona 2 &middot; Estación Manual 2' };
      if (code.includes('SIR-02')) return { cx: 350, cy: 445, trunkX: 350, trunkY: 470, label: 'Zona 2 &middot; Sirena 2' };
      if (code.includes('AUT')) return { cx: 500, cy: 465, trunkX: 500, trunkY: 465, label: 'Zona 2 &middot; Equipo Autónomo' };
      return { cx: 360 + (index * 90) % 300, cy: 480, trunkX: 500, trunkY: 510, label: 'Zona 2 &middot; Dispositivo' };
    }

    // Default: ZONA 1 (Gradería Occidental & Prensa - Tribuna Superior)
    if (code.includes('PAL-01')) return { cx: 270, cy: 175, trunkX: 270, trunkY: 155, label: 'Zona 1 &middot; Estación Manual 1' };
    if (code.includes('SEN-01')) return { cx: 380, cy: 150, trunkX: 380, trunkY: 135, label: 'Zona 1 &middot; Sensor Óptico 1' };
    if (code.includes('SEN-02')) return { cx: 500, cy: 135, trunkX: 500, trunkY: 125, label: 'Zona 1 &middot; Sensor Térmico 2' };
    if (code.includes('SEN-03')) return { cx: 620, cy: 150, trunkX: 620, trunkY: 135, label: 'Zona 1 &middot; Sensor Haz Beam 3' };
    if (code.includes('SIR-01')) return { cx: 730, cy: 175, trunkX: 730, trunkY: 155, label: 'Zona 1 &middot; Sirena 1' };
    if (code.includes('PAL-02')) return { cx: 660, cy: 205, trunkX: 660, trunkY: 180, label: 'Zona 1 &middot; Estación Manual 2' };
    if (code.includes('SIR-02')) return { cx: 340, cy: 205, trunkX: 340, trunkY: 180, label: 'Zona 1 &middot; Sirena 2' };
    if (code.includes('AUT')) return { cx: 500, cy: 185, trunkX: 500, trunkY: 185, label: 'Zona 1 &middot; Equipo Autónomo' };

    const cx = 340 + (index * 90) % 320;
    return { cx, cy: 165, trunkX: cx, trunkY: 145, label: 'Zona 1 &middot; Dispositivo' };
  };

  // Filter out the bulk infrastructure items (tubería/cable) from point dots
  const discreteDevices = items.filter((i) => i.type !== 'tuberia' && i.type !== 'cableado');
  const activeDisplayNode = hoveredNode || activeSelected;

  const isZ2 = currentZone.includes('Oriental') || currentZone.includes('Zona 2');
  const isZ3 = currentZone.includes('Norte') || currentZone.includes('Zona 3');
  const isZ4 = currentZone.includes('Sur') || currentZone.includes('Zona 4');
  const isZ1 = !isZ2 && !isZ3 && !isZ4;

  // SVG paths for the shared conduit + cable loop directed to Central FACP
  const trunkPathD = isZ4
    ? 'M 855 125 L 855 240 Q 870 325 855 410'
    : isZ3
    ? 'M 855 125 Q 500 115 160 190 L 160 410'
    : isZ2
    ? 'M 855 125 Q 920 325 855 460 Q 500 540 220 460'
    : 'M 855 125 L 855 160 Q 500 115 220 160';

  return (
    <div className="relative w-full rounded-2xl border border-surface-border bg-white p-5 overflow-hidden shadow-sm">
      {/* Blueprint Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-surface-border text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="font-mono font-bold uppercase text-brand-deep">
            Esquema Técnico de Canalización &middot; Estadio Metropolitano
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-brand-ice text-brand-deep font-mono font-bold border border-brand-light">
            {currentZone}
          </span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-gsitText-secondary">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-2 rounded bg-cyan-400 border border-slate-900 inline-block"></span>
            <span>Tramo Tubería Conduit + Cable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
            <span>Equipo Autónomo (Batería)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Conforme</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-primary inline-block"></span>
            <span>Instalado</span>
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

          {/* Tribuna Occidental (Top - Zona 1) */}
          <path
            d="M 180 180 Q 500 110 820 180 L 760 215 Q 500 155 240 215 Z"
            fill={isZ1 ? '#0284c7' : '#1e293b'}
            fillOpacity={isZ1 ? '0.35' : '0.6'}
            stroke="#0ea5e9"
            strokeWidth={isZ1 ? '2' : '1'}
          />
          <text x="500" y="165" fill={isZ1 ? '#38bdf8' : '#64748b'} fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            TRIBUNA OCCIDENTAL &middot; ZONA 1 (PRENSA &amp; VIP)
          </text>

          {/* Tribuna Oriental (Bottom - Zona 2) */}
          <path
            d="M 180 470 Q 500 540 820 470 L 760 435 Q 500 495 240 435 Z"
            fill={isZ2 ? '#0284c7' : '#1e293b'}
            fillOpacity={isZ2 ? '0.35' : '0.6'}
            stroke="#475569"
            strokeWidth={isZ2 ? '2' : '1'}
          />
          <text x="500" y="520" fill={isZ2 ? '#38bdf8' : '#94a3b8'} fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            TRIBUNA ORIENTAL &middot; ZONA 2 (ACCESOS GENERALES)
          </text>

          {/* Tribuna Norte (Left - Zona 3) */}
          <path
            d="M 140 250 Q 110 325 140 400 L 195 380 Q 170 325 195 270 Z"
            fill={isZ3 ? '#0284c7' : '#1e293b'}
            fillOpacity={isZ3 ? '0.35' : '0.6'}
            stroke="#475569"
            strokeWidth={isZ3 ? '2' : '1'}
          />
          <text x="145" y="330" fill={isZ3 ? '#38bdf8' : '#64748b'} fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle" transform="rotate(-90 145 330)">
            TRIBUNA NORTE &middot; ZONA 3
          </text>

          {/* Tribuna Sur (Right - Zona 4) */}
          <path
            d="M 860 250 Q 890 325 860 400 L 805 380 Q 830 325 805 270 Z"
            fill={isZ4 ? '#0284c7' : '#1e293b'}
            fillOpacity={isZ4 ? '0.35' : '0.6'}
            stroke={isZ4 ? '#0ea5e9' : '#475569'}
            strokeWidth={isZ4 ? '2' : '1'}
          />
          <text x="855" y="330" fill={isZ4 ? '#38bdf8' : '#64748b'} fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle" transform="rotate(90 855 330)">
            TRIBUNA SUR &middot; ZONA 4
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
          <rect x="250" y="210" width="500" height="230" fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.5" />
          <line x1="500" y1="210" x2="500" y2="440" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.5" />
          <circle cx="500" cy="325" r="45" fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.5" />

          {/* Sala Principal de Control y FACP (Sistema Central) */}
          <g
            className="cursor-pointer"
            onClick={() => handleSelect(centralFacp)}
          >
            <rect
              x="770"
              y="40"
              width="170"
              height="85"
              rx="6"
              fill="#0f172a"
              stroke={activeSelected?.code.includes('FACP') ? '#38bdf8' : '#0284c7'}
              strokeWidth={activeSelected?.code.includes('FACP') ? '2.5' : '2'}
            />
            <circle cx="855" cy="82" r="10" fill="#090d16" stroke="#10b981" strokeWidth="2.5" />
            <circle cx="855" cy="82" r="4.5" fill="#10b981" />
            <text x="855" y="85" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">✓</text>
            <text x="855" y="60" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              SALA DE CONTROL FACP
            </text>
            <text x="855" y="105" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
              SISTEMA CENTRAL (NFPA 72)
            </text>
          </g>

          {/* Cuarto de Bombas y Subestación */}
          <rect
            x="60"
            y="520"
            width="170"
            height="90"
            rx="6"
            fill="#0f172a"
            stroke="#0284c7"
            strokeWidth="1.5"
          />
          <text x="145" y="545" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            CUARTO DE BOMBAS RCI
          </text>
          <text x="145" y="560" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
            Subestación Técnica
          </text>

          {/* ============================================================ */}
          {/* TRAMO COMPARTIDO: TUBERÍA CONDUIT + CABLEADO AL FACP         */}
          {/* ============================================================ */}
          <g
            className="cursor-pointer group"
            onClick={() => setShowTramoPrompt(true)}
          >
            {/* Hit area and halo on hover */}
            <path
              d={trunkPathD}
              fill="none"
              stroke="#00b4d8"
              strokeWidth="10"
              strokeOpacity="0.15"
              strokeLinecap="round"
            />
            {/* Tubería Conduit EMT Body */}
            <path
              d={trunkPathD}
              fill="none"
              stroke="#00b4d8"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Cableado FPLR / Lazo SLC Centerline */}
            <path
              d={trunkPathD}
              fill="none"
              stroke="#f8fafc"
              strokeWidth="1.2"
              strokeDasharray="5,4"
              opacity="0.9"
            />

            {/* Junction / Condulet Boxes */}
            {(isZ4
              ? [
                  { x: 855, y: 125 },
                  { x: 855, y: 240 },
                  { x: 865, y: 325 },
                  { x: 855, y: 410 },
                ]
              : isZ3
              ? [
                  { x: 855, y: 125 },
                  { x: 500, y: 115 },
                  { x: 160, y: 190 },
                  { x: 160, y: 410 },
                ]
              : isZ2
              ? [
                  { x: 855, y: 125 },
                  { x: 855, y: 460 },
                  { x: 500, y: 530 },
                  { x: 220, y: 460 },
                ]
              : [
                  { x: 855, y: 125 },
                  { x: 500, y: 125 },
                  { x: 220, y: 160 },
                ]
            ).map((box, i) => (
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
          </g>

          {/* Interactive Badge on the Shared Tramo */}
          <g
            className="cursor-pointer"
            onClick={() => setShowTramoPrompt(true)}
          >
            <rect
              x={isZ3 ? 120 : isZ4 ? 740 : 420}
              y={isZ3 ? 200 : isZ4 ? 180 : isZ2 ? 545 : 105}
              width={isZ4 ? 170 : 160}
              height="20"
              rx="5"
              fill="#090d16"
              stroke="#00b4d8"
              strokeWidth="1.5"
            />
            <text
              x={isZ3 ? 200 : isZ4 ? 825 : 500}
              y={isZ3 ? 213 : isZ4 ? 193 : isZ2 ? 558 : 118}
              fill="#38bdf8"
              fontSize="8.5"
              fontWeight="bold"
              fontFamily="monospace"
              textAnchor="middle"
            >
              🔀 Tramo: Tubería + Cable (Clic)
            </text>
          </g>

          {/* ============================================================ */}
          {/* BRANCH CONDUIT & CABLE CONNECTIONS TO EACH NON-AUTONOMOUS    */}
          {/* ============================================================ */}
          {discreteDevices.map((item, index) => {
            const coords = getCoordinatesForZone(item, index);
            const autonomous = isAutonomous(item);
            const isSelected = activeSelected?.id === item.id || activeSelected?.code === item.code;

            if (autonomous) return null;

            return (
              <g key={`branch-con-${item.id}`}>
                {/* Branch conduit pipe */}
                <line
                  x1={coords.trunkX}
                  y1={coords.trunkY}
                  x2={coords.cx}
                  y2={coords.cy}
                  stroke={isSelected ? '#38bdf8' : '#00b4d8'}
                  strokeWidth={isSelected ? '3' : '2'}
                  strokeLinecap="round"
                />
                {/* Internal SLC Cable */}
                <line
                  x1={coords.trunkX}
                  y1={coords.trunkY}
                  x2={coords.cx}
                  y2={coords.cy}
                  stroke="#f1f5f9"
                  strokeWidth="0.8"
                  strokeDasharray="3,2"
                />
                <circle cx={coords.trunkX} cy={coords.trunkY} r="2.5" fill="#38bdf8" />
              </g>
            );
          })}

          {/* ============================================================ */}
          {/* TECHNICAL NODES: 3 SENSORS, 1 AUTONOMOUS, 2 PULL, 2 SIRENS   */}
          {/* ============================================================ */}
          {discreteDevices.map((item, index) => {
            const coords = getCoordinatesForZone(item, index);
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
                {/* Hover / Selection Aura */}
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

                {/* Node Ring */}
                <circle
                  cx={coords.cx}
                  cy={coords.cy}
                  r="9.5"
                  fill="#090d16"
                  stroke={isSelected ? '#ffffff' : autonomous ? '#a855f7' : color}
                  strokeWidth={isSelected ? '2.5' : '2'}
                />

                {/* Status Dot */}
                <circle cx={coords.cx} cy={coords.cy} r="4" fill={autonomous ? '#a855f7' : color} />

                {item.status === 'inspected' && !autonomous && (
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

                {/* Autonomous Icon badge */}
                {autonomous && (
                  <text
                    x={coords.cx}
                    y={coords.cy + 2.5}
                    fill="#ffffff"
                    fontSize="7"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    ⚡
                  </text>
                )}

                {/* Tag Rect and Label */}
                <rect
                  x={coords.cx - 28}
                  y={coords.cy - 24}
                  width="56"
                  height="13"
                  rx="3"
                  fill="#090d16"
                  fillOpacity="0.95"
                  stroke={isSelected ? '#38bdf8' : autonomous ? '#a855f7' : '#334155'}
                  strokeWidth={isSelected ? '1.2' : '0.8'}
                />
                <text
                  x={coords.cx}
                  y={coords.cy - 14.5}
                  fill={isSelected ? '#38bdf8' : autonomous ? '#d8b4fe' : '#f1f5f9'}
                  fontSize="7.5"
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

        {/* ============================================================ */}
        {/* MODAL / PROMPT DE SELECCIÓN DE TRAMO (TUBERÍA O CABLE)       */}
        {/* ============================================================ */}
        {showTramoPrompt && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 z-30 animate-in fade-in duration-150">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-5 shadow-2xl text-white space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-bold uppercase">
                  <GitBranch className="w-4 h-4" />
                  <span>Tramo Físico Compartido</span>
                </div>
                <button
                  onClick={() => setShowTramoPrompt(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                En esta trayectoria, la tubería Conduit y el cableado de lazo comparten exactamente la misma canalización física hacia el <strong className="text-white">Sistema Central (FACP)</strong>.
              </p>
              <div className="text-[11px] font-bold text-sky-300 uppercase tracking-wide">
                ¿Qué deseas seleccionar en este tramo?
              </div>

              <div className="grid grid-cols-1 gap-2.5 font-mono">
                {/* Option 1: Tubería Conduit */}
                <button
                  onClick={() => {
                    handleSelect(currentTuberia);
                    setShowTramoPrompt(false);
                  }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 text-left transition-all group"
                >
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:scale-105 transition-transform mt-0.5">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">
                      Tubería Conduit EMT
                    </span>
                    <span className="text-[11px] text-slate-400 block font-sans">
                      Canalización física 1" galvanizada, anclaje antisísmico y cajas condulet 4x4.
                    </span>
                    <span className="text-[10px] text-cyan-400 font-bold block pt-0.5">
                      Código: {currentTuberia.code}
                    </span>
                  </div>
                </button>

                {/* Option 2: Cableado FPLR */}
                <button
                  onClick={() => {
                    handleSelect(currentCable);
                    setShowTramoPrompt(false);
                  }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-sky-500/40 hover:border-sky-400 text-left transition-all group"
                >
                  <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 group-hover:scale-105 transition-transform mt-0.5">
                    <Cable className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">
                      Cableado FPLR / Lazo SLC
                    </span>
                    <span className="text-[11px] text-slate-400 block font-sans">
                      Conductor 2x14 AWG blindado viajando dentro del conduit hacia el FACP.
                    </span>
                    <span className="text-[10px] text-sky-400 font-bold block pt-0.5">
                      Código: {currentCable.code}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PINNED TECHNICAL DETAIL CARD (WITH TOGGLE SWITCH)           */}
        {/* ============================================================ */}
        {activeDisplayNode && !showTramoPrompt && (
          <div className="absolute bottom-4 left-4 z-20 max-w-sm w-full rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md text-white animate-in fade-in duration-150">
            {/* Header & Toggle between Tubería and Cable if inspecting conduit/cable */}
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

            {/* Quick Toggle if currently inspecting either Tubería or Cable */}
            {(activeDisplayNode.type === 'tuberia' || activeDisplayNode.type === 'cableado') && (
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 mb-2.5 text-[10px] font-mono">
                <button
                  onClick={() => handleSelect(currentTuberia)}
                  className={`flex-1 py-1 rounded-lg font-bold flex items-center justify-center gap-1 transition-all ${
                    activeDisplayNode.type === 'tuberia'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Wrench className="w-3 h-3" />
                  <span>Ver Tubería</span>
                </button>
                <button
                  onClick={() => handleSelect(currentCable)}
                  className={`flex-1 py-1 rounded-lg font-bold flex items-center justify-center gap-1 transition-all ${
                    activeDisplayNode.type === 'cableado'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Cable className="w-3 h-3" />
                  <span>Ver Cable</span>
                </button>
              </div>
            )}

            {/* Specifications */}
            <div className="space-y-2 text-[11px] font-mono text-slate-300">
              <div className="flex items-center justify-between text-slate-400">
                <span>Modelo:</span>
                <span className="text-slate-200 font-bold">{activeDisplayNode.model}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Zona:</span>
                <span className="text-slate-200">{activeDisplayNode.zone}</span>
              </div>

              {/* Infrastructure connections */}
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 mt-2">
                {isAutonomous(activeDisplayNode) ? (
                  <div className="flex items-start gap-2 text-purple-300">
                    <BatteryCharging className="w-4 h-4 shrink-0 text-purple-400 mt-0.5" />
                    <span className="text-[10px] leading-relaxed">
                      <strong>Equipo Autónomo:</strong> Batería interna de litio (10 años). Dispositivo independiente que no requiere canalización de tubería ni cable exterior hacia el sistema central.
                    </span>
                  </div>
                ) : activeDisplayNode.code.includes('FACP') ? (
                  <div className="flex items-start gap-2 text-emerald-300">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                    <span className="text-[10px] leading-relaxed">
                      <strong>Sistema Central:</strong> Panel Central FACP. Todos los lazos direccionables SLC (3 sensores, 2 palancas y 2 sirenas) convergen aquí.
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-cyan-400 text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 shrink-0" />
                        <span>Canalización: {currentTuberia.code} (Conduit EMT)</span>
                      </div>
                      <button
                        onClick={() => handleSelect(currentTuberia)}
                        className="text-[9px] text-cyan-300 underline hover:text-white"
                      >
                        Ver Tubería
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-sky-300 text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <Cable className="w-3.5 h-3.5 shrink-0" />
                        <span>Cableado: {currentCable.code} (Lazo SLC FACP)</span>
                      </div>
                      <button
                        onClick={() => handleSelect(currentCable)}
                        className="text-[9px] text-sky-200 underline hover:text-white"
                      >
                        Ver Cable
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between pt-1 text-slate-400">
                <span>Metrado / Cant:</span>
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

      {/* Blueprint Footer */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-gsitText-secondary pt-2 border-t border-surface-border">
        <div className="flex items-center gap-3">
          <span>
            Zona Activa: <strong className="text-brand-deep">{currentZone}</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span>
            3 Sensores SLC &bull; 1 Autónomo &bull; 2 Palancas &bull; 2 Sirenas &bull; Sistema Central FACP
          </span>
        </div>

        <div className="flex items-center gap-2 text-brand-primary font-bold">
          <GitBranch className="w-3.5 h-3.5" />
          <span>Lazo SLC Clase A &bull; NFPA 72</span>
        </div>
      </div>
    </div>
  );
}
