'use client';

import React, { useState } from 'react';
import { Project } from '@/src/schemas/project.schema';
import { FloorItem } from '@/src/schemas/floor-item.schema';
import { updateItemStatus } from '@/src/lib/projects-data';
import { ItemsRepository } from '@/src/services/items.repository';
import {
  Search,
  Camera,
  X,
  FileText,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ExternalLink,
  Save,
} from 'lucide-react';

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

  // Modal de Detalle / Observaciones / Evidencia
  const [activeItem, setActiveItem] = useState<FloorItem | null>(null);
  const [editStatus, setEditStatus] = useState<'pending' | 'installed' | 'inspected'>('pending');
  const [editNotes, setEditNotes] = useState('');
  const [editTeam, setEditTeam] = useState('');
  const [editPhotoUrl, setEditPhotoUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  const handleOpenModal = (item: FloorItem) => {
    setActiveItem(item);
    setEditStatus(item.status);
    setEditNotes(item.notes || '');
    setEditTeam(item.installerTeam || '');
    setEditPhotoUrl(item.photoUrl || '');
    setSaveSuccess(false);
  };

  const handleCloseModal = () => {
    setActiveItem(null);
    setSaveSuccess(false);
  };

  const handleQuickStatusChange = (
    e: React.MouseEvent,
    itemId: string,
    newStatus: 'pending' | 'installed' | 'inspected'
  ) => {
    e.stopPropagation();
    if (!canEdit) return;
    updateItemStatus(project.id, itemId, newStatus);
    onRefresh();
  };

  const handleSaveModalChanges = async () => {
    if (!activeItem || !canEdit) return;
    setIsSaving(true);
    try {
      // 1. Guardar en almacenamiento local sincronizado
      updateItemStatus(project.id, activeItem.id, editStatus, {
        notes: editNotes.trim(),
        installerTeam: editTeam.trim(),
        photoUrl: editPhotoUrl.trim(),
      });

      // 2. Intentar guardar en Supabase si hay conexión activa
      try {
        const repo = new ItemsRepository();
        await repo.updateItemStatus(activeItem.id, {
          status: editStatus,
          notes: editNotes.trim(),
          installerTeam: editTeam.trim(),
          photoUrl: editPhotoUrl.trim(),
          installedAt:
            editStatus !== 'pending'
              ? activeItem.installedAt || new Date().toISOString()
              : undefined,
        });
      } catch (err) {
        console.warn('Actualización local realizada; Supabase remoto offline o no disponible:', err);
      }

      setSaveSuccess(true);
      onRefresh();
      setTimeout(() => {
        handleCloseModal();
      }, 700);
    } finally {
      setIsSaving(false);
    }
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
                <th className="px-4 py-3 text-center">Evidencia</th>
                {canEdit && <th className="px-4 py-3 text-right">Actualizar Estado</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-gsitText-secondary">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={canEdit ? 9 : 8} className="px-4 py-8 text-center text-gsitText-muted">
                    No se encontraron elementos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleOpenModal(item)}
                    className="hover:bg-surface-main/80 transition-colors cursor-pointer group"
                    title="Clic para ver ficha técnica, observaciones y foto de evidencia"
                  >
                    <td className="px-4 py-3 font-bold text-brand-primary whitespace-nowrap group-hover:underline">
                      {item.code}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-brand-deep">{item.name}</div>
                      <div className="text-[11px] text-gsitText-muted flex items-center gap-2 mt-0.5">
                        <span>{item.model}</span>
                        {item.notes && (
                          <span className="text-[10px] text-brand-primary truncate max-w-xs font-normal">
                            &bull; 📝 {item.notes}
                          </span>
                        )}
                      </div>
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
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {item.photoUrl ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          <Camera className="w-3 h-3 text-emerald-600" />
                          <span>Foto</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-gsitText-muted">Sin foto</span>
                      )}
                    </td>
                    {canEdit && (
                      <td className="px-4 py-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={(e) => handleQuickStatusChange(e, item.id, 'pending')}
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
                            onClick={(e) => handleQuickStatusChange(e, item.id, 'installed')}
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
                            onClick={(e) => handleQuickStatusChange(e, item.id, 'inspected')}
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

      {/* Ventana Flotante / Modal de Detalle, Evidencias y Observaciones */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-surface-border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto text-xs font-mono">
            {/* Modal Header */}
            <div className="p-5 border-b border-surface-border bg-surface-subtle flex items-start justify-between gap-4 sticky top-0 z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-brand-primary">{activeItem.code}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                      editStatus === 'inspected'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : editStatus === 'installed'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {editStatus}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-brand-deep mt-1">{activeItem.name}</h3>
                <p className="text-[11px] text-gsitText-muted">{activeItem.model}</p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1 rounded-lg hover:bg-surface-main text-gsitText-muted hover:text-gsitText-main"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Technical & Commercial Information Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-surface-main border border-surface-border text-[11px]">
                <div>
                  <span className="text-gsitText-muted block">Zona / Nivel:</span>
                  <strong className="text-brand-deep">{activeItem.zone}</strong>
                </div>
                <div>
                  <span className="text-gsitText-muted block">Cantidad:</span>
                  <strong className="text-brand-deep">
                    {activeItem.quantity} {activeItem.unit}
                  </strong>
                </div>
                <div>
                  <span className="text-gsitText-muted block">Valor Unitario:</span>
                  <strong className="text-brand-deep">
                    ${activeItem.unitPrice.toLocaleString('es-CO')}
                  </strong>
                </div>
                <div>
                  <span className="text-gsitText-muted block">Subtotal:</span>
                  <strong className="text-brand-deep">
                    ${(activeItem.quantity * activeItem.unitPrice).toLocaleString('es-CO')}
                  </strong>
                </div>
              </div>

              {/* Status and Installation Execution Section */}
              <div className="p-4 rounded-xl border border-surface-border bg-white space-y-3">
                <h4 className="font-bold text-brand-deep uppercase text-[11px] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-primary" />
                  Estado de Ejecución y Cuadrilla
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gsitText-secondary mb-1 font-bold">Estado Técnico</label>
                    {canEdit ? (
                      <select
                        value={editStatus}
                        onChange={(e) =>
                          setEditStatus(e.target.value as 'pending' | 'installed' | 'inspected')
                        }
                        className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none"
                      >
                        <option value="pending">Planificado / Pendiente</option>
                        <option value="installed">Instalado en Obra</option>
                        <option value="inspected">Comisionado / Aprobado</option>
                      </select>
                    ) : (
                      <div className="p-2 bg-surface-main rounded-xl border border-surface-border font-bold uppercase">
                        {activeItem.status}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gsitText-secondary mb-1 font-bold">Cuadrilla / Responsable</label>
                    {canEdit ? (
                      <input
                        type="text"
                        placeholder="Ej: Cuadrilla Alfa, Ing. Residente..."
                        value={editTeam}
                        onChange={(e) => setEditTeam(e.target.value)}
                        className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none"
                      />
                    ) : (
                      <div className="p-2 bg-surface-main rounded-xl border border-surface-border text-gsitText-secondary">
                        {activeItem.installerTeam || 'No asignada'}
                      </div>
                    )}
                  </div>
                </div>

                {activeItem.installedAt && (
                  <div className="text-[11px] text-gsitText-muted flex items-center gap-1.5 pt-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                    <span>
                      Fecha de registro:{' '}
                      <strong>{activeItem.installedAt.replace('T', ' ').substring(0, 16)}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Photographic Evidence Section */}
              <div className="p-4 rounded-xl border border-surface-border bg-white space-y-3">
                <h4 className="font-bold text-brand-deep uppercase text-[11px] flex items-center gap-2">
                  <Camera className="w-4 h-4 text-brand-cyan" />
                  Evidencia Fotográfica de Obra
                </h4>

                {editPhotoUrl ? (
                  <div className="space-y-2">
                    <div className="rounded-xl overflow-hidden bg-surface-main border border-surface-border aspect-video flex items-center justify-center max-h-64">
                      <img
                        src={editPhotoUrl}
                        alt={`Evidencia ${activeItem.code}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-end">
                      <a
                        href={editPhotoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-brand-primary hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Abrir imagen en alta resolución</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-surface-border p-6 text-center text-gsitText-muted space-y-1">
                    <Camera className="w-7 h-7 mx-auto opacity-40" />
                    <p>Sin fotografía de campo vinculada a este equipo.</p>
                  </div>
                )}

                {canEdit && (
                  <div className="pt-2">
                    <label className="block text-gsitText-secondary mb-1 font-bold">
                      Enlace de Foto (URL Supabase / Storage)
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={editPhotoUrl}
                      onChange={(e) => setEditPhotoUrl(e.target.value)}
                      className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Technical Observations Section */}
              <div className="p-4 rounded-xl border border-surface-border bg-white space-y-2">
                <h4 className="font-bold text-brand-deep uppercase text-[11px] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-primary" />
                  Observaciones Técnicas de Campo
                </h4>

                {canEdit ? (
                  <div>
                    <textarea
                      rows={3}
                      placeholder="Detalla observaciones técnicas, condiciones del soporte, calibración o novedades..."
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none leading-relaxed"
                    />
                    <span className="text-[10px] text-gsitText-muted block mt-1">
                      Estas observaciones son registrables desde campo por el instalador o aquí por el ingeniero supervisor.
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border text-gsitText-secondary leading-relaxed">
                    {activeItem.notes || 'Sin observaciones registradas.'}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-surface-border bg-surface-subtle flex items-center justify-between">
              <div>
                {saveSuccess && (
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Cambios guardados con éxito</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl border border-surface-borderStrong text-gsitText-secondary hover:bg-surface-main"
                >
                  Cerrar
                </button>
                {canEdit && (
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={handleSaveModalChanges}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-deep hover:bg-brand-hover text-white font-bold disabled:opacity-50 transition-all shadow-sm"
                  >
                    <Save className="w-4 h-4 text-brand-cyan" />
                    <span>{isSaving ? 'Guardando...' : 'Guardar Observaciones'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
