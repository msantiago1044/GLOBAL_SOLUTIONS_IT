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
  Flame,
  CheckCircle2,
} from 'lucide-react';

import canchaDevices from '@/src/data/estadio-cancha-devices.json';
import nivel1Devices from '@/src/data/estadio-nivel-1-devices.json';
import mezanineDevices from '@/src/data/estadio-mezanine-devices.json';
import nivel3Devices from '@/src/data/estadio-nivel-3-devices.json';

interface Props {
  items: FloorItem[];
  currentZone: string;
  isEditable: boolean;
  selectedItemId?: string | null;
  onSelectItem?: (item: FloorItem) => void;
}

interface HotspotNode {
  code: string;
  symbol: string;
  type: FloorItem['type'];
  name: string;
  room: string;
  x: number;
  y: number;
  color: string;
}

export default function EstadioBlueprint({
  items,
  currentZone,
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

  // Interactive layer filter toggles
  const [showHotspots, setShowHotspots] = useState(true);
  const [filterS, setFilterS] = useState(true);
  const [filterF, setFilterF] = useState(true);
  const [filterH, setFilterH] = useState(true);
  const [filterOther, setFilterOther] = useState(true);

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
        devices: canchaDevices as HotspotNode[],
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
        devices: mezanineDevices as HotspotNode[],
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
        devices: nivel3Devices as HotspotNode[],
      }
    : {
        key: 'nivel-1',
        plancha: 'SDI A101',
        sheetTitle: 'PLANTA NIVEL 1',
        elevation: '+42.08 m',
        scale: '1:350',
        srcCadGray: '/planos/nivel-1-cadgray.png',
        srcOriginal: '/planos/nivel-1.png',
        devices: nivel1Devices as HotspotNode[],
      };

  // Reset pan/zoom on floor change
  useEffect(() => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
    setInternalSelected(null);
  }, [currentZone]);

  const allLevelNodes = levelMeta.devices;

  // Compute breakdown of devices in this level
  const counts = allLevelNodes.reduce<Record<string, number>>((acc, node) => {
    acc[node.symbol] = (acc[node.symbol] || 0) + 1;
    return acc;
  }, {});

  // Filtered devices for SVG overlay
  const visibleNodes = allLevelNodes.filter((node) => {
    if (!showHotspots) return false;
    if (node.symbol === 'S') return filterS;
    if (node.symbol === 'F') return filterF;
    if (node.symbol === 'H') return filterH;
    return filterOther;
  });

  const activeSelected = selectedItemId
    ? items.find((i) => i.code === selectedItemId || i.id === selectedItemId) || internalSelected
    : internalSelected;

  const handleSelect = (item: FloorItem) => {
    setInternalSelected(item);
    if (onSelectItem) {
      onSelectItem(item);
    }
  };

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
    setZoomScale((prev) => Math.min(Math.max(prev + delta, 0.6), 4.0));
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
              Copia fiel y directa del plano PDF oficial &middot; Tubería y detectores ubicados en coordenadas reales
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
              title="Arquitectura en gris bloqueado con tubería y cableado en rojo continuo"
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
              onClick={() => setZoomScale((prev) => Math.min(prev + 0.25, 4.0))}
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

      {/* Convenciones NFPA 72 & Layer Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-slate-700 font-bold uppercase text-[11px]">
          <Layers className="w-4 h-4 text-red-600" />
          <span>Convenciones NFPA 72:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-slate-700 text-[11px]">
          {/* Global Hotspot Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer bg-white px-2 py-1 rounded-lg border border-slate-300 shadow-2xs">
            <input
              type="checkbox"
              checked={showHotspots}
              onChange={(e) => setShowHotspots(e.target.checked)}
              className="rounded text-red-600 focus:ring-0 cursor-pointer"
            />
            <span className="font-bold text-red-700">Puntos de Obra ({allLevelNodes.length})</span>
          </label>

          <div className="h-4 w-px bg-slate-300"></div>

          {/* Conduit Legend Indicator */}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200">
            <span className="w-4 h-1 bg-red-600 rounded inline-block"></span>
            <span>Tubería EMT 3/4" & 1"</span>
          </div>

          {/* Detector Humo Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer px-2 py-1 bg-white rounded-lg border border-slate-200 hover:border-red-300 transition-colors">
            <input
              type="checkbox"
              checked={filterS}
              onChange={(e) => setFilterS(e.target.checked)}
              className="rounded text-red-600 focus:ring-0 cursor-pointer"
            />
            <span className="w-3.5 h-3.5 rounded-full border border-red-600 bg-white text-[8px] font-bold text-red-600 flex items-center justify-center">
              S
            </span>
            <span>Humo ({counts['S'] || 0})</span>
          </label>

          {/* Estación Manual Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer px-2 py-1 bg-white rounded-lg border border-slate-200 hover:border-red-300 transition-colors">
            <input
              type="checkbox"
              checked={filterF}
              onChange={(e) => setFilterF(e.target.checked)}
              className="rounded text-red-600 focus:ring-0 cursor-pointer"
            />
            <span className="w-3.5 h-3.5 rounded bg-red-700 text-white text-[8px] font-bold flex items-center justify-center">
              F
            </span>
            <span>Manual ({counts['F'] || 0})</span>
          </label>

          {/* Detector Térmico Toggle (if present) */}
          {Boolean(counts['H']) && (
            <label className="flex items-center gap-1.5 cursor-pointer px-2 py-1 bg-white rounded-lg border border-slate-200 hover:border-red-300 transition-colors">
              <input
                type="checkbox"
                checked={filterH}
                onChange={(e) => setFilterH(e.target.checked)}
                className="rounded text-orange-600 focus:ring-0 cursor-pointer"
              />
              <span className="w-3.5 h-3.5 rounded-full border border-orange-600 bg-white text-[8px] font-bold text-orange-600 flex items-center justify-center">
                H
              </span>
              <span>Térmico ({counts['H'] || 0})</span>
            </label>
          )}

          {/* Special Equipment Toggle (AR, CO, FACP) */}
          {Boolean((counts['AR'] || 0) + (counts['co'] || 0) + (counts['CR'] || 0) + (counts['FACP'] || 0)) && (
            <label className="flex items-center gap-1.5 cursor-pointer px-2 py-1 bg-white rounded-lg border border-slate-200 hover:border-red-300 transition-colors">
              <input
                type="checkbox"
                checked={filterOther}
                onChange={(e) => setFilterOther(e.target.checked)}
                className="rounded text-purple-600 focus:ring-0 cursor-pointer"
              />
              <span className="px-1 py-0.5 rounded bg-purple-700 text-white text-[7px] font-bold">
                AR/CO
              </span>
              <span>Especiales ({(counts['AR'] || 0) + (counts['co'] || 0) + (counts['CR'] || 0) + (counts['FACP'] || 0)})</span>
            </label>
          )}
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

          {/* 2. INTERACTIVE SVG PRECISION CAD RETICLES (2004 x 1417 pt EXACT NATIVE PDF COORD) */}
          {showHotspots && (
            <svg
              viewBox="0 0 2004 1417"
              className="absolute inset-0 w-full h-full pointer-events-auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              {visibleNodes.map((node) => {
                const isSelected =
                  activeSelected?.code === node.code ||
                  activeSelected?.name.toLowerCase().includes(node.name.toLowerCase());
                const isHovered = hoveredNode?.code === node.code;

                // Match with FloorItem from props or create exact item
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
                  notes: `Componente identificado en plano oficial de detección: ${node.room}`,
                };

                const isSquare = node.symbol === 'F';
                const isRect = node.symbol === 'AR' || node.symbol === 'FACP';

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
                    {/* Generous invisible target for smooth hit testing */}
                    <circle cx={node.x} cy={node.y} r="9" fill="transparent" />

                    {/* Pulsing Selection Radar Aura */}
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="12"
                        fill={node.color}
                        fillOpacity="0.25"
                        stroke={node.color}
                        strokeWidth="1.2"
                        strokeDasharray="3,1.5"
                        className="animate-spin"
                        style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                      />
                    )}

                    {/* Precision Reticle Shape */}
                    {isSquare ? (
                      <rect
                        x={node.x - (isSelected || isHovered ? 4.5 : 3.5)}
                        y={node.y - (isSelected || isHovered ? 4.5 : 3.5)}
                        width={isSelected || isHovered ? 9 : 7}
                        height={isSelected || isHovered ? 9 : 7}
                        rx="1.5"
                        fill={isSelected ? '#b91c1c' : isHovered ? '#ef4444' : node.color}
                        stroke="#ffffff"
                        strokeWidth={isSelected || isHovered ? 1.2 : 0.8}
                        className="drop-shadow-sm transition-all duration-150"
                      />
                    ) : isRect ? (
                      <rect
                        x={node.x - (isSelected || isHovered ? 7 : 5.5)}
                        y={node.y - (isSelected || isHovered ? 4.5 : 3.5)}
                        width={isSelected || isHovered ? 14 : 11}
                        height={isSelected || isHovered ? 9 : 7}
                        rx="1.5"
                        fill={isSelected ? '#991b1b' : isHovered ? '#7c3aed' : node.color}
                        stroke="#ffffff"
                        strokeWidth={isSelected || isHovered ? 1.2 : 0.8}
                        className="drop-shadow-sm transition-all duration-150"
                      />
                    ) : (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isSelected || isHovered ? 5.8 : 4.2}
                        fill={isSelected ? '#b91c1c' : isHovered ? '#ef4444' : node.color}
                        stroke="#ffffff"
                        strokeWidth={isSelected || isHovered ? 1.2 : 0.8}
                        className="drop-shadow-sm transition-all duration-150"
                      />
                    )}

                    {/* Symbol Text */}
                    <text
                      x={node.x}
                      y={node.y}
                      dy={node.symbol.length > 2 ? 0.9 : 1.1}
                      fill="#ffffff"
                      fontSize={node.symbol.length > 2 ? 2.3 : 3.2}
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="pointer-events-none select-none"
                    >
                      {node.symbol}
                    </text>

                    {/* Engineering HUD Tooltip Card on Hover or Selection */}
                    {(isHovered || isSelected) && (
                      <g className="pointer-events-none animate-in fade-in duration-100">
                        <rect
                          x={node.x - 70}
                          y={node.y - 28}
                          width="140"
                          height="22"
                          rx="4"
                          fill="#0f172a"
                          stroke="#ffffff"
                          strokeWidth="0.8"
                          opacity="0.95"
                          className="drop-shadow-lg"
                        />
                        <text
                          x={node.x}
                          y={node.y - 17}
                          fill="#ffffff"
                          fontSize="3.6"
                          fontWeight="bold"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {node.code} · {node.symbol}
                        </text>
                        <text
                          x={node.x}
                          y={node.y - 9}
                          fill="#cbd5e1"
                          fontSize="2.8"
                          fontFamily="sans-serif"
                          textAnchor="middle"
                        >
                          {node.room.length > 28 ? `${node.room.slice(0, 26)}...` : node.room}
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
                {activeSelected.status === 'inspected' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Clock className="w-3.5 h-3.5" />
                )}
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
