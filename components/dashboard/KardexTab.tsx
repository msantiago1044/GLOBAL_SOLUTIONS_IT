'use client';

import React, { useState } from 'react';
import { Project } from '@/src/schemas/project.schema';
import { FloorItem } from '@/src/schemas/floor-item.schema';
import { updateItemStatus } from '@/src/lib/projects-data';
import { Search } from 'lucide-react';

interface Props {
  project: Project;
  items: FloorItem[];
  canEdit?: boolean;
  onRefresh: () => void;
}

export default function KardexTab({ project, items, canEdit = false, onRefresh }: Props) {
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
    if (!canEdit) return;
    updateItemStatus(project.id, itemId, newStatus);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="rounded-2xl border border-surface-border bg-white p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gsitText-muted" strokeWidth={2} />
          <input
            type="text"
            placeholder="Buscar por código, nombre, zona o modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-surface-border bg-surface-main pl-9 pr-3 py-2 text-xs font-mono text-gsitText-main placeholder-gsitText-muted focus:border-brand-primary focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as 'all' | 'pending' | 'installed' | 'inspected'
              )
            }
            className="rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-xs font-mono text-gsitText-secondary focus:border-brand-primary focus:outline-none"
          >
            <option value="all">Todos los Estados</option>
            <option value="pending">Planificado / Pendiente</option>
            <option value="installed">Instalado en Obra</option>
            <option value="inspected">Comisionado / Aprobado</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-xs font-mono text-gsitText-secondary focus:border-brand-primary focus:outline-none"
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
      <div className="rounded-2xl border border-surface-border bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-surface-subtle text-gsitText-secondary uppercase tracking-wider border-b border-surface-border font-bold">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Componente / Especificación</th>
                <th className="px-4 py-3">Zona / Nivel</th>
                <th className="px-4 py-3">Metrado / Cant</th>
                <th className="px-4 py-3">Valor Unitario</th>
                <th className="px-4 py-3">Valor Total</th>
                <th className="px-4 py-3">Estado</th>
                {canEdit && <th className="px-4 py-3 text-right">Actualizar Estado</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-gsitText-secondary">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={canEdit ? 8 : 7} className="px-4 py-8 text-center text-gsitText-muted">
                    No se encontraron elementos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-main transition-colors">
                    <td className="px-4 py-3 font-bold text-brand-primary whitespace-nowrap">
                      {item.code}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-brand-deep">{item.name}</div>
                      <div className="text-[11px] text-gsitText-muted">{item.model}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gsitText-secondary">
                      {item.zone}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-bold text-brand-deep">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gsitText-muted">
                      ${item.unitPrice.toLocaleString('es-CO')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-bold text-brand-deep">
                      ${(item.quantity * item.unitPrice).toLocaleString('es-CO')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase border ${
                          item.status === 'inspected'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.status === 'installed'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    {canEdit && (
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleStatusChange(item.id, 'pending')}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors border ${
                              item.status === 'pending'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-white hover:bg-surface-subtle text-gsitText-muted border-surface-border'
                            }`}
                            title="Marcar como Planificado"
                          >
                            Plan
                          </button>
                          <button
                            onClick={() => handleStatusChange(item.id, 'installed')}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors border ${
                              item.status === 'installed'
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-white hover:bg-surface-subtle text-gsitText-muted border-surface-border'
                            }`}
                            title="Marcar como Instalado"
                          >
                            Instalado
                          </button>
                          <button
                            onClick={() => handleStatusChange(item.id, 'inspected')}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors border ${
                              item.status === 'inspected'
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                : 'bg-white hover:bg-surface-subtle text-gsitText-muted border-surface-border'
                            }`}
                            title="Marcar como Comisionado / Inspeccionado"
                          >
                            Inspeccionado
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Summary Footer */}
        <div className="px-4 py-3 bg-surface-subtle border-t border-surface-border flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-gsitText-secondary">
          <div>
            Total Mostrado: <strong className="text-brand-deep">{filteredItems.length}</strong> de {items.length} ítems
          </div>
          <div>
            Suma de Valoración:{' '}
            <strong className="text-brand-deep font-bold">
              ${filteredItems.reduce((acc, curr) => acc + curr.quantity * curr.unitPrice, 0).toLocaleString('es-CO')} COP
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
