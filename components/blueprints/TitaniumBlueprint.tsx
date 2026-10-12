'use client';

import React, { useState } from 'react';
import { FloorItem } from '@/src/schemas/floor-item.schema';
import { X, Wrench, Cable, GitBranch, BatteryCharging, ShieldAlert } from 'lucide-react';

interface Props {
  items: FloorItem[];
  currentFloorName: string;
  isEditable: boolean;
  selectedItemId?: string | null;
  onSelectItem?: (item: FloorItem) => void;
}

export interface BlueprintSection {
  id: string;
  code: string;
  name: string;
  fromCode: string;
  toCode: string;
  lengthMeters: number;
  pathD: string;
  labelPos: { x: number; y: number };
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
  const [selectedSection, setSelectedSection] = useState<BlueprintSection | null>(null);
  const [hoveredSection, setHoveredSection] = useState<BlueprintSection | null>(null);
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
        return '#10B981'; // emerald-500
      case 'installed':
        return '#0077B6'; // brand-primary blue
      case 'pending':
      default:
        return '#F59E0B'; // amber-500 (PLANIFICADO)
    }
  };

  const isAutonomous = (item: FloorItem) => {
    const text = `${item.code} ${item.name} ${item.type} ${item.notes || ''}`.toLowerCase();
    return text.includes('aut-') || (text.includes('autónomo') && !text.includes('direccionable'));
  };

  const mainTuberia: FloorItem = (items.find((i) => i.type === 'tuberia' || i.code.includes('TUB')) as FloorItem) || {
    id: 'default-tt-tub',
    projectId: 'torre-titanium',
    code: 'TUB-EMT-34',
    type: 'tuberia',
    name: 'Tubería Metálica Eléctrica Conduit EMT 3/4"',
    model: 'Colmena / RigiCol EMT C-80 Rojo',
    zone: currentFloorName,
    status: 'pending',
    quantity: 340,
    unit: 'Metros Lineales',
    unitPrice: 38500,
    notes: '',
  };

  const mainCable: FloorItem = (items.find((i) => i.type === 'cableado' || i.code.includes('CAB')) as FloorItem) || {
    id: 'default-tt-cab',
    projectId: 'torre-titanium',
    code: 'CAB-FPLR-214',
    type: 'cableado',
    name: 'Cable FPLR Blindado 2x14 AWG Rojo Certificado UL',
    model: 'Genesis / Honeywell Cable FPLR 300V',
    zone: currentFloorName,
    status: 'pending',
    quantity: 580,
    unit: 'Metros',
    unitPrice: 12400,
    notes: '',
  };

  // Distinct technical sections connecting equipment in series
  const sections: BlueprintSection[] = [
    {
      id: 'sec-1',
      code: 'SEC-01',
      name: 'Tramo 1: FACP-01 ➔ SIR-01',
      fromCode: 'FACP-01',
      toCode: 'SIR-01',
      lengthMeters: 14,
      pathD: 'M 230 400 L 230 260',
      labelPos: { x: 195, y: 330 },
    },
    {
      id: 'sec-2',
      code: 'SEC-02',
      name: 'Tramo 2: SIR-01 ➔ PAL-01',
      fromCode: 'SIR-01',
      toCode: 'PAL-01',
      lengthMeters: 15,
      pathD: 'M 230 260 L 380 260',
      labelPos: { x: 305, y: 245 },
    },
    {
      id: 'sec-3',
      code: 'SEC-03',
      name: 'Tramo 3: PAL-01 ➔ SEN-01',
      fromCode: 'PAL-01',
      toCode: 'SEN-01',
      lengthMeters: 14.5,
      pathD: 'M 380 260 L 380 115',
      labelPos: { x: 345, y: 185 },
    },
    {
      id: 'sec-4',
      code: 'SEC-04',
      name: 'Tramo 4: SEN-01 ➔ SEN-02',
      fromCode: 'SEN-01',
      toCode: 'SEN-02',
      lengthMeters: 14,
      pathD: 'M 380 115 L 520 115',
      labelPos: { x: 450, y: 98 },
    },
    {
      id: 'sec-5',
      code: 'SEC-05',
      name: 'Tramo 5: SEN-02 ➔ SIR-02',
      fromCode: 'SEN-02',
      toCode: 'SIR-02',
      lengthMeters: 14,
      pathD: 'M 520 115 L 660 115',
      labelPos: { x: 590, y: 98 },
    },
    {
      id: 'sec-6',
      code: 'SEC-06',
      name: 'Tramo 6: SIR-02 ➔ SEN-03',
      fromCode: 'SIR-02',
      toCode: 'SEN-03',
      lengthMeters: 25.5,
      pathD: 'M 660 115 L 770 115 L 770 260',
      labelPos: { x: 740, y: 98 },
    },
    {
      id: 'sec-7',
      code: 'SEC-07',
      name: 'Tramo 7: SEN-03 ➔ PAL-02',
      fromCode: 'SEN-03',
      toCode: 'PAL-02',
      lengthMeters: 16,
      pathD: 'M 770 260 L 770 420',
      labelPos: { x: 805, y: 340 },
    },
  ];

  const getDeviceCoordinates = (item: FloorItem, index: number) => {
    const code = item.code.toUpperCase();
    if (code.includes('FACP')) {
      return { cx: 230, cy: 400, label: 'Sala Central FACP & Telecomunicaciones' };
    }
    if (code.includes('SIR-01') || code.includes('SIR-1')) {
      return { cx: 230, cy: 260, label: 'Ala Occidente · Sirena Estroboscópica 1' };
    }
    if (code.includes('PAL-01') || code.includes('PAL-1')) {
      return { cx: 380, cy: 260, label: 'Núcleo Central · Estación Manual 1' };
    }
    if (code.includes('SEN-01') || code.includes('SEN-1')) {
      return { cx: 380, cy: 115, label: 'Ala Norte · Sensor Óptico 1' };
    }
    if (code.includes('SEN-02') || code.includes('SEN-2')) {
      return { cx: 520, cy: 115, label: 'Ala Norte Centro · Sensor Térmico 2' };
    }
    if (code.includes('SIR-02') || code.includes('SIR-2')) {
      return { cx: 660, cy: 115, label: 'Ala Norte Oriente · Sirena Estroboscópica 2' };
    }
    if (code.includes('SEN-03') || code.includes('SEN-3')) {
      return { cx: 770, cy: 260, label: 'Ala Oriente · Sensor Detección 3' };
    }
    if (code.includes('PAL-02') || code.includes('PAL-2')) {
      return { cx: 770, cy: 420, label: 'Ala Oriente · Estación Manual 2' };
    }
    if (code.includes('AUT')) {
      return { cx: 840, cy: 340, label: 'Ala Oriente · Detector Autónomo (Batería 10 Años - Inalámbrico)' };
    }

    // Dynamic placement on conduit route
    if (index % 3 === 0) {
      return { cx: 230, cy: 330, label: 'Ala Occidente - Dispositivo' };
    }
    if (index % 3 === 1) {
      return { cx: 450, cy: 115, label: 'Ala Norte - Dispositivo' };
    }
    return { cx: 770, cy: 340, label: 'Ala Oriente - Dispositivo' };
  };

  const discreteDevices = items.filter((i) => i.type !== 'tuberia' && i.type !== 'cableado');
  const activeDisplayNode = hoveredNode || activeSelected;

  const handleSectionClick = (sec: BlueprintSection) => {
    setSelectedSection(sec);
    setShowTramoPrompt(true);
  };

  const getSectionTuberiaItem = (sec: BlueprintSection): FloorItem => {
    return {
      id: `tt-tub-${sec.id}`,
      projectId: 'torre-titanium',
      code: `TUB-${sec.code}`,
      type: 'tuberia',
      name: `Tubería Conduit EMT 3/4" · ${sec.name}`,
      model: 'Colmena / RigiCol EMT C-80 Galvanizada 3/4"',
      zone: currentFloorName,
      status: 'pending',
      quantity: sec.lengthMeters,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      notes: `Canalización física rígida desde ${sec.fromCode} hasta ${sec.toCode}.`,
    };
  };

  const getSectionCableItem = (sec: BlueprintSection): FloorItem => {
    return {
      id: `tt-cab-${sec.id}`,
      projectId: 'torre-titanium',
      code: `CAB-${sec.code}`,
      type: 'cableado',
      name: `Cable FPLR Blindado 2x14 AWG · ${sec.name}`,
      model: 'Genesis / Honeywell Cable FPLR 300V UL',
      zone: currentFloorName,
      status: 'pending',
      quantity: Math.round(sec.lengthMeters * 1.05),
      unit: 'Metros',
      unitPrice: 12400,
      notes: `Lazo SLC direccionable tendido en tubería Conduit desde ${sec.fromCode} hasta ${sec.toCode}.`,
    };
  };

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
            <span>Tubería Conduit EMT (Por Secciones)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span>Equipo Autónomo (Sin Tubería / Batería)</span>
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
          <text x="500" y="93" fill="#e2e8f0" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            ALA NORTE &middot; SALAS DE REUNIONES &amp; AUDITORIO
          </text>

          {/* West Wing / Datacenter */}
          <rect x="80" y="180" width="300" height="340" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <text x="230" y="210" fill="#e2e8f0" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            ALA OCCIDENTE &middot; DATACENTER &amp; NOC
          </text>
          <rect x="110" y="250" width="240" height="240" fill="#0f172a" stroke="#0077b6" strokeWidth="1" strokeDasharray="4,2" />
          <text x="230" y="375" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle">
            SALA CENTRAL FACP &amp; TELECOMUNICACIONES
          </text>

          {/* East Wing / Open Office */}
          <rect x="620" y="180" width="300" height="340" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <text x="770" y="210" fill="#e2e8f0" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            ALA ORIENTE &middot; OPEN OFFICE &amp; COWORKING
          </text>

          {/* ============================================================ */}
          {/* SECCIONES DISCRIMINADAS DE TUBERÍA Y CABLEADO (DE EQUIPO A EQUIPO) */}
          {/* ============================================================ */}
          {sections.map((sec) => {
            const isHovered = hoveredSection?.id === sec.id;
            const isSelected = selectedSection?.id === sec.id;

            return (
              <g
                key={sec.id}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredSection(sec)}
                onMouseLeave={() => setHoveredSection(null)}
                onClick={() => handleSectionClick(sec)}
              >
                {/* Section Glow / Hover AURA */}
                <path
                  d={sec.pathD}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="14"
                  strokeOpacity={isSelected ? 0.35 : isHovered ? 0.25 : 0}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Tubería Conduit EMT Body */}
                <path
                  d={sec.pathD}
                  fill="none"
                  stroke={isSelected ? '#38bdf8' : isHovered ? '#00b4d8' : '#0284c7'}
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Cableado FPLR SLC Centerline */}
                <path
                  d={sec.pathD}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeDasharray="4,3"
                  opacity={isSelected ? 1 : 0.85}
                />

                {/* Section interactive badge pill */}
                <rect
                  x={sec.labelPos.x - 24}
                  y={sec.labelPos.y - 9}
                  width="48"
                  height="18"
                  rx="6"
                  fill="#090d16"
                  stroke={isSelected ? '#38bdf8' : isHovered ? '#00b4d8' : '#334155'}
                  strokeWidth={isSelected ? '1.5' : '1'}
                />
                <text
                  x={sec.labelPos.x}
                  y={sec.labelPos.y + 3.5}
                  fill={isSelected ? '#38bdf8' : isHovered ? '#e0f2fe' : '#94a3b8'}
                  fontSize="7.5"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {sec.code} ({sec.lengthMeters}m)
                </text>
              </g>
            );
          })}

          {/* ============================================================ */}
          {/* NODOS DE EQUIPOS TÉCNICOS (FACP, SENSORES, PALANCAS, SIRENAS) */}
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
                {/* In-line Condulet connection box behind non-autonomous device */}
                {!autonomous && (
                  <rect
                    x={coords.cx - 7}
                    y={coords.cy - 7}
                    width="14"
                    height="14"
                    rx="2"
                    fill="#0f172a"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                  />
                )}

                {/* Hover / Selection Aura */}
                {(isSelected || isHovered) && (
                  <circle
                    cx={coords.cx}
                    cy={coords.cy}
                    r="18"
                    fill={autonomous ? '#a855f7' : color}
                    fillOpacity="0.25"
                    stroke={autonomous ? '#c084fc' : color}
                    strokeWidth="1.5"
                  />
                )}

                {/* Device Ring */}
                <circle
                  cx={coords.cx}
                  cy={coords.cy}
                  r="9.5"
                  fill="#090d16"
                  stroke={isSelected ? '#ffffff' : autonomous ? '#c084fc' : color}
                  strokeWidth={isSelected ? '2.5' : '2'}
                />

                {/* Status Dot */}
                <circle cx={coords.cx} cy={coords.cy} r="4" fill={autonomous ? '#c084fc' : color} />

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

                {/* Autonomous Device Icon */}
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

                {/* Code Tag */}
                <rect
                  x={coords.cx - 26}
                  y={coords.cy - 24}
                  width="52"
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
        {/* MODAL DISCRIMINADOR DE SECCIÓN (TUBERÍA O CABLEADO DEL TRAMO) */}
        {/* ============================================================ */}
        {showTramoPrompt && selectedSection && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="max-w-md w-full rounded-2xl border border-sky-500/30 bg-slate-900 p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping"></div>
                  <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    Control de Sección Técnica &middot; {selectedSection.code}
                  </h4>
                </div>
                <button
                  onClick={() => setShowTramoPrompt(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Trayectoria:</span>
                  <strong className="text-white">
                    {selectedSection.fromCode} ➔ {selectedSection.toCode}
                  </strong>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Longitud de Sección:</span>
                  <strong className="text-sky-300">{selectedSection.lengthMeters} metros lineales</strong>
                </div>
              </div>

              <div className="text-[11px] font-bold text-sky-300 uppercase tracking-wide font-mono">
                ¿Qué componente de esta sección deseas seleccionar?
              </div>

              <div className="grid grid-cols-1 gap-2.5 font-mono">
                {/* Option 1: Tubería Conduit */}
                <button
                  onClick={() => handleSelect(getSectionTuberiaItem(selectedSection))}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 text-left transition-all group"
                >
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:scale-105 transition-transform mt-0.5">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">
                      Tubería Conduit EMT 3/4" (Sección {selectedSection.code})
                    </span>
                    <span className="text-[11px] text-slate-400 block font-sans">
                      Canalización física rígida de {selectedSection.lengthMeters}m entre {selectedSection.fromCode} y {selectedSection.toCode}.
                    </span>
                    <span className="text-[10px] text-cyan-400 font-bold block pt-0.5">
                      Código: TUB-{selectedSection.code} &bull; {selectedSection.lengthMeters} m
                    </span>
                  </div>
                </button>

                {/* Option 2: Cableado FPLR */}
                <button
                  onClick={() => handleSelect(getSectionCableItem(selectedSection))}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-sky-500/40 hover:border-sky-400 text-left transition-all group"
                >
                  <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 group-hover:scale-105 transition-transform mt-0.5">
                    <Cable className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">
                      Cableado FPLR / Lazo SLC (Sección {selectedSection.code})
                    </span>
                    <span className="text-[11px] text-slate-400 block font-sans">
                      Conductor blindado 2x14 AWG de {Math.round(selectedSection.lengthMeters * 1.05)}m dentro del tramo.
                    </span>
                    <span className="text-[10px] text-sky-400 font-bold block pt-0.5">
                      Código: CAB-{selectedSection.code} &bull; {Math.round(selectedSection.lengthMeters * 1.05)} m
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Technical Item Detail Card */}
        {activeDisplayNode && (
          <div className="absolute bottom-5 right-5 max-w-sm w-full rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md animate-in fade-in duration-150 z-20">
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-2 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-cyan-400">
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

            {/* Quick Toggle if inspecting either Tubería or Cable */}
            {(activeDisplayNode.type === 'tuberia' || activeDisplayNode.type === 'cableado') && (
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 mb-2.5 text-[10px] font-mono">
                <button
                  onClick={() =>
                    handleSelect(
                      selectedSection
                        ? getSectionTuberiaItem(selectedSection)
                        : mainTuberia
                    )
                  }
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
                  onClick={() =>
                    handleSelect(
                      selectedSection
                        ? getSectionCableItem(selectedSection)
                        : mainCable
                    )
                  }
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

            <div className="space-y-2 text-[11px] font-mono text-slate-300">
              <div className="flex items-center justify-between text-slate-400">
                <span>Modelo:</span>
                <span className="text-slate-200 font-bold">{activeDisplayNode.model}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Ubicación:</span>
                <span className="text-slate-200">{activeDisplayNode.zone}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 mt-2">
                {isAutonomous(activeDisplayNode) ? (
                  <div className="flex items-start gap-2 text-purple-300">
                    <BatteryCharging className="w-4 h-4 shrink-0 text-purple-400 mt-0.5" />
                    <span className="text-[10px] leading-relaxed">
                      <strong>Equipo Autónomo:</strong> Batería interna de litio (10 años). Dispositivo independiente que no requiere canalización de tubería ni cable exterior.
                    </span>
                  </div>
                ) : activeDisplayNode.code.includes('FACP') ? (
                  <div className="flex items-start gap-2 text-emerald-300">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                    <span className="text-[10px] leading-relaxed">
                      <strong>Sistema Central:</strong> Panel Central FACP. Todos los lazos direccionables SLC (3 sensores, 2 palancas y 2 sirenas) convergen aquí.
                    </span>
                  </div>
                ) : activeDisplayNode.type === 'tuberia' || activeDisplayNode.type === 'cableado' ? (
                  <div className="flex items-start gap-2 text-cyan-300">
                    <GitBranch className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
                    <span className="text-[10px] leading-relaxed">
                      <strong>Control de Sección:</strong> Canalización y cableado discriminado por tramo entre equipos para control de metraje e instalación.
                    </span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-sky-300">
                    <Wrench className="w-4 h-4 shrink-0 text-sky-400 mt-0.5" />
                    <span className="text-[10px] leading-relaxed">
                      <strong>Equipo Conectado:</strong> Tubería Conduit EMT y Cable SLC conectados directamente al circuito general.
                    </span>
                  </div>
                )}
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

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-gsitText-secondary pt-2 border-t border-surface-border">
        <div className="flex items-center gap-3">
          <span>
            Piso Activo: <strong className="text-brand-deep">{currentFloorName}</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span>
            7 Secciones Técnicas &bull; 3 Sensores SLC &bull; 1 Autónomo (Sin Tubería) &bull; 2 Palancas &bull; 2 Sirenas &bull; Sistema Central FACP
          </span>
        </div>

        <div className="flex items-center gap-2 text-brand-primary font-bold">
          <span>{discreteDevices.length} Equipos en Plano</span>
        </div>
      </div>
    </div>
  );
}
