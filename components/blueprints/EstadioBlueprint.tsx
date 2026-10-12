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

export default function EstadioBlueprint({
  items,
  currentZone,
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
    id: 'default-tub',
    projectId: 'estadio-metropolitano',
    code: 'EST-TUB-01',
    type: 'tuberia',
    name: 'Tubería Conduit EMT 1" Galvanizada en Caliente',
    model: 'Conduit EMT 1 pulg Heavy Duty C-80',
    zone: currentZone,
    status: 'pending',
    quantity: 380,
    unit: 'Metros Lineales',
    unitPrice: 46000,
    notes: '',
  };

  const mainCable: FloorItem = (items.find((i) => i.type === 'cableado' || i.code.includes('CAB')) as FloorItem) || {
    id: 'default-cab',
    projectId: 'estadio-metropolitano',
    code: 'EST-CAB-01',
    type: 'cableado',
    name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Dirección FACP',
    model: 'Honeywell Genesis UV-Resistant FPLR',
    zone: currentZone,
    status: 'pending',
    quantity: 750,
    unit: 'Metros',
    unitPrice: 14500,
    notes: '',
  };

  const isZ2 = currentZone.includes('Oriental') || currentZone.includes('Zona 2');
  const isZ3 = currentZone.includes('Norte') || currentZone.includes('Zona 3');
  const isZ4 = currentZone.includes('Sur') || currentZone.includes('Zona 4');
  const isZ1 = !isZ2 && !isZ3 && !isZ4;

  const getSectionsForZone = (): BlueprintSection[] => {
    if (isZ4) {
      return [
        {
          id: 'z4-sec-1',
          code: 'SEC-01',
          name: 'Tramo 1: FACP ➔ PAL-01',
          fromCode: 'EST-FACP-01',
          toCode: 'EST-Z4-PAL-01',
          lengthMeters: 15,
          pathD: 'M 855 82 L 855 230',
          labelPos: { x: 810, y: 155 },
        },
        {
          id: 'z4-sec-2',
          code: 'SEC-02',
          name: 'Tramo 2: PAL-01 ➔ SIR-01',
          fromCode: 'EST-Z4-PAL-01',
          toCode: 'EST-Z4-SIR-01',
          lengthMeters: 8,
          pathD: 'M 855 230 L 855 270 L 815 270',
          labelPos: { x: 835, y: 255 },
        },
        {
          id: 'z4-sec-3',
          code: 'SEC-03',
          name: 'Tramo 3: SIR-01 ➔ SEN-01',
          fromCode: 'EST-Z4-SIR-01',
          toCode: 'EST-Z4-SEN-01',
          lengthMeters: 7.5,
          pathD: 'M 815 270 L 855 270 L 855 305',
          labelPos: { x: 835, y: 288 },
        },
        {
          id: 'z4-sec-4',
          code: 'SEC-04',
          name: 'Tramo 4: SEN-01 ➔ SEN-02',
          fromCode: 'EST-Z4-SEN-01',
          toCode: 'EST-Z4-SEN-02',
          lengthMeters: 4,
          pathD: 'M 855 305 L 855 345',
          labelPos: { x: 815, y: 325 },
        },
        {
          id: 'z4-sec-5',
          code: 'SEC-05',
          name: 'Tramo 5: SEN-02 ➔ PAL-02',
          fromCode: 'EST-Z4-SEN-02',
          toCode: 'EST-Z4-PAL-02',
          lengthMeters: 6.5,
          pathD: 'M 855 345 L 855 370 L 815 370',
          labelPos: { x: 835, y: 358 },
        },
        {
          id: 'z4-sec-6',
          code: 'SEC-06',
          name: 'Tramo 6: PAL-02 ➔ SEN-03',
          fromCode: 'EST-Z4-PAL-02',
          toCode: 'EST-Z4-SEN-03',
          lengthMeters: 6.5,
          pathD: 'M 815 370 L 855 370 L 855 395',
          labelPos: { x: 835, y: 383 },
        },
        {
          id: 'z4-sec-7',
          code: 'SEC-07',
          name: 'Tramo 7: SEN-03 ➔ SIR-02',
          fromCode: 'EST-Z4-SEN-03',
          toCode: 'EST-Z4-SIR-02',
          lengthMeters: 7,
          pathD: 'M 855 395 L 855 425 L 815 425',
          labelPos: { x: 835, y: 410 },
        },
      ];
    }
    if (isZ3) {
      return [
        {
          id: 'z3-sec-1',
          code: 'SEC-01',
          name: 'Tramo 1: FACP ➔ PAL-01',
          fromCode: 'EST-FACP-01',
          toCode: 'EST-Z3-PAL-01',
          lengthMeters: 70,
          pathD: 'M 855 82 L 855 125 Q 500 95 160 140 L 160 230',
          labelPos: { x: 500, y: 105 },
        },
        {
          id: 'z3-sec-2',
          code: 'SEC-02',
          name: 'Tramo 2: PAL-01 ➔ SIR-01',
          fromCode: 'EST-Z3-PAL-01',
          toCode: 'EST-Z3-SIR-01',
          lengthMeters: 8.5,
          pathD: 'M 160 230 L 160 270 L 205 270',
          labelPos: { x: 182, y: 255 },
        },
        {
          id: 'z3-sec-3',
          code: 'SEC-03',
          name: 'Tramo 3: SIR-01 ➔ SEN-01',
          fromCode: 'EST-Z3-SIR-01',
          toCode: 'EST-Z3-SEN-01',
          lengthMeters: 8,
          pathD: 'M 205 270 L 160 270 L 160 305',
          labelPos: { x: 182, y: 288 },
        },
        {
          id: 'z3-sec-4',
          code: 'SEC-04',
          name: 'Tramo 4: SEN-01 ➔ SEN-02',
          fromCode: 'EST-Z3-SEN-01',
          toCode: 'EST-Z3-SEN-02',
          lengthMeters: 4,
          pathD: 'M 160 305 L 160 345',
          labelPos: { x: 135, y: 325 },
        },
        {
          id: 'z3-sec-5',
          code: 'SEC-05',
          name: 'Tramo 5: SEN-02 ➔ PAL-02',
          fromCode: 'EST-Z3-SEN-02',
          toCode: 'EST-Z3-PAL-02',
          lengthMeters: 7,
          pathD: 'M 160 345 L 160 370 L 205 370',
          labelPos: { x: 182, y: 358 },
        },
        {
          id: 'z3-sec-6',
          code: 'SEC-06',
          name: 'Tramo 6: PAL-02 ➔ SEN-03',
          fromCode: 'EST-Z3-PAL-02',
          toCode: 'EST-Z3-SEN-03',
          lengthMeters: 7,
          pathD: 'M 205 370 L 160 370 L 160 395',
          labelPos: { x: 182, y: 383 },
        },
        {
          id: 'z3-sec-7',
          code: 'SEC-07',
          name: 'Tramo 7: SEN-03 ➔ SIR-02',
          fromCode: 'EST-Z3-SEN-03',
          toCode: 'EST-Z3-SIR-02',
          lengthMeters: 7.5,
          pathD: 'M 160 395 L 160 425 L 205 425',
          labelPos: { x: 182, y: 410 },
        },
      ];
    }
    if (isZ2) {
      return [
        {
          id: 'z2-sec-1',
          code: 'SEC-01',
          name: 'Tramo 1: FACP ➔ SIR-01',
          fromCode: 'EST-FACP-01',
          toCode: 'EST-Z2-SIR-01',
          lengthMeters: 42,
          pathD: 'M 855 82 L 855 450 Q 820 485 740 485',
          labelPos: { x: 805, y: 460 },
        },
        {
          id: 'z2-sec-2',
          code: 'SEC-02',
          name: 'Tramo 2: SIR-01 ➔ PAL-02',
          fromCode: 'EST-Z2-SIR-01',
          toCode: 'EST-Z2-PAL-02',
          lengthMeters: 8,
          pathD: 'M 740 485 L 670 460',
          labelPos: { x: 705, y: 460 },
        },
        {
          id: 'z2-sec-3',
          code: 'SEC-03',
          name: 'Tramo 3: PAL-02 ➔ SEN-03',
          fromCode: 'EST-Z2-PAL-02',
          toCode: 'EST-Z2-SEN-03',
          lengthMeters: 9,
          pathD: 'M 670 460 L 610 520',
          labelPos: { x: 645, y: 495 },
        },
        {
          id: 'z2-sec-4',
          code: 'SEC-04',
          name: 'Tramo 4: SEN-03 ➔ SEN-02',
          fromCode: 'EST-Z2-SEN-03',
          toCode: 'EST-Z2-SEN-02',
          lengthMeters: 11,
          pathD: 'M 610 520 Q 555 535 500 535',
          labelPos: { x: 555, y: 545 },
        },
        {
          id: 'z2-sec-5',
          code: 'SEC-05',
          name: 'Tramo 5: SEN-02 ➔ SEN-01',
          fromCode: 'EST-Z2-SEN-02',
          toCode: 'EST-Z2-SEN-01',
          lengthMeters: 11,
          pathD: 'M 500 535 Q 445 535 390 520',
          labelPos: { x: 445, y: 545 },
        },
        {
          id: 'z2-sec-6',
          code: 'SEC-06',
          name: 'Tramo 6: SEN-01 ➔ SIR-02',
          fromCode: 'EST-Z2-SEN-01',
          toCode: 'EST-Z2-SIR-02',
          lengthMeters: 9,
          pathD: 'M 390 520 L 330 460',
          labelPos: { x: 355, y: 495 },
        },
        {
          id: 'z2-sec-7',
          code: 'SEC-07',
          name: 'Tramo 7: SIR-02 ➔ PAL-01',
          fromCode: 'EST-Z2-SIR-02',
          toCode: 'EST-Z2-PAL-01',
          lengthMeters: 10,
          pathD: 'M 330 460 L 240 485',
          labelPos: { x: 285, y: 460 },
        },
      ];
    }
    // Default: Zona 1 (Occidental)
    return [
      {
        id: 'z1-sec-1',
        code: 'SEC-01',
        name: 'Tramo 1: FACP ➔ SIR-01',
        fromCode: 'EST-FACP-01',
        toCode: 'EST-Z1-SIR-01',
        lengthMeters: 16,
        pathD: 'M 855 82 L 855 125 L 740 155',
        labelPos: { x: 805, y: 130 },
      },
      {
        id: 'z1-sec-2',
        code: 'SEC-02',
        name: 'Tramo 2: SIR-01 ➔ PAL-02',
        fromCode: 'EST-Z1-SIR-01',
        toCode: 'EST-Z1-PAL-02',
        lengthMeters: 8,
        pathD: 'M 740 155 L 670 180',
        labelPos: { x: 705, y: 180 },
      },
      {
        id: 'z1-sec-3',
        code: 'SEC-03',
        name: 'Tramo 3: PAL-02 ➔ SEN-03',
        fromCode: 'EST-Z1-PAL-02',
        toCode: 'EST-Z1-SEN-03',
        lengthMeters: 9,
        pathD: 'M 670 180 L 610 115',
        labelPos: { x: 645, y: 155 },
      },
      {
        id: 'z1-sec-4',
        code: 'SEC-04',
        name: 'Tramo 4: SEN-03 ➔ SEN-02',
        fromCode: 'EST-Z1-SEN-03',
        toCode: 'EST-Z1-SEN-02',
        lengthMeters: 11,
        pathD: 'M 610 115 Q 555 100 500 100',
        labelPos: { x: 555, y: 90 },
      },
      {
        id: 'z1-sec-5',
        code: 'SEC-05',
        name: 'Tramo 5: SEN-02 ➔ SEN-01',
        fromCode: 'EST-Z1-SEN-02',
        toCode: 'EST-Z1-SEN-01',
        lengthMeters: 11,
        pathD: 'M 500 100 Q 445 100 390 115',
        labelPos: { x: 445, y: 90 },
      },
      {
        id: 'z1-sec-6',
        code: 'SEC-06',
        name: 'Tramo 6: SEN-01 ➔ SIR-02',
        fromCode: 'EST-Z1-SEN-01',
        toCode: 'EST-Z1-SIR-02',
        lengthMeters: 9,
        pathD: 'M 390 115 L 330 180',
        labelPos: { x: 355, y: 155 },
      },
      {
        id: 'z1-sec-7',
        code: 'SEC-07',
        name: 'Tramo 7: SIR-02 ➔ PAL-01',
        fromCode: 'EST-Z1-SIR-02',
        toCode: 'EST-Z1-PAL-01',
        lengthMeters: 10,
        pathD: 'M 330 180 L 240 155',
        labelPos: { x: 285, y: 180 },
      },
    ];
  };

  const sections = getSectionsForZone();

  const getCoordinatesForZone = (item: FloorItem, index: number) => {
    const code = item.code.toUpperCase();

    // Central FACP always in Control Room
    if (code.includes('FACP')) {
      return { cx: 855, cy: 82, label: 'Sala de Control FACP (Sistema Central)' };
    }
    // Cuarto de Bombas
    if (code.includes('BOM')) {
      return { cx: 145, cy: 565, label: 'Cuarto de Bombas RCI' };
    }

    if (isZ4) {
      if (code.includes('PAL-01')) return { cx: 855, cy: 230, label: 'Zona 4 · Estación Manual 1' };
      if (code.includes('SIR-01')) return { cx: 815, cy: 270, label: 'Zona 4 · Sirena 1' };
      if (code.includes('SEN-01')) return { cx: 855, cy: 305, label: 'Zona 4 · Sensor Óptico 1' };
      if (code.includes('SEN-02')) return { cx: 855, cy: 345, label: 'Zona 4 · Sensor Térmico 2' };
      if (code.includes('PAL-02')) return { cx: 815, cy: 370, label: 'Zona 4 · Estación Manual 2' };
      if (code.includes('SEN-03')) return { cx: 855, cy: 395, label: 'Zona 4 · Sensor 3' };
      if (code.includes('SIR-02')) return { cx: 815, cy: 425, label: 'Zona 4 · Sirena 2' };
      if (code.includes('AUT')) return { cx: 900, cy: 330, label: 'Zona 4 · Equipo Autónomo (Inalámbrico)' };
      return { cx: 855, cy: 250 + ((index * 30) % 150), label: 'Zona 4 · Dispositivo' };
    }

    if (isZ3) {
      if (code.includes('PAL-01')) return { cx: 160, cy: 230, label: 'Zona 3 · Estación Manual 1' };
      if (code.includes('SIR-01')) return { cx: 205, cy: 270, label: 'Zona 3 · Sirena 1' };
      if (code.includes('SEN-01')) return { cx: 160, cy: 305, label: 'Zona 3 · Sensor Óptico 1' };
      if (code.includes('SEN-02')) return { cx: 160, cy: 345, label: 'Zona 3 · Sensor Térmico 2' };
      if (code.includes('PAL-02')) return { cx: 205, cy: 370, label: 'Zona 3 · Estación Manual 2' };
      if (code.includes('SEN-03')) return { cx: 160, cy: 395, label: 'Zona 3 · Sensor 3' };
      if (code.includes('SIR-02')) return { cx: 205, cy: 425, label: 'Zona 3 · Sirena 2' };
      if (code.includes('AUT')) return { cx: 115, cy: 330, label: 'Zona 3 · Equipo Autónomo (Inalámbrico)' };
      return { cx: 160, cy: 250 + ((index * 30) % 150), label: 'Zona 3 · Dispositivo' };
    }

    if (isZ2) {
      if (code.includes('PAL-01')) return { cx: 240, cy: 485, label: 'Zona 2 · Estación Manual 1' };
      if (code.includes('SIR-01')) return { cx: 740, cy: 485, label: 'Zona 2 · Sirena 1' };
      if (code.includes('SEN-01')) return { cx: 390, cy: 520, label: 'Zona 2 · Sensor Óptico 1' };
      if (code.includes('SEN-02')) return { cx: 500, cy: 535, label: 'Zona 2 · Sensor Térmico 2' };
      if (code.includes('SEN-03')) return { cx: 610, cy: 520, label: 'Zona 2 · Sensor 3' };
      if (code.includes('PAL-02')) return { cx: 670, cy: 460, label: 'Zona 2 · Estación Manual 2' };
      if (code.includes('SIR-02')) return { cx: 330, cy: 460, label: 'Zona 2 · Sirena 2' };
      if (code.includes('AUT')) return { cx: 500, cy: 470, label: 'Zona 2 · Equipo Autónomo (Inalámbrico)' };
      return { cx: 500, cy: 535, label: 'Zona 2 · Dispositivo' };
    }

    // Default: ZONA 1 (Gradería Occidental & Prensa)
    if (code.includes('PAL-01')) return { cx: 240, cy: 155, label: 'Zona 1 · Estación Manual 1' };
    if (code.includes('SIR-01')) return { cx: 740, cy: 155, label: 'Zona 1 · Sirena 1' };
    if (code.includes('SEN-01')) return { cx: 390, cy: 115, label: 'Zona 1 · Sensor Óptico 1' };
    if (code.includes('SEN-02')) return { cx: 500, cy: 100, label: 'Zona 1 · Sensor Térmico 2' };
    if (code.includes('SEN-03')) return { cx: 610, cy: 115, label: 'Zona 1 · Sensor Haz Beam 3' };
    if (code.includes('PAL-02')) return { cx: 670, cy: 180, label: 'Zona 1 · Estación Manual 2' };
    if (code.includes('SIR-02')) return { cx: 330, cy: 180, label: 'Zona 1 · Sirena 2' };
    if (code.includes('AUT')) return { cx: 500, cy: 170, label: 'Zona 1 · Equipo Autónomo (Inalámbrico)' };
    return { cx: 500, cy: 100, label: 'Zona 1 · Dispositivo' };
  };

  const discreteDevices = items.filter((i) => i.type !== 'tuberia' && i.type !== 'cableado');
  const activeDisplayNode = hoveredNode || activeSelected;

  const handleSectionClick = (sec: BlueprintSection) => {
    setSelectedSection(sec);
    setShowTramoPrompt(true);
  };

  const getSectionTuberiaItem = (sec: BlueprintSection): FloorItem => {
    return {
      id: `em-tub-${sec.id}`,
      projectId: 'estadio-metropolitano',
      code: `EST-TUB-${sec.code}`,
      type: 'tuberia',
      name: `Tubería Conduit EMT 1" · ${sec.name}`,
      model: 'Conduit EMT 1 pulg Heavy Duty C-80 Galvanizada',
      zone: currentZone,
      status: 'pending',
      quantity: sec.lengthMeters,
      unit: 'Metros Lineales',
      unitPrice: 46000,
      notes: `Canalización física rígida por tramo desde ${sec.fromCode} hasta ${sec.toCode}.`,
    };
  };

  const getSectionCableItem = (sec: BlueprintSection): FloorItem => {
    return {
      id: `em-cab-${sec.id}`,
      projectId: 'estadio-metropolitano',
      code: `EST-CAB-${sec.code}`,
      type: 'cableado',
      name: `Cable FPLR Blindado 2x14 AWG · ${sec.name}`,
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: currentZone,
      status: 'pending',
      quantity: Math.round(sec.lengthMeters * 1.05),
      unit: 'Metros',
      unitPrice: 14500,
      notes: `Lazo SLC direccionable tendido en tubería Conduit desde ${sec.fromCode} hasta ${sec.toCode}.`,
    };
  };

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
            <span>Tubería Conduit EMT (Por Secciones)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
            <span>Equipo Autónomo (Sin Tubería / Batería)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
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
            strokeWidth="3"
          />

          {/* Grandstand Tiers Background */}
          <ellipse cx="500" cy="325" rx="420" ry="255" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="5,3" />
          <ellipse cx="500" cy="325" rx="380" ry="220" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="5,3" />

          {/* Gradería Labels & Sectors */}
          {/* Zona 1: Occidental (Superior) */}
          <path
            d="M 200 130 Q 500 70 800 130"
            fill="none"
            stroke={isZ1 ? '#38bdf8' : '#334155'}
            strokeWidth={isZ1 ? '4' : '2'}
            strokeOpacity={isZ1 ? 0.9 : 0.4}
          />
          <text
            x="500"
            y="70"
            fill={isZ1 ? '#38bdf8' : '#64748b'}
            fontSize="11"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
          >
            ZONA 1 &middot; TRIBUNA OCCIDENTAL &amp; CABINAS PRENSA
          </text>

          {/* Zona 2: Oriental (Inferior) */}
          <path
            d="M 200 520 Q 500 580 800 520"
            fill="none"
            stroke={isZ2 ? '#38bdf8' : '#334155'}
            strokeWidth={isZ2 ? '4' : '2'}
            strokeOpacity={isZ2 ? 0.9 : 0.4}
          />
          <text
            x="500"
            y="595"
            fill={isZ2 ? '#38bdf8' : '#64748b'}
            fontSize="11"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
          >
            ZONA 2 &middot; TRIBUNA ORIENTAL &amp; ACCESOS GENERALES
          </text>

          {/* Zona 3: Norte (Izquierda) */}
          <path
            d="M 160 170 Q 110 325 160 480"
            fill="none"
            stroke={isZ3 ? '#38bdf8' : '#334155'}
            strokeWidth={isZ3 ? '4' : '2'}
            strokeOpacity={isZ3 ? 0.9 : 0.4}
          />
          <text
            x="115"
            y="325"
            fill={isZ3 ? '#38bdf8' : '#64748b'}
            fontSize="11"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
            transform="rotate(-90, 115, 325)"
          >
            ZONA 3 &middot; TRIBUNA NORTE
          </text>

          {/* Zona 4: Sur (Derecha) */}
          <path
            d="M 840 170 Q 890 325 840 480"
            fill="none"
            stroke={isZ4 ? '#38bdf8' : '#334155'}
            strokeWidth={isZ4 ? '4' : '2'}
            strokeOpacity={isZ4 ? 0.9 : 0.4}
          />
          <text
            x="885"
            y="325"
            fill={isZ4 ? '#38bdf8' : '#64748b'}
            fontSize="11"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
            transform="rotate(90, 885, 325)"
          >
            ZONA 4 &middot; TRIBUNA SUR
          </text>

          {/* Athletic Running Track */}
          <ellipse cx="500" cy="325" rx="330" ry="175" fill="#7f1d1d" fillOpacity="0.25" stroke="#991b1b" strokeWidth="2" />
          <ellipse cx="500" cy="325" rx="310" ry="155" fill="none" stroke="#b91c1c" strokeWidth="1" strokeDasharray="6,4" />

          {/* Soccer Grass Pitch */}
          <rect
            x="240"
            y="190"
            width="520"
            height="270"
            rx="8"
            fill="#064e3b"
            fillOpacity="0.45"
            stroke="#059669"
            strokeWidth="2"
          />
          <line x1="500" y1="190" x2="500" y2="460" stroke="#059669" strokeWidth="1.5" />
          <circle cx="500" cy="325" r="45" fill="none" stroke="#059669" strokeWidth="1.5" />
          <circle cx="500" cy="325" r="3" fill="#10b981" />

          {/* Pitch Goals and Boxes */}
          <rect x="240" y="250" width="60" height="150" fill="none" stroke="#059669" strokeWidth="1.5" />
          <rect x="700" y="250" width="60" height="150" fill="none" stroke="#059669" strokeWidth="1.5" />

          {/* Control Room / Central FACP */}
          <rect
            x="805"
            y="55"
            width="100"
            height="45"
            rx="6"
            fill="#0f172a"
            stroke="#10b981"
            strokeWidth="2"
          />
          <text x="855" y="73" fill="#10b981" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            SISTEMA CENTRAL
          </text>
          <text x="855" y="87" fill="#6ee7b7" fontSize="8" fontFamily="monospace" textAnchor="middle">
            SALA FACP &bull; NFPA 72
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
          {/* TECHNICAL NODES: FACP, 3 SENSORES, 1 AUTÓNOMO, 2 PULL, 2 SIRENS */}
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
                      Tubería Conduit EMT 1" (Sección {selectedSection.code})
                    </span>
                    <span className="text-[11px] text-slate-400 block font-sans">
                      Canalización física rígida de {selectedSection.lengthMeters}m entre {selectedSection.fromCode} y {selectedSection.toCode}.
                    </span>
                    <span className="text-[10px] text-cyan-400 font-bold block pt-0.5">
                      Código: EST-TUB-{selectedSection.code} &bull; {selectedSection.lengthMeters} m
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
                      Código: EST-CAB-{selectedSection.code} &bull; {Math.round(selectedSection.lengthMeters * 1.05)} m
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Technical Detail Card */}
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
            Zona Activa: <strong className="text-brand-deep">{currentZone}</strong>
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
