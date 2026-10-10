'use client';

import React, { useState } from 'react';
import { Project } from '@/src/schemas/project.schema';
import { FloorItem } from '@/src/schemas/floor-item.schema';
import { updateItemStatus } from '@/src/lib/projects-data';
import { Search, Filter, CheckCircle2, Clock, Wrench, ShieldCheck } from 'lucide-react';

interface Props {
  project: Project;
  items: FloorItem[];
  onRefresh: () => void;
}

export default function KardexTab({ project, items, onRefresh }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'installed' | 'inspected'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleStatusChange = (itemId: string, newStatus: 'pending' | 'installed' | 'inspected') => {
    updateItemStatus(project.id, itemId, newStatus);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="rounded-xl border border-industrial-800 bg-industrial-900 p-4 shadow-industrial-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-industrial-500" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Buscar por código, nombre, zona o modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-industrial-800 bg-industrial-950 pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-industrial-600 focus:border-radar-500 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-lg border border-industrial-800 bg-industrial-950 px-3 py-2 text-xs font-mono text-industrial-300 focus:border-radar-500 focus:outline-none"
          >
            <option value="all">Todos los Estados</option>
            <option value="pending">Planificado / Pendiente</option>
            <option value="installed">Instalado en Obra</option>
            <option value="inspected">Comisionado / Aprobado</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-industrial-800 bg-industrial-950 px-3 py-2 text-xs font-mono text-industrial-300 focus:border-radar-500 focus:outline-none"
          >
            <option value="all">Todas las Categorías</option>
            <option value="tuberia">Tuberías Conduit EMT</option>
            <option value="cableado">Cableado FPLR</option>
            <option value="detector-autonomo">Detectores de Humo</option>
            <option value="sirena">Sirenas y Notificación</option>
            <option value="palanca">Estaciones Manuales</option>
            <option value="facp">Paneles FACP</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-industrial-800 bg-industrial-900 overflow-hidden shadow-industrial-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-industrial-850/80 text-industrial-400 uppercase tracking-wider border-b border-industrial-800">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Componente / Especificación</th>
                <th className="px-4 py-3">Zona / Nivel</th>
                <th className="px-4 py-3">Metrado / Cant</th>
                <th className="px-4 py-3">Valor Unitario</th>
                <th className="px-4 py-3">Valor Total</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Actualizar Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-850 text-industrial-300">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-industrial-500">
                    No se encontraron elementos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-industrial-850/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-radar-500 whitespace-nowrap">
                      {item.code}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{item.name}</div>
                      <div className="text-[11px] text-industrial-500">{item.model}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-industrial-400">
                      {item.zone}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-bold text-white">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-industrial-400">
                      ${item.unitPrice.toLocaleString('es-CO')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-bold text-radar-400">
                      ${(item.quantity * item.unitPrice).toLocaleString('es-CO')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                          item.status === 'inspected'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : item.status === 'installed'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-radar-500/20 text-radar-500 border border-radar-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleStatusChange(item.id, 'pending')}
                          className={`px-2 py-1 rounded text-[10px] transition-colors ${
                            item.status === 'pending'
                              ? 'bg-radar-500 text-industrial-950 font-bold'
                              : 'bg-industrial-850 hover:bg-industrial-800 text-industrial-400'
                          }`}
                          title="Marcar como Planificado"
                        >
                          Plan
                        </button>
                        <button
                          onClick={() => handleStatusChange(item.id, 'installed')}
                          className={`px-2 py-1 rounded text-[10px] transition-colors ${
                            item.status === 'installed'
                              ? 'bg-blue-500 text-white font-bold'
                              : 'bg-industrial-850 hover:bg-industrial-800 text-industrial-400'
                          }`}
                          title="Marcar como Instalado"
                        >
                          Instalado
                        </button>
                        <button
                          onClick={() => handleStatusChange(item.id, 'inspected')}
                          className={`px-2 py-1 rounded text-[10px] transition-colors ${
                            item.status === 'inspected'
                              ? 'bg-emerald-500 text-industrial-950 font-bold'
                              : 'bg-industrial-850 hover:bg-industrial-800 text-industrial-400'
                          }`}
                          title="Marcar como Comisionado / Inspeccionado"
                        >
                          Inspeccionado
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Summary Footer */}
        <div className="px-4 py-3 bg-industrial-850/80 border-t border-industrial-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-industrial-400">
          <div>
            Total Mostrado: <strong className="text-white">{filteredItems.length}</strong> de {items.length} ítems
          </div>
          <div>
            Suma de Valoración:{' '}
            <strong className="text-radar-500">
              ${filteredItems.reduce((acc, curr) => acc + curr.quantity * curr.unitPrice, 0).toLocaleString('es-CO')} COP
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
