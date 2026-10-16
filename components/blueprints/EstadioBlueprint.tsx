'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FloorItem } from '@/src/schemas/floor-item.schema';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Clock,
  Layers,
  X,
  Maximize2,
  Minimize2,
  Eye,
  SlidersHorizontal,
  MapPin,
  Flame,
} from 'lucide-react';

interface Props {
  items: FloorItem[];
  currentZone: string;
  isEditable: boolean;
  selectedItemId?: string | null;
  onSelectItem?: (item: FloorItem) => void;
}

interface HotspotNode {
  code: string;
  name: string;
  type: FloorItem['type'];
  x: number;
  y: number;
  symbol: string;
  badge: string;
  color: string;
}

export default function EstadioBlueprint({
  items,
  currentZone,
  isEditable,
  selectedItemId,
  onSelectItem,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pan & Zoom state
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // View mode: 'cadgray' (Arquitectura en gris bloqueado + Tubería y equipos en rojo) vs 'original' (Plano original PDF)
  const [viewMode, setViewMode] = useState<'cadgray' | 'original'>('cadgray');

  // Interactive filter toggles
  const [showPipes, setShowPipes] = useState(true);
  const [showDetectors, setShowDetectors] = useState(true);
  const [showPalancas, setShowPalancas] = useState(true);
  const [showSirenas, setShowSirenas] = useState(true);
  const [showPaneles, setShowPaneles] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);

  // Selection state
  const [internalSelected, setInternalSelected] = useState<FloorItem | null>(null);
  const [hoveredNode, setHoveredNode] = useState<HotspotNode | null>(null);

  // Determine active level from currentZone
  const zoneLower = currentZone.toLowerCase();
  const isCancha = zoneLower.includes('cancha');
  const isMezanine = zoneLower.includes('mezzanine') || zoneLower.includes('mezanine');
  const isNivel3 = zoneLower.includes('nivel 3');
  const isNivel1 = !isCancha && !isMezanine && !isNivel3;

  // Level metadata from official blueprints
  const levelMeta = isCancha
    ? {
        key: 'cancha',
        plancha: 'SDI A100',
        sheetTitle: 'PLANTA NIVEL DE CANCHA',
        elevation: '-3.80 m',
        scale: '1:350',
        srcCadGray: '/planos/cancha-cadgray.png',
        srcOriginal: '/planos/cancha.png',
      }
    : isMezanine
    ? {
        key: 'mezanine',
        plancha: 'SDI A102',
        sheetTitle: 'PLANTA NIVEL DE MEZANINE',
        elevation: '+45.57 m',
        scale: '1:500',
        srcCadGray: '/planos/mezanine-cadgray.png',
        srcOriginal: '/planos/mezanine.png',
      }
    : isNivel3
    ? {
        key: 'nivel-3',
        plancha: 'SDI A104',
        sheetTitle: 'PLANTA NIVEL 3',
        elevation: '+52.45 m',
        scale: '1:350',
        srcCadGray: '/planos/nivel-3-cadgray.png',
        srcOriginal: '/planos/nivel-3.png',
      }
    : {
        key: 'nivel-1',
        plancha: 'SDI A101',
        sheetTitle: 'PLANTA NIVEL 1',
        elevation: '+42.08 m',
        scale: '1:350',
        srcCadGray: '/planos/nivel-1-cadgray.png',
        srcOriginal: '/planos/nivel-1.png',
      };

  // Reset pan/zoom on floor change
  useEffect(() => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
    setInternalSelected(null);
  }, [currentZone]);

  const activeSelected = selectedItemId
    ? items.find((i) => i.code === selectedItemId || i.id === selectedItemId) || internalSelected
    : internalSelected;

  const handleSelect = (item: FloorItem) => {
    setInternalSelected(item);
    if (onSelectItem) {
      onSelectItem(item);
    }
  };

  // Hotspots mapped directly to the actual CAD coordinates (3006 x 2126 px)
  const getHotspotsForLevel = (): HotspotNode[] => {
    if (isCancha) {
      return [
        { code: 'EST-CAN-SEN-01', name: 'Detector Humo (S) Túnel Acceso Sur', type: 'detector-autonomo', x: 260, y: 1100, symbol: 'S', badge: 'Túnel Sur', color: '#dc2626' },
        { code: 'EST-CAN-SEN-02', name: 'Detector Humo (S) Túnel Acceso Norte', type: 'detector-autonomo', x: 2260, y: 1100, symbol: 'S', badge: 'Túnel Norte', color: '#dc2626' },
        { code: 'EST-CAN-SEN-03', name: 'Detector Humo (S) Hospitality A', type: 'detector-autonomo', x: 570, y: 550, symbol: 'S', badge: 'Hosp. A', color: '#dc2626' },
        { code: 'EST-CAN-SEN-04', name: 'Detector Humo (S) Hospitality B', type: 'detector-autonomo', x: 1950, y: 550, symbol: 'S', badge: 'Hosp. B', color: '#dc2626' },
        { code: 'EST-CAN-SEN-05', name: 'Detector Térmico (T) Cuarto Técnico', type: 'detector-autonomo', x: 1260, y: 390, symbol: 'T', badge: 'Técnico', color: '#dc2626' },
        { code: 'EST-CAN-PAL-01', name: 'Estación Manual (F) Boca Túnel Sur', type: 'palanca', x: 450, y: 1060, symbol: 'F', badge: 'Palanca Sur', color: '#dc2626' },
        { code: 'EST-CAN-PAL-02', name: 'Estación Manual (F) Boca Túnel Norte', type: 'palanca', x: 2070, y: 1060, symbol: 'F', badge: 'Palanca Norte', color: '#dc2626' },
        { code: 'EST-CAN-SIR-01', name: 'Sirena Estrobo (⚡) Túnel Sur', type: 'sirena', x: 350, y: 1040, symbol: '⚡', badge: 'Sirena', color: '#dc2626' },
        { code: 'EST-CAN-SIR-02', name: 'Sirena Estrobo (⚡) Túnel Norte', type: 'sirena', x: 2170, y: 1040, symbol: '⚡', badge: 'Sirena', color: '#dc2626' },
      ];
    }

    if (isMezanine) {
      return [
        { code: 'EST-MEZ-SEN-01', name: 'Detector Humo (S) Área VIP Central', type: 'detector-autonomo', x: 1260, y: 440, symbol: 'S', badge: 'VIP 518m²', color: '#dc2626' },
        { code: 'EST-MEZ-SEN-02', name: 'Detector Humo (S) Museo Selección', type: 'detector-autonomo', x: 1970, y: 420, symbol: 'S', badge: 'Museo', color: '#dc2626' },
        { code: 'EST-MEZ-SEN-03', name: 'Detector Humo (S) Puente Conexión', type: 'detector-autonomo', x: 1550, y: 470, symbol: 'S', badge: 'Puente', color: '#dc2626' },
        { code: 'EST-MEZ-SEN-04', name: 'Detector Humo (S) Jefatura Escenarios', type: 'detector-autonomo', x: 990, y: 460, symbol: 'S', badge: 'Jefatura', color: '#dc2626' },
        { code: 'EST-MEZ-SEN-05', name: 'Detector Humo (S) Sala Juntas VIP', type: 'detector-autonomo', x: 1120, y: 410, symbol: 'S', badge: 'Juntas', color: '#dc2626' },
        { code: 'EST-MEZ-PAL-01', name: 'Estación Manual (F) Palcos VIP', type: 'palanca', x: 1260, y: 350, symbol: 'F', badge: 'Palanca VIP', color: '#dc2626' },
        { code: 'EST-MEZ-PAL-02', name: 'Estación Manual (F) Escalera Mezanine Sur', type: 'palanca', x: 680, y: 560, symbol: 'F', badge: 'Palanca Sur', color: '#dc2626' },
        { code: 'EST-MEZ-SIR-01', name: 'Sirena Estrobo (⚡) VIP Mezanine', type: 'sirena', x: 1390, y: 420, symbol: '⚡', badge: 'Sirena VIP', color: '#dc2626' },
        { code: 'EST-MEZ-MOD-REL', name: 'Módulo Relevo Control Audio/AC', type: 'cuadro-bomba', x: 890, y: 480, symbol: 'CR', badge: 'Relevo', color: '#dc2626' },
      ];
    }

    if (isNivel3) {
      return [
        { code: 'EST-N3-SEN-01', name: 'Detector Humo (S) Baños Occidental', type: 'detector-autonomo', x: 1000, y: 330, symbol: 'S', badge: 'Baños Occ', color: '#dc2626' },
        { code: 'EST-N3-SEN-02', name: 'Detector Humo (S) Gradería Prensa Alta', type: 'detector-autonomo', x: 1300, y: 420, symbol: 'S', badge: 'Prensa 80m²', color: '#dc2626' },
        { code: 'EST-N3-SEN-03', name: 'Detector Humo (S) Puntos Fijos Occ.', type: 'detector-autonomo', x: 1580, y: 330, symbol: 'S', badge: 'Puntos Fijos', color: '#dc2626' },
        { code: 'EST-N3-SEN-04', name: 'Detector Humo (S) Baños Oriental', type: 'detector-autonomo', x: 1260, y: 1770, symbol: 'S', badge: 'Baños Orie', color: '#dc2626' },
        { code: 'EST-N3-PAL-01', name: 'Estación Manual (F) Caracola 1', type: 'palanca', x: 2160, y: 550, symbol: 'F', badge: 'Caracola 1', color: '#dc2626' },
        { code: 'EST-N3-PAL-02', name: 'Estación Manual (F) Caracola 2', type: 'palanca', x: 420, y: 550, symbol: 'F', badge: 'Caracola 2', color: '#dc2626' },
        { code: 'EST-N3-PAL-03', name: 'Estación Manual (F) Caracola 3', type: 'palanca', x: 2160, y: 1530, symbol: 'F', badge: 'Caracola 3', color: '#dc2626' },
        { code: 'EST-N3-PAL-04', name: 'Estación Manual (F) Caracola 4', type: 'palanca', x: 420, y: 1530, symbol: 'F', badge: 'Caracola 4', color: '#dc2626' },
        { code: 'EST-N3-SIR-01', name: 'Sirena Estrobo (⚡) Corona Occidental', type: 'sirena', x: 1260, y: 280, symbol: '⚡', badge: 'Sirena Occ', color: '#dc2626' },
        { code: 'EST-N3-SIR-02', name: 'Sirena Estrobo (⚡) Corona Oriental', type: 'sirena', x: 1260, y: 1850, symbol: '⚡', badge: 'Sirena Orie', color: '#dc2626' },
      ];
    }

    // Default: NIVEL 1 (+42.08 m)
    return [
      { code: 'EST-N1-FACP-02', name: 'Panel de Incendio Notifier No. 2', type: 'facp', x: 1040, y: 380, symbol: 'FACP', badge: 'Control FACP-2', color: '#b91c1c' },
      { code: 'EST-N1-FACP-03', name: 'Panel de Incendio Notifier No. 3', type: 'facp', x: 1680, y: 370, symbol: 'FACP', badge: 'Subestación FACP-3', color: '#b91c1c' },
      { code: 'EST-N1-AR-01', name: 'Anunciador Remoto LCD AR', type: 'facp', x: 2170, y: 1040, symbol: 'AR', badge: 'Taquillas AR', color: '#b91c1c' },
      { code: 'EST-N1-SEN-COL', name: 'Detector Humo (S) Camerino Colombia', type: 'detector-autonomo', x: 1085, y: 433, symbol: 'S', badge: 'Camerino Colombia', color: '#dc2626' },
      { code: 'EST-N1-SEN-JUN', name: 'Detector Humo (S) Camerino Junior', type: 'detector-autonomo', x: 904, y: 351, symbol: 'S', badge: 'Camerino Junior', color: '#dc2626' },
      { code: 'EST-N1-SEN-VIS1', name: 'Detector Humo (S) Camerino Visitantes 1', type: 'detector-autonomo', x: 780, y: 390, symbol: 'S', badge: 'Visitante 1', color: '#dc2626' },
      { code: 'EST-N1-SEN-VIS2', name: 'Detector Humo (S) Camerino Visitantes 2', type: 'detector-autonomo', x: 1220, y: 450, symbol: 'S', badge: 'Visitante 2', color: '#dc2626' },
      { code: 'EST-N1-SEN-PREN', name: 'Detector Humo (S) Sala de Prensa', type: 'detector-autonomo', x: 580, y: 610, symbol: 'S', badge: 'Prensa 252m²', color: '#dc2626' },
      { code: 'EST-N1-SEN-MED', name: 'Detector Humo (S) Médica & Antidopaje', type: 'detector-autonomo', x: 670, y: 430, symbol: 'S', badge: 'Médica', color: '#dc2626' },
      { code: 'EST-N1-SEN-BOX', name: 'Detector Humo (S) Liga de Boxeo', type: 'detector-autonomo', x: 814, y: 1691, symbol: 'S', badge: 'Boxeo 705m²', color: '#dc2626' },
      { code: 'EST-N1-SEN-GIM', name: 'Detector Humo (S) Liga de Gimnasia', type: 'detector-autonomo', x: 1281, y: 1752, symbol: 'S', badge: 'Gimnasia', color: '#dc2626' },
      { code: 'EST-N1-SEN-HCO1', name: 'Detector Térmico y CO (H·CO) Subestación Occ.', type: 'detector-doble', x: 620, y: 1613, symbol: 'H·CO', badge: 'Subestación', color: '#dc2626' },
      { code: 'EST-N1-SEN-HCO2', name: 'Detector Térmico y CO (H·CO) Planta Generación', type: 'detector-doble', x: 540, y: 1680, symbol: 'H·CO', badge: 'Generadores', color: '#dc2626' },
      { code: 'EST-N1-SEN-SH1', name: 'Detector Humo y Térmico (S·H) Taller Mant.', type: 'detector-doble', x: 1988, y: 1562, symbol: 'S·H', badge: 'Taller', color: '#dc2626' },
      { code: 'EST-N1-PAL-01', name: 'Estación Manual (F) Acceso Occidental', type: 'palanca', x: 1040, y: 260, symbol: 'F', badge: 'Palanca Occ.', color: '#dc2626' },
      { code: 'EST-N1-PAL-02', name: 'Estación Manual (F) Pasillo Camerinos', type: 'palanca', x: 960, y: 410, symbol: 'F', badge: 'Palanca Cam.', color: '#dc2626' },
      { code: 'EST-N1-PAL-03', name: 'Estación Manual (F) Acceso Oriental', type: 'palanca', x: 1260, y: 1820, symbol: 'F', badge: 'Palanca Orie.', color: '#dc2626' },
      { code: 'EST-N1-SIR-01', name: 'Sirena Estrobo (⚡) Camerinos', type: 'sirena', x: 1020, y: 460, symbol: '⚡', badge: 'Sirena Cam.', color: '#dc2626' },
      { code: 'EST-N1-SIR-02', name: 'Sirena Estrobo (⚡) Sala de Prensa', type: 'sirena', x: 520, y: 640, symbol: '⚡', badge: 'Sirena Prensa', color: '#dc2626' },
      { code: 'EST-N1-SIR-03', name: 'Sirena Estrobo (⚡) Ligas Deportivas', type: 'sirena', x: 950, y: 1720, symbol: '⚡', badge: 'Sirena Ligas', color: '#dc2626' },
      { code: 'EST-N1-REG-PAS', name: 'Registro Pasante Vertical (⤊/⤋) Riser', type: 'tuberia', x: 1520, y: 420, symbol: '⤊⤋', badge: 'Riser Cancha', color: '#dc2626' },
    ];
  };

  const hotspots = getHotspotsForLevel();

  // Mouse pan event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    setZoomScale((prev) => Math.min(Math.max(prev + delta, 0.6), 3.5));
  };

  const currentImageSrc = viewMode === 'cadgray' ? levelMeta.srcCadGray : levelMeta.srcOriginal;

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl border border-surface-border bg-white p-4 overflow-hidden shadow-sm transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none p-6 bg-slate-950 text-white' : ''
      }`}
    >
      {/* Blueprint Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-surface-border text-xs">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-brand-deep tracking-tight">
                {levelMeta.sheetTitle}
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full font-mono font-bold bg-red-100 text-red-800 border border-red-300">
                Plancha {levelMeta.plancha} &middot; Cota {levelMeta.elevation}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-100 text-slate-700 border border-slate-300">
                Escala {levelMeta.scale}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Copia fiel y directa del plano PDF oficial &middot; Tubería y cableado en rojo técnico
            </p>
          </div>
        </div>

        {/* View Mode Toggle & Navigation Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-300 text-xs font-mono">
            <button
              onClick={() => setViewMode('cadgray')}
              className={`px-3 py-1.5 rounded-lg transition-all font-bold ${
                viewMode === 'cadgray'
                  ? 'bg-brand-deep text-white shadow-sm'
                  : 'text-slate-600 hover:text-brand-deep'
              }`}
              title="Arquitectura en gris bloqueado y redes en rojo para máxima claridad en obra"
            >
              Arquitectura en Gris + Tubería Roja
            </button>
            <button
              onClick={() => setViewMode('original')}
              className={`px-3 py-1.5 rounded-lg transition-all font-bold ${
                viewMode === 'original'
                  ? 'bg-brand-deep text-white shadow-sm'
                  : 'text-slate-600 hover:text-brand-deep'
              }`}
              title="Plano original tal como fue ploteado en el PDF"
            >
              Plano Original PDF
            </button>
          </div>

          {/* Zoom & Pan Controls */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-300 text-slate-700">
            <button
              onClick={() => setZoomScale((prev) => Math.min(prev + 0.25, 3.5))}
              className="p-1.5 rounded-lg hover:bg-white transition-all"
              title="Acercar plano (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomScale((prev) => Math.max(prev - 0.25, 0.6))}
              className="p-1.5 rounded-lg hover:bg-white transition-all"
              title="Alejar plano (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setZoomScale(1);
                setPanOffset({ x: 0, y: 0 });
              }}
              className="p-1.5 rounded-lg hover:bg-white transition-all font-mono text-[11px] px-2"
              title="Restablecer vista 100%"
            >
              <RotateCcw className="w-3.5 h-3.5 inline mr-1 text-slate-500" />
              {Math.round(zoomScale * 100)}%
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg hover:bg-white transition-all text-slate-700"
              title={isFullscreen ? 'Salir de pantalla completa' : 'Ver a pantalla completa'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Convenciones Bar & Layer Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-slate-700 font-bold uppercase text-[11px]">
          <Layers className="w-4 h-4 text-red-600" />
          <span>Convenciones NFPA 72:</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-slate-700 text-[11px]">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showHotspots}
              onChange={(e) => setShowHotspots(e.target.checked)}
              className="rounded text-red-600 focus:ring-0"
            />
            <span className="font-bold text-red-700">Puntos Interactivos de Obra</span>
          </label>

          <div className="h-4 w-px bg-slate-300"></div>

          <div className="flex items-center gap-1.5">
            <span className="w-4 h-1 bg-red-600 rounded inline-block"></span>
            <span>Tubería EMT 3/4" & 1"</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full border-2 border-red-600 bg-white text-[9px] font-bold text-red-600 flex items-center justify-center">
              S
            </span>
            <span>Detector Humo</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full border-2 border-red-600 bg-white text-[9px] font-bold text-red-600 flex items-center justify-center">
              T
            </span>
            <span>Detector Térmico</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
              F
            </span>
            <span>Estación Manual</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-4 h-3 rounded bg-red-600 text-amber-200 text-[8px] font-bold flex items-center justify-center">
              ⚡
            </span>
            <span>Sirena Estrobo</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-red-700 text-white text-[9px] font-bold">
              FACP
            </span>
            <span>Panel de Incendio</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-red-700 text-white text-[9px] font-bold">
              AR
            </span>
            <span>Anunciador Remoto</span>
          </div>
        </div>
      </div>

      {/* Main Interactive CAD Blueprint Canvas */}
      <div
        className="relative w-full overflow-hidden bg-slate-100 rounded-xl border border-slate-300 flex justify-center items-center select-none shadow-inner cursor-grab active:cursor-grabbing"
        style={{ minHeight: isFullscreen ? 'calc(100vh - 180px)' : '620px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          className="relative transition-transform duration-75 origin-center will-change-transform"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
          }}
        >
          {/* 1. ACTUAL PDF BLUEPRINT IMAGE (High-definition 3006x2126 px) */}
          <img
            src={currentImageSrc}
            alt={`Plano Oficial Estadio Metropolitano - ${levelMeta.sheetTitle}`}
            className="w-[1100px] h-auto max-w-none block pointer-events-none rounded shadow-md border border-slate-200"
            draggable={false}
          />

          {/* 2. INTERACTIVE SVG HOTSPOT OVERLAY */}
          {showHotspots && (
            <svg
              viewBox="0 0 3006 2126"
              className="absolute inset-0 w-full h-full pointer-events-auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              {hotspots.map((node) => {
                const isSelected =
                  activeSelected?.code === node.code ||
                  activeSelected?.name.toLowerCase().includes(node.name.toLowerCase());
                const isHovered = hoveredNode?.code === node.code;

                // Match with FloorItem from props
                const matchedItem = items.find(
                  (i) => i.code === node.code || i.name.toLowerCase().includes(node.name.toLowerCase())
                ) || {
                  id: `hotspot-${node.code}`,
                  projectId: 'estadio-metropolitano',
                  code: node.code,
                  type: node.type,
                  name: node.name,
                  model: 'Notifier NFPA 72',
                  zone: currentZone,
                  status: 'pending',
                  quantity: 1,
                  unit: 'Unidad',
                  unitPrice: 385000,
                  notes: 'Componente identificado en plano oficial de detección.',
                };

                return (
                  <g
                    key={node.code}
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(matchedItem);
                    }}
                  >
                    {/* Pulsing Selection Aura */}
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="45"
                        fill="#dc2626"
                        fillOpacity="0.25"
                        stroke="#dc2626"
                        strokeWidth="5"
                        strokeDasharray="8,4"
                        className="animate-spin"
                        style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                      />
                    )}

                    {/* Interactive Marker Pin */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected || isHovered ? '28' : '22'}
                      fill={isSelected ? '#b91c1c' : isHovered ? '#ef4444' : '#dc2626'}
                      stroke="#ffffff"
                      strokeWidth="4"
                      className="drop-shadow-md transition-all duration-150"
                    />

                    {/* Symbol Text */}
                    <text
                      x={node.x}
                      y={node.y + 7}
                      fill="#ffffff"
                      fontSize={node.symbol.length > 2 ? '13' : '17'}
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="pointer-events-none select-none"
                    >
                      {node.symbol}
                    </text>

                    {/* Label Badge on Hover or Selection */}
                    {(isHovered || isSelected) && (
                      <g className="pointer-events-none animate-in fade-in duration-100">
                        <rect
                          x={node.x - 90}
                          y={node.y - 65}
                          width="180"
                          height="36"
                          rx="8"
                          fill="#0f172a"
                          stroke="#ffffff"
                          strokeWidth="2"
                          opacity="0.95"
                          className="drop-shadow-lg"
                        />
                        <text
                          x={node.x}
                          y={node.y - 42}
                          fill="#ffffff"
                          fontSize="14"
                          fontWeight="bold"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {node.badge}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </div>

      {/* Selected Element Inspection Card */}
      {activeSelected && (
        <div className="mt-4 p-4 rounded-xl border-2 border-red-500 bg-red-50/70 flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-150 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex flex-col items-center justify-center font-bold font-mono shadow-sm">
              <Flame className="w-5 h-5 text-amber-200" />
              <span className="text-[10px] uppercase">{activeSelected.type.slice(0, 3)}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-brand-deep">
                  {activeSelected.name}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded font-mono font-bold bg-white text-red-700 border border-red-300">
                  {activeSelected.code}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                <strong>Modelo:</strong> {activeSelected.model} &middot; <strong>Ubicación:</strong>{' '}
                {activeSelected.zone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <span className="text-slate-500 block text-[10px]">Metrado / Cantidad</span>
              <strong className="text-brand-deep text-sm">
                {activeSelected.quantity} {activeSelected.unit}
              </strong>
            </div>

            <div className="text-right">
              <span className="text-slate-500 block text-[10px]">Estado en Obra</span>
              <span
                className={`inline-flex items-center gap-1 font-bold text-xs ${
                  activeSelected.status === 'inspected'
                    ? 'text-emerald-700'
                    : activeSelected.status === 'installed'
                    ? 'text-blue-700'
                    : 'text-amber-700'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                {activeSelected.status === 'inspected'
                  ? 'Inspeccionado'
                  : activeSelected.status === 'installed'
                  ? 'Instalado'
                  : 'Planificado'}
              </span>
            </div>

            <button
              onClick={() => setInternalSelected(null)}
              className="p-1.5 rounded-lg hover:bg-red-200 text-slate-600 hover:text-slate-900 transition-all"
              title="Cerrar ficha técnica"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
