'use client';

import React, { useState } from 'react';
import { FloorItem } from '@/src/schemas/floor-item.schema';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Clock,
  Layers,
  X,
} from 'lucide-react';

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
  conduitDiameter: string;
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
  const [zoomScale, setZoomScale] = useState(1);

  // Filter toggles
  const [showPipes, setShowPipes] = useState(true);
  const [showDetectors, setShowDetectors] = useState(true);
  const [showPalancas, setShowPalancas] = useState(true);
  const [showSirenas, setShowSirenas] = useState(true);
  const [showPaneles, setShowPaneles] = useState(true);

  // Identify active level from currentZone string
  const zoneNormalized = currentZone.toLowerCase();
  const isCancha = zoneNormalized.includes('cancha');
  const isMezanine = zoneNormalized.includes('mezzanine') || zoneNormalized.includes('mezanine');
  const isNivel3 = zoneNormalized.includes('nivel 3');
  const isNivel1 = !isCancha && !isMezanine && !isNivel3; // default or explicit "nivel 1"

  const activeSelected = selectedItemId
    ? items.find((i) => i.code === selectedItemId || i.id === selectedItemId) || internalSelected
    : internalSelected;

  const handleSelect = (item: FloorItem) => {
    setInternalSelected(item);
    setSelectedSection(null);
    if (onSelectItem) {
      onSelectItem(item);
    }
  };

  const handleZoom = (delta: number) => {
    setZoomScale((prev) => Math.min(Math.max(prev + delta, 0.7), 2.5));
  };

  const handleResetZoom = () => {
    setZoomScale(1);
  };

  // Sections of conduit (Tubería roja con cable FPLR) for active level
  const getSectionsForLevel = (): BlueprintSection[] => {
    if (isCancha) {
      return [
        {
          id: 'can-sec-1',
          code: 'CAN-SEC-01',
          name: 'Cárcamo Tramo Sur: Boca Sur ➔ Túnel Sur',
          fromCode: 'EST-CAN-PAL-01',
          toCode: 'EST-CAN-SEN-01',
          lengthMeters: 45,
          conduitDiameter: '3/4"',
          pathD: 'M 290 400 L 250 400 L 200 400',
          labelPos: { x: 245, y: 390 },
        },
        {
          id: 'can-sec-2',
          code: 'CAN-SEC-02',
          name: 'Cárcamo Anillo Suroccidental: Túnel Sur ➔ Hospitality A',
          fromCode: 'EST-CAN-SEN-01',
          toCode: 'EST-CAN-SEN-03',
          lengthMeters: 65,
          conduitDiameter: '3/4"',
          pathD: 'M 200 400 Q 220 320 250 260',
          labelPos: { x: 220, y: 320 },
        },
        {
          id: 'can-sec-3',
          code: 'CAN-SEC-03',
          name: 'Cárcamo Anillo Occidental: Hospitality A ➔ Cuarto Técnico',
          fromCode: 'EST-CAN-SEN-03',
          toCode: 'EST-CAN-SEN-05',
          lengthMeters: 90,
          conduitDiameter: '3/4"',
          pathD: 'M 250 260 Q 420 180 600 185',
          labelPos: { x: 420, y: 195 },
        },
        {
          id: 'can-sec-4',
          code: 'CAN-SEC-04',
          name: 'Cárcamo Anillo Noroccidental: Cuarto Técnico ➔ Hospitality B',
          fromCode: 'EST-CAN-SEN-05',
          toCode: 'EST-CAN-SEN-04',
          lengthMeters: 90,
          conduitDiameter: '3/4"',
          pathD: 'M 600 185 Q 780 180 950 260',
          labelPos: { x: 780, y: 195 },
        },
        {
          id: 'can-sec-5',
          code: 'CAN-SEC-05',
          name: 'Cárcamo Tramo Norte: Hospitality B ➔ Túnel Norte',
          fromCode: 'EST-CAN-SEN-04',
          toCode: 'EST-CAN-SEN-02',
          lengthMeters: 65,
          conduitDiameter: '3/4"',
          pathD: 'M 950 260 Q 980 320 1000 400',
          labelPos: { x: 980, y: 320 },
        },
        {
          id: 'can-sec-6',
          code: 'CAN-SEC-06',
          name: 'Cárcamo Anillo Oriental: Túnel Norte ➔ Túnel Sur (Retorno)',
          fromCode: 'EST-CAN-SEN-02',
          toCode: 'EST-CAN-PAL-01',
          lengthMeters: 280,
          conduitDiameter: '3/4"',
          pathD: 'M 1000 400 Q 950 620 600 625 Q 250 620 200 400',
          labelPos: { x: 600, y: 640 },
        },
      ];
    }

    if (isMezanine) {
      return [
        {
          id: 'mez-sec-1',
          code: 'MEZ-SEC-01',
          name: 'Anillo VIP Occidental: Escalera Sur ➔ Palcos VIP',
          fromCode: 'EST-MEZ-PAL-02',
          toCode: 'EST-MEZ-PAL-01',
          lengthMeters: 55,
          conduitDiameter: '3/4"',
          pathD: 'M 280 270 Q 440 140 600 140',
          labelPos: { x: 440, y: 160 },
        },
        {
          id: 'mez-sec-2',
          code: 'MEZ-SEC-02',
          name: 'Ramal Salón VIP Central: Palcos VIP ➔ Área VIP Central',
          fromCode: 'EST-MEZ-PAL-01',
          toCode: 'EST-MEZ-SEN-01',
          lengthMeters: 18,
          conduitDiameter: '3/4"',
          pathD: 'M 600 140 L 600 170',
          labelPos: { x: 615, y: 155 },
        },
        {
          id: 'mez-sec-3',
          code: 'MEZ-SEC-03',
          name: 'Ramal Prensa & Escenarios: Área VIP ➔ Jefatura Escenarios',
          fromCode: 'EST-MEZ-SEN-01',
          toCode: 'EST-MEZ-SEN-04',
          lengthMeters: 28,
          conduitDiameter: '3/4"',
          pathD: 'M 600 170 L 520 170 L 450 190',
          labelPos: { x: 485, y: 175 },
        },
        {
          id: 'mez-sec-4',
          code: 'MEZ-SEC-04',
          name: 'Ramal Museos: Área VIP ➔ Puente Museos ➔ Museo Selección',
          fromCode: 'EST-MEZ-SEN-01',
          toCode: 'EST-MEZ-SEN-02',
          lengthMeters: 42,
          conduitDiameter: '3/4"',
          pathD: 'M 600 170 L 600 225 L 740 190',
          labelPos: { x: 670, y: 215 },
        },
        {
          id: 'mez-sec-5',
          code: 'MEZ-SEC-05',
          name: 'Anillo Mezanine Oriental: Museo Selección ➔ Retorno Sur',
          fromCode: 'EST-MEZ-SEN-02',
          toCode: 'EST-MEZ-PAL-02',
          lengthMeters: 210,
          conduitDiameter: '3/4"',
          pathD: 'M 740 190 Q 950 320 920 460 Q 600 660 280 460 L 280 270',
          labelPos: { x: 600, y: 645 },
        },
      ];
    }

    if (isNivel3) {
      return [
        {
          id: 'n3-sec-1',
          code: 'N3-SEC-01',
          name: 'Corona Occidental: Caracola Suroccidental ➔ Gradería Prensa',
          fromCode: 'EST-N3-PAL-02',
          toCode: 'EST-N3-SEN-02',
          lengthMeters: 75,
          conduitDiameter: '3/4"',
          pathD: 'M 320 230 Q 460 120 600 120 L 600 180',
          labelPos: { x: 460, y: 135 },
        },
        {
          id: 'n3-sec-2',
          code: 'N3-SEC-02',
          name: 'Corona Noroccidental: Gradería Prensa ➔ Caracola Noroccidental',
          fromCode: 'EST-N3-SEN-02',
          toCode: 'EST-N3-PAL-01',
          lengthMeters: 75,
          conduitDiameter: '3/4"',
          pathD: 'M 600 180 L 600 120 Q 740 120 880 230',
          labelPos: { x: 740, y: 135 },
        },
        {
          id: 'n3-sec-3',
          code: 'N3-SEC-03',
          name: 'Corona Oriental Norte: Caracola Noroccidental ➔ Caracola Nororiental',
          fromCode: 'EST-N3-PAL-01',
          toCode: 'EST-N3-PAL-03',
          lengthMeters: 90,
          conduitDiameter: '3/4"',
          pathD: 'M 880 230 Q 1060 400 880 570',
          labelPos: { x: 990, y: 400 },
        },
        {
          id: 'n3-sec-4',
          code: 'N3-SEC-04',
          name: 'Corona Oriental Sur: Caracola Nororiental ➔ Baños Oriental ➔ Caracola Suroriental',
          fromCode: 'EST-N3-PAL-03',
          toCode: 'EST-N3-PAL-04',
          lengthMeters: 140,
          conduitDiameter: '3/4"',
          pathD: 'M 880 570 Q 600 700 320 570',
          labelPos: { x: 600, y: 680 },
        },
        {
          id: 'n3-sec-5',
          code: 'N3-SEC-05',
          name: 'Corona Sur Cierre: Caracola Suroriental ➔ Caracola Suroccidental',
          fromCode: 'EST-N3-PAL-04',
          toCode: 'EST-N3-PAL-02',
          lengthMeters: 90,
          conduitDiameter: '3/4"',
          pathD: 'M 320 570 Q 140 400 320 230',
          labelPos: { x: 210, y: 400 },
        },
      ];
    }

    // Default: NIVEL 1 (+42.08 m) — Plancha SDI A101 (Cerebro Operativo)
    return [
      {
        id: 'n1-sec-1',
        code: 'N1-SEC-01',
        name: 'Troncal 1" EMT: Centro de Control FACP-02 ➔ Subestación Occ. FACP-03',
        fromCode: 'EST-N1-FACP-02',
        toCode: 'EST-N1-FACP-03',
        lengthMeters: 85,
        conduitDiameter: '1"',
        pathD: 'M 420 140 Q 600 110 780 140',
        labelPos: { x: 600, y: 115 },
      },
      {
        id: 'n1-sec-2',
        code: 'N1-SEC-02',
        name: 'Ramal 3/4" EMT: Camerinos Selección Colombia & Junior',
        fromCode: 'EST-N1-FACP-02',
        toCode: 'EST-N1-SEN-JUN',
        lengthMeters: 45,
        conduitDiameter: '3/4"',
        pathD: 'M 420 140 L 480 155 L 600 155 L 720 155',
        labelPos: { x: 550, y: 165 },
      },
      {
        id: 'n1-sec-3',
        code: 'N1-SEC-03',
        name: 'Ramal 3/4" EMT: Sala de Prensa & Médica',
        fromCode: 'EST-N1-PAL-02',
        toCode: 'EST-N1-SEN-PREN',
        lengthMeters: 30,
        conduitDiameter: '3/4"',
        pathD: 'M 530 140 L 540 175 L 600 155',
        labelPos: { x: 570, y: 185 },
      },
      {
        id: 'n1-sec-4',
        code: 'N1-SEC-04',
        name: 'Troncal 1" EMT: FACP-02 ➔ Liga de Boxeo (Sur)',
        fromCode: 'EST-N1-FACP-02',
        toCode: 'EST-N1-SEN-BOX',
        lengthMeters: 75,
        conduitDiameter: '1"',
        pathD: 'M 420 140 Q 240 220 160 400',
        labelPos: { x: 260, y: 260 },
      },
      {
        id: 'n1-sec-5',
        code: 'N1-SEC-05',
        name: 'Troncal 1" EMT: FACP-03 ➔ Liga de Gimnasia (Norte)',
        fromCode: 'EST-N1-FACP-03',
        toCode: 'EST-N1-SEN-GIM',
        lengthMeters: 75,
        conduitDiameter: '1"',
        pathD: 'M 780 140 Q 960 220 1040 400',
        labelPos: { x: 940, y: 260 },
      },
      {
        id: 'n1-sec-6',
        code: 'N1-SEC-06',
        name: 'Troncal 1" EMT: Sur ➔ Oriental ➔ Anunciador Remoto AR',
        fromCode: 'EST-N1-SEN-BOX',
        toCode: 'EST-N1-AR-01',
        lengthMeters: 130,
        conduitDiameter: '1"',
        pathD: 'M 160 400 Q 250 640 600 685',
        labelPos: { x: 380, y: 620 },
      },
      {
        id: 'n1-sec-7',
        code: 'N1-SEC-07',
        name: 'Troncal 1" EMT: Norte ➔ Oriental ➔ Anunciador Remoto AR',
        fromCode: 'EST-N1-SEN-GIM',
        toCode: 'EST-N1-AR-01',
        lengthMeters: 130,
        conduitDiameter: '1"',
        pathD: 'M 1040 400 Q 950 640 600 685',
        labelPos: { x: 820, y: 620 },
      },
      {
        id: 'n1-sec-8',
        code: 'N1-SEC-08',
        name: 'Ramal 3/4" EMT: Riser Subida/Bajada RCI Bombas',
        fromCode: 'EST-N1-FACP-02',
        toCode: 'EST-N1-REG-PAS',
        lengthMeters: 25,
        conduitDiameter: '3/4"',
        pathD: 'M 420 140 L 340 230',
        labelPos: { x: 365, y: 185 },
      },
    ];
  };

  const sections = getSectionsForLevel();

  // Coordinates for discrete equipment nodes per level
  const getNodeCoordinates = (item: FloorItem) => {
    const code = item.code.toUpperCase();

    if (isCancha) {
      if (code.includes('SEN-01')) return { cx: 200, cy: 400, label: 'Túnel Acceso Sur' };
      if (code.includes('SEN-02')) return { cx: 1000, cy: 400, label: 'Túnel Acceso Norte' };
      if (code.includes('SEN-03')) return { cx: 250, cy: 260, label: 'Túnel Hospitality A' };
      if (code.includes('SEN-04')) return { cx: 950, cy: 260, label: 'Túnel Hospitality B' };
      if (code.includes('SEN-05')) return { cx: 600, cy: 185, label: 'Cuarto Técnico Cárcamo' };
      if (code.includes('PAL-01')) return { cx: 290, cy: 400, label: 'Boca Túnel Sur' };
      if (code.includes('PAL-02')) return { cx: 910, cy: 400, label: 'Boca Túnel Norte' };
      if (code.includes('SIR-01')) return { cx: 240, cy: 370, label: 'Sirena Túnel Sur' };
      if (code.includes('SIR-02')) return { cx: 960, cy: 370, label: 'Sirena Túnel Norte' };
      return { cx: 600, cy: 400, label: item.name };
    }

    if (isMezanine) {
      if (code.includes('SEN-01')) return { cx: 600, cy: 170, label: 'Área VIP Central' };
      if (code.includes('SEN-02')) return { cx: 740, cy: 190, label: 'Museo Selección Mezanine' };
      if (code.includes('SEN-03')) return { cx: 600, cy: 225, label: 'Puente Conexión Museos' };
      if (code.includes('SEN-04')) return { cx: 450, cy: 190, label: 'Jefatura Escenarios' };
      if (code.includes('SEN-05')) return { cx: 520, cy: 170, label: 'Sala de Juntas VIP' };
      if (code.includes('PAL-01')) return { cx: 600, cy: 140, label: 'Acceso Palcos VIP' };
      if (code.includes('PAL-02')) return { cx: 280, cy: 270, label: 'Escalera Mezanine Sur' };
      if (code.includes('SIR-01')) return { cx: 650, cy: 170, label: 'Sirena Estrobo VIP' };
      if (code.includes('MOD-REL')) return { cx: 380, cy: 210, label: 'Módulo Relevo Audio/AC' };
      return { cx: 600, cy: 400, label: item.name };
    }

    if (isNivel3) {
      if (code.includes('SEN-01')) return { cx: 460, cy: 150, label: 'Baños Occidental Alta' };
      if (code.includes('SEN-02')) return { cx: 600, cy: 180, label: 'Gradería Prensa Alta' };
      if (code.includes('SEN-03')) return { cx: 740, cy: 150, label: 'Puntos Fijos Occ.' };
      if (code.includes('SEN-04')) return { cx: 600, cy: 650, label: 'Baños Oriental Alta' };
      if (code.includes('PAL-01')) return { cx: 880, cy: 230, label: 'Caracola Noroccidental' };
      if (code.includes('PAL-02')) return { cx: 320, cy: 230, label: 'Caracola Suroccidental' };
      if (code.includes('PAL-03')) return { cx: 880, cy: 570, label: 'Caracola Nororiental' };
      if (code.includes('PAL-04')) return { cx: 320, cy: 570, label: 'Caracola Suroriental' };
      if (code.includes('SIR-01')) return { cx: 600, cy: 130, label: 'Sirena Corona Occidental' };
      if (code.includes('SIR-02')) return { cx: 600, cy: 675, label: 'Sirena Corona Oriental' };
      return { cx: 600, cy: 400, label: item.name };
    }

    // Default: NIVEL 1 (+42.08 m)
    if (code.includes('FACP-02')) return { cx: 420, cy: 140, label: 'Panel No. 2 (Centro Control)' };
    if (code.includes('FACP-03')) return { cx: 780, cy: 140, label: 'Panel No. 3 (Subestación Occ.)' };
    if (code.includes('AR-01')) return { cx: 600, cy: 685, label: 'Anunciador Remoto AR (Taquillas)' };
    if (code.includes('SEN-COL')) return { cx: 480, cy: 155, label: 'Camerino Selección Colombia' };
    if (code.includes('SEN-JUN')) return { cx: 720, cy: 155, label: 'Camerino Junior' };
    if (code.includes('SEN-VIS1')) return { cx: 360, cy: 175, label: 'Camerino Visitantes 1' };
    if (code.includes('SEN-VIS2')) return { cx: 840, cy: 175, label: 'Camerino Visitantes 2' };
    if (code.includes('SEN-PREN')) return { cx: 600, cy: 155, label: 'Sala de Prensa (252 m²)' };
    if (code.includes('SEN-MED')) return { cx: 540, cy: 175, label: 'Sala Médica & Antidopaje' };
    if (code.includes('SEN-BOX')) return { cx: 160, cy: 400, label: 'Liga de Boxeo' };
    if (code.includes('SEN-GIM')) return { cx: 1040, cy: 400, label: 'Liga de Gimnasia' };
    if (code.includes('SEN-HCO1')) return { cx: 300, cy: 200, label: 'Subestación Eléctrica' };
    if (code.includes('SEN-HCO2')) return { cx: 270, cy: 240, label: 'Central Generación Diésel' };
    if (code.includes('SEN-SH1')) return { cx: 900, cy: 200, label: 'Taller de Mantenimiento' };
    if (code.includes('PAL-01')) return { cx: 600, cy: 120, label: 'Acceso Occidental Principal' };
    if (code.includes('PAL-02')) return { cx: 530, cy: 140, label: 'Pasillo Camerinos' };
    if (code.includes('PAL-03')) return { cx: 600, cy: 660, label: 'Acceso Oriental' };
    if (code.includes('SIR-01')) return { cx: 450, cy: 180, label: 'Sirena Estrobo Camerinos' };
    if (code.includes('SIR-02')) return { cx: 650, cy: 180, label: 'Sirena Estrobo Prensa' };
    if (code.includes('SIR-03')) return { cx: 160, cy: 460, label: 'Sirena Ligas Deportivas' };
    if (code.includes('REG-PAS')) return { cx: 340, cy: 230, label: 'Riser Cancha/Mezanine' };

    return { cx: 600, cy: 400, label: item.name };
  };

  const discreteDevices = items.filter((i) => i.type !== 'tuberia' && i.type !== 'cableado');
  const activeDisplayNode = hoveredNode || activeSelected;

  const handleSectionClick = (sec: BlueprintSection) => {
    setSelectedSection(sec);
    setInternalSelected(null);
  };

  return (
    <div className="relative w-full rounded-2xl border border-surface-border bg-white p-5 overflow-hidden shadow-sm">
      {/* Top Header & Level Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-surface-border text-xs">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
          <div>
            <h3 className="font-mono font-bold uppercase text-brand-deep tracking-wide flex items-center gap-2">
              <span>Plano Técnico de Red Contra Incendios &middot; SDI</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-red-50 text-red-700 font-mono font-bold border border-red-200">
                {currentZone}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              Arquitectura bloqueada en gris &middot; Canalización y cableado en rojo técnico NFPA 72
            </p>
          </div>
        </div>

        {/* View Controls & Zoom */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-slate-700">
          <button
            onClick={() => handleZoom(0.15)}
            className="p-1.5 rounded-lg hover:bg-white transition-all"
            title="Acercar plano (+)"
          >
            <ZoomIn className="w-4 h-4 text-slate-700" />
          </button>
          <button
            onClick={() => handleZoom(-0.15)}
            className="p-1.5 rounded-lg hover:bg-white transition-all"
            title="Alejar plano (-)"
          >
            <ZoomOut className="w-4 h-4 text-slate-700" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 rounded-lg hover:bg-white transition-all font-mono text-[10px] px-2"
            title="Restablecer vista 100%"
          >
            <RotateCcw className="w-3.5 h-3.5 inline mr-1 text-slate-500" />
            {Math.round(zoomScale * 100)}%
          </button>
        </div>
      </div>

      {/* Blueprint Legend Bar (Convenciones SDI exactas del plano) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-mono">
        <div className="flex items-center gap-1 text-slate-700 font-bold uppercase">
          <Layers className="w-3.5 h-3.5 text-red-600" />
          <span>Convenciones:</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-slate-700">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showPipes}
              onChange={(e) => setShowPipes(e.target.checked)}
              className="rounded text-red-600 focus:ring-0"
            />
            <span className="w-4 h-1 bg-red-600 rounded inline-block"></span>
            <span>Tubería EMT & Cable (Rojo)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showDetectors}
              onChange={(e) => setShowDetectors(e.target.checked)}
              className="rounded text-red-600 focus:ring-0"
            />
            <span className="w-4 h-4 rounded-full border-2 border-red-600 bg-white text-[9px] font-bold text-red-600 flex items-center justify-center">
              S
            </span>
            <span>Detector Humo / Térmico</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showPalancas}
              onChange={(e) => setShowPalancas(e.target.checked)}
              className="rounded text-red-600 focus:ring-0"
            />
            <span className="w-3.5 h-3.5 rounded bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
              F
            </span>
            <span>Estación Manual</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showSirenas}
              onChange={(e) => setShowSirenas(e.target.checked)}
              className="rounded text-red-600 focus:ring-0"
            />
            <span className="w-4 h-3 rounded bg-red-600 text-amber-200 text-[8px] font-bold flex items-center justify-center">
              ⚡
            </span>
            <span>Sirena Estrobo</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showPaneles}
              onChange={(e) => setShowPaneles(e.target.checked)}
              className="rounded text-red-600 focus:ring-0"
            />
            <span className="px-1.5 py-0.5 rounded bg-red-700 text-white text-[9px] font-bold">
              FACP
            </span>
            <span>Panel de Incendio / AR</span>
          </label>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full overflow-hidden bg-white rounded-xl border border-slate-300 flex justify-center shadow-inner">
        <svg
          viewBox="0 0 1200 800"
          className="w-full max-w-[1150px] h-auto select-none transition-transform duration-150"
          style={{ transform: `scale(${zoomScale})` }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ========================================================================= */}
          {/* CAPA 1: ARQUITECTURA BLOQUEADA EN TONOS GRISES (LOCKED CAD ARCHITECTURE) */}
          {/* ========================================================================= */}
          <g className="pointer-events-none select-none">
            {/* Background Sheet Tint */}
            <rect width="1200" height="800" fill="#fdfdfd" />

            {/* Subtle Drafting Grid */}
            <defs>
              <pattern id="cadGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="1200" height="800" fill="url(#cadGrid)" opacity="0.8" />

            {/* Radiating Column Axes (Ejes 1 al 56) */}
            <g stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,4">
              <line x1="600" y1="400" x2="600" y2="40" />
              <line x1="600" y1="400" x2="600" y2="760" />
              <line x1="600" y1="400" x2="60" y2="400" />
              <line x1="600" y1="400" x2="1140" y2="400" />
              <line x1="600" y1="400" x2="200" y2="150" />
              <line x1="600" y1="400" x2="1000" y2="150" />
              <line x1="600" y1="400" x2="200" y2="650" />
              <line x1="600" y1="400" x2="1000" y2="650" />
            </g>

            {/* Outer Stadium Elliptical Boundary */}
            <ellipse
              cx="600"
              cy="400"
              rx="540"
              ry="350"
              fill="#f8fafc"
              stroke="#94a3b8"
              strokeWidth="2.5"
            />

            {/* Concentric Grandstands Rings (Anillos de Graderías) */}
            <ellipse cx="600" cy="400" rx="490" ry="315" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="6,4" />
            <ellipse cx="600" cy="400" rx="440" ry="280" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="6,4" />

            {/* Sector Orientation Labels (Occidental, Oriental, Sur, Norte) */}
            <text x="600" y="70" fill="#64748b" fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              TRIBUNA OCCIDENTAL &middot; MÓDULO OCCIDENTAL (CABINAS / PRENSA / CAMERINOS)
            </text>
            <text x="600" y="760" fill="#64748b" fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              TRIBUNA ORIENTAL &middot; MÓDULO ORIENTAL (ACCESOS GENERALES / MUSEOS)
            </text>
            <text x="95" y="400" fill="#64748b" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle" transform="rotate(-90, 95, 400)">
              TRIBUNA SUR &middot; MÓDULO SUR
            </text>
            <text x="1105" y="400" fill="#64748b" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle" transform="rotate(90, 1105, 400)">
              TRIBUNA NORTE &middot; MÓDULO NORTE
            </text>

            {/* Athletic Track (Pista Atlética en Gris) */}
            <ellipse cx="600" cy="400" rx="380" ry="235" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />

            {/* Central Football Pitch (Cancha 7,140 m² en Gris Bloqueado) */}
            <rect
              x="320"
              y="260"
              width="560"
              height="280"
              rx="6"
              fill="#e2e8f0"
              stroke="#94a3b8"
              strokeWidth="2"
            />
            {/* Center Line and Circle */}
            <line x1="600" y1="260" x2="600" y2="540" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="600" cy="400" r="50" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="600" cy="400" r="3" fill="#64748b" />
            {/* Penalty Boxes & Goals */}
            <rect x="320" y="330" width="70" height="140" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            <rect x="810" y="330" width="70" height="140" fill="none" stroke="#94a3b8" strokeWidth="1.5" />

            <text x="600" y="390" fill="#64748b" fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              CANCHA
            </text>
            <text x="600" y="415" fill="#94a3b8" fontSize="11" fontFamily="monospace" textAnchor="middle">
              7,140.00 m²
            </text>

            {/* Architectural Spatial Dividers specific to Active Level */}
            {isCancha && (
              <g stroke="#94a3b8" strokeWidth="1" fill="#f8fafc">
                {/* Cárcamo Perimetral */}
                <ellipse cx="600" cy="400" rx="350" ry="215" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="5,3" />
                <text x="600" y="240" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  NIVEL CÁRCAMO PERIMETRAL +37.35m
                </text>
                {/* Benches */}
                <rect x="510" y="225" width="80" height="25" rx="3" stroke="#94a3b8" fill="#e2e8f0" />
                <text x="550" y="241" fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="middle">BANCO JUGADORES</text>
                <rect x="610" y="225" width="80" height="25" rx="3" stroke="#94a3b8" fill="#e2e8f0" />
                <text x="650" y="241" fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="middle">BANCO 4TO ÁRB.</text>
                {/* Tunnels */}
                <rect x="130" y="380" width="120" height="40" rx="4" stroke="#64748b" />
                <text x="190" y="405" fill="#475569" fontSize="8.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">TÚNEL ACCESO SUR</text>
                <rect x="950" y="380" width="120" height="40" rx="4" stroke="#64748b" />
                <text x="1010" y="405" fill="#475569" fontSize="8.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">TÚNEL ACCESO NORTE</text>
              </g>
            )}

            {isNivel1 && (
              <g stroke="#94a3b8" strokeWidth="1" fill="#f8fafc">
                {/* Occidental Operational Core (Camerinos, Prensa, Museos, etc.) */}
                <rect x="440" y="130" width="75" height="40" rx="3" />
                <text x="477" y="154" fill="#334155" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">COLOMBIA</text>

                <rect x="680" y="130" width="75" height="40" rx="3" />
                <text x="717" y="154" fill="#334155" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">JUNIOR</text>

                <rect x="340" y="150" width="75" height="40" rx="3" />
                <text x="377" y="174" fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="middle">VISITANTE 1</text>

                <rect x="785" y="150" width="75" height="40" rx="3" />
                <text x="822" y="174" fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="middle">VISITANTE 2</text>

                <rect x="530" y="130" width="140" height="40" rx="3" fill="#e2e8f0" />
                <text x="600" y="154" fill="#1e293b" fontSize="8.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">SALA DE PRENSA (252 m²)</text>

                {/* Subestaciones & Technical */}
                <rect x="250" y="180" width="80" height="35" rx="3" />
                <text x="290" y="202" fill="#475569" fontSize="7.5" fontFamily="monospace" textAnchor="middle">SUBESTACIÓN</text>

                <rect x="870" y="180" width="80" height="35" rx="3" />
                <text x="910" y="202" fill="#475569" fontSize="7.5" fontFamily="monospace" textAnchor="middle">TALLERES</text>

                {/* Sur & Norte Sporting Halls */}
                <rect x="110" y="360" width="100" height="90" rx="4" fill="#f1f5f9" />
                <text x="160" y="410" fill="#334155" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">LIGA DE BOXEO</text>
                <text x="160" y="425" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">705.37 m²</text>

                <rect x="990" y="360" width="100" height="90" rx="4" fill="#f1f5f9" />
                <text x="1040" y="410" fill="#334155" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">LIGA GIMNASIA</text>
              </g>
            )}

            {isMezanine && (
              <g stroke="#94a3b8" strokeWidth="1" fill="#f8fafc">
                {/* VIP Lounges, Suites and Press Hub */}
                <rect x="420" y="130" width="360" height="70" rx="6" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5" />
                <text x="600" y="165" fill="#1e293b" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  ÁREA VIP MEZANINE &middot; PALCOS DE HONOR (518 m²)
                </text>
                <text x="600" y="185" fill="#64748b" fontSize="8.5" fontFamily="monospace" textAnchor="middle">
                  Puente Conexión Museos &middot; Cabinas Transmisión &middot; Secretaría
                </text>
              </g>
            )}

            {isNivel3 && (
              <g stroke="#94a3b8" strokeWidth="1" fill="#f8fafc">
                {/* Upper Tier Perimeter Gallery & Staircase Caracolas */}
                <circle cx="320" cy="230" r="22" stroke="#64748b" strokeWidth="1.5" fill="#e2e8f0" />
                <text x="320" y="234" fill="#334155" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">CAR. 2</text>

                <circle cx="880" cy="230" r="22" stroke="#64748b" strokeWidth="1.5" fill="#e2e8f0" />
                <text x="880" y="234" fill="#334155" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">CAR. 1</text>

                <circle cx="880" cy="570" r="22" stroke="#64748b" strokeWidth="1.5" fill="#e2e8f0" />
                <text x="880" y="574" fill="#334155" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">CAR. 3</text>

                <circle cx="320" cy="570" r="22" stroke="#64748b" strokeWidth="1.5" fill="#e2e8f0" />
                <text x="320" y="574" fill="#334155" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">CAR. 4</text>

                <rect x="520" y="145" width="160" height="40" rx="4" stroke="#64748b" fill="#f1f5f9" />
                <text x="600" y="170" fill="#334155" fontSize="8.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  GRADERÍA PRENSA ALTA (80 m²)
                </text>
              </g>
            )}
          </g>

          {/* ========================================================================= */}
          {/* CAPA 2: TUBERÍAS EMT EN ROJO TÉCNICO & CABLEADO FPLR (RED CONDUIT RUNS) */}
          {/* ========================================================================= */}
          {showPipes && (
            <g>
              {sections.map((sec) => {
                const isHovered = hoveredSection?.id === sec.id;
                const isSelected = selectedSection?.id === sec.id;
                const isThick = sec.conduitDiameter === '1"';

                return (
                  <g
                    key={sec.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredSection(sec)}
                    onMouseLeave={() => setHoveredSection(null)}
                    onClick={() => handleSectionClick(sec)}
                  >
                    {/* Hover/Selection Halo */}
                    <path
                      d={sec.pathD}
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth={isThick ? '16' : '14'}
                      strokeOpacity={isSelected ? 0.35 : isHovered ? 0.22 : 0}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Tubería Conduit EMT (Línea Roja Sólida del Plano) */}
                    <path
                      d={sec.pathD}
                      fill="none"
                      stroke={isSelected ? '#b91c1c' : isHovered ? '#ef4444' : '#dc2626'}
                      strokeWidth={isThick ? '4' : '2.8'}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Cableado FPLR Interior (Línea blanca discontinua SLC) */}
                    <path
                      d={sec.pathD}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1"
                      strokeDasharray="4,3"
                      opacity={isSelected ? 1 : 0.8}
                    />

                    {/* Badge interactivo con metrado y diámetro de tubería */}
                    <rect
                      x={sec.labelPos.x - 30}
                      y={sec.labelPos.y - 10}
                      width="60"
                      height="20"
                      rx="5"
                      fill="#ffffff"
                      stroke={isSelected ? '#b91c1c' : isHovered ? '#dc2626' : '#f87171'}
                      strokeWidth={isSelected ? '2' : '1.2'}
                      className="drop-shadow-sm"
                    />
                    <text
                      x={sec.labelPos.x}
                      y={sec.labelPos.y + 3.5}
                      fill="#b91c1c"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {sec.lengthMeters}m &middot; {sec.conduitDiameter}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* ========================================================================= */}
          {/* CAPA 3: EQUIPOS CON CONVENCIONES EXACTAS DEL PLANO (FACP, S, T, F, ⚡)    */}
          {/* ========================================================================= */}
          <g>
            {discreteDevices.map((item) => {
              const { cx, cy } = getNodeCoordinates(item);
              const isSelected = activeSelected?.id === item.id || activeSelected?.code === item.code;
              const isHovered = hoveredNode?.id === item.id;
              const code = item.code.toUpperCase();
              const type = item.type;

              // Type checks
              const isFACP = type === 'facp' || code.includes('FACP') || code.includes('AR');
              const isPalanca = type === 'palanca' || code.includes('PAL');
              const isSirena = type === 'sirena' || code.includes('SIR');
              const isDetectorDoble = type === 'detector-doble' || code.includes('HCO') || code.includes('SH');
              const isDetector = !isFACP && !isPalanca && !isSirena && !isDetectorDoble;

              // Visibility filters
              if (isFACP && !showPaneles) return null;
              if (isPalanca && !showPalancas) return null;
              if (isSirena && !showSirenas) return null;
              if ((isDetector || isDetectorDoble) && !showDetectors) return null;

              return (
                <g
                  key={item.id}
                  className="cursor-pointer transition-transform"
                  onMouseEnter={() => setHoveredNode(item)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => handleSelect(item)}
                >
                  {/* Selection Ring */}
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="18"
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth="2.5"
                      strokeDasharray="4,2"
                      className="animate-spin"
                      style={{ transformOrigin: `${cx}px ${cy}px` }}
                    />
                  )}

                  {/* 1. PANEL DE INCENDIO (FACP) / ANUNCIADOR REMOTO (AR) */}
                  {isFACP && (
                    <g>
                      <rect
                        x={cx - 24}
                        y={cy - 12}
                        width="48"
                        height="24"
                        rx="4"
                        fill="#b91c1c"
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="drop-shadow"
                      />
                      <text
                        x={cx}
                        y={cy + 4.5}
                        fill="#ffffff"
                        fontSize="9.5"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {code.includes('AR') ? 'AR' : 'FACP'}
                      </text>
                    </g>
                  )}

                  {/* 2. ESTACIÓN MANUAL DE ALARMA (F / M en cuadrado rojo) */}
                  {isPalanca && (
                    <g>
                      <rect
                        x={cx - 10}
                        y={cy - 10}
                        width="20"
                        height="20"
                        rx="3"
                        fill="#dc2626"
                        stroke="#991b1b"
                        strokeWidth="2"
                        className="drop-shadow-sm"
                      />
                      <text
                        x={cx}
                        y={cy + 4.5}
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        F
                      </text>
                    </g>
                  )}

                  {/* 3. SIRENA / PARLANTE ESTROBO (⚡ en rectángulo rojo) */}
                  {isSirena && (
                    <g>
                      <rect
                        x={cx - 12}
                        y={cy - 8}
                        width="24"
                        height="16"
                        rx="3"
                        fill="#dc2626"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="drop-shadow-sm"
                      />
                      <text
                        x={cx}
                        y={cy + 4}
                        fill="#fef08a"
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        ⚡
                      </text>
                    </g>
                  )}

                  {/* 4. DETECTOR TÉRMICO Y CO (H·CO) O HUMO Y TÉRMICO (S·H) */}
                  {isDetectorDoble && (
                    <g>
                      <circle
                        cx={cx}
                        cy={cy}
                        r="11"
                        fill="#ffffff"
                        stroke="#dc2626"
                        strokeWidth="2"
                        className="drop-shadow-sm"
                      />
                      <text
                        x={cx}
                        y={cy + 3.5}
                        fill="#b91c1c"
                        fontSize="7.5"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {code.includes('HCO') ? 'H·CO' : 'S·H'}
                      </text>
                    </g>
                  )}

                  {/* 5. DETECTOR DE HUMO (S) O TÉRMICO (T) ESTÁNDAR */}
                  {isDetector && (
                    <g>
                      <circle
                        cx={cx}
                        cy={cy}
                        r="10"
                        fill="#ffffff"
                        stroke="#dc2626"
                        strokeWidth="2"
                        className="drop-shadow-sm"
                      />
                      <text
                        x={cx}
                        y={cy + 4}
                        fill="#b91c1c"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {code.includes('SEN-05') || code.includes('TER') ? 'T' : 'S'}
                      </text>
                    </g>
                  )}

                  {/* Hover or selected tooltip badge */}
                  {(isHovered || isSelected) && (
                    <g className="pointer-events-none">
                      <rect
                        x={cx - 45}
                        y={cy - 30}
                        width="90"
                        height="17"
                        rx="4"
                        fill="#0f172a"
                        opacity="0.9"
                      />
                      <text
                        x={cx}
                        y={cy - 18}
                        fill="#ffffff"
                        fontSize="8.5"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {item.code}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Selected Element or Conduit Section Inspection Footer */}
      {(activeDisplayNode || selectedSection) && (
        <div className="mt-4 p-4 rounded-xl border border-red-200 bg-red-50/50 flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-sm font-mono shadow-sm">
              {selectedSection ? 'TUB' : activeDisplayNode?.code.split('-').pop() || 'EQ'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-brand-deep">
                  {selectedSection ? selectedSection.name : activeDisplayNode?.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-white text-red-700 border border-red-200">
                  {selectedSection ? selectedSection.code : activeDisplayNode?.code}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {selectedSection
                  ? `Tramo en tubería EMT ${selectedSection.conduitDiameter} con cable SLC tendido (${selectedSection.lengthMeters} metros).`
                  : activeDisplayNode?.model || 'Componente NFPA 72'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            {selectedSection ? (
              <div className="text-right">
                <span className="text-slate-500 block text-[10px]">Longitud Tramo</span>
                <strong className="text-brand-deep text-sm">{selectedSection.lengthMeters} Metros</strong>
              </div>
            ) : (
              <div className="text-right">
                <span className="text-slate-500 block text-[10px]">Estado de Obra</span>
                <span
                  className={`inline-flex items-center gap-1 font-bold text-xs ${
                    activeDisplayNode?.status === 'inspected'
                      ? 'text-emerald-700'
                      : activeDisplayNode?.status === 'installed'
                      ? 'text-blue-700'
                      : 'text-amber-700'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {activeDisplayNode?.status === 'inspected'
                    ? 'Inspeccionado'
                    : activeDisplayNode?.status === 'installed'
                    ? 'Instalado'
                    : 'Planificado'}
                </span>
              </div>
            )}

            <button
              onClick={() => {
                setInternalSelected(null);
                setSelectedSection(null);
              }}
              className="p-1.5 rounded-lg hover:bg-red-100 text-slate-500 hover:text-slate-700 transition-all"
              title="Cerrar ficha"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
