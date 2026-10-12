'use client';

import React, { useState } from 'react';
import { Project } from '@/src/schemas/project.schema';
import { FloorItem } from '@/src/schemas/floor-item.schema';
import {
  ShieldCheck,
  Camera,
  UserCheck,
  Calendar,
  MapPin,
  ExternalLink,
  X,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

interface Props {
  project: Project;
  items: FloorItem[];
  canEdit?: boolean;
  onLocateOnBlueprint?: (itemCode: string, zoneName: string) => void;
}

interface InspectionRecord {
  id: string;
  itemCode: string;
  itemName: string;
  zone: string;
  inspector: string;
  date: string;
  result: 'conforme' | 'observacion' | 'no-conforme';
  notes: string;
}

export default function InspectionsTab({
  project,
  items,
  canEdit = false,
  onLocateOnBlueprint,
}: Props) {
  const [activeSubTab, setActiveSubTab] = useState<'inspections' | 'photos'>('photos');
  const [selectedPhotoItem, setSelectedPhotoItem] = useState<FloorItem | null>(null);

  const [inspections, setInspections] = useState<InspectionRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`gsit_inspections_${project.id}`);
        if (stored) {
          const parsed = JSON.parse(stored) as InspectionRecord[];
          const userOnly = parsed.filter(
            (i) => !i.id.startsWith('insp-em-') && !i.id.startsWith('insp-tt-')
          );
          if (userOnly.length !== parsed.length) {
            localStorage.setItem(`gsit_inspections_${project.id}`, JSON.stringify(userOnly));
          }
          return userOnly;
        }
      } catch {
        // fallback
      }
    }
    return [];
  });

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{
    itemCode: string;
    inspector: string;
    result: 'conforme' | 'observacion' | 'no-conforme';
    notes: string;
  }>({
    itemCode: items[0]?.code || '',
    inspector: 'Ing. Auditor NFPA 72',
    result: 'conforme',
    notes: '',
  });

  // Equipos con evidencia fotográfica o instalados
  const itemsWithPhotos = items.filter((i) => Boolean(i.photoUrl));
  const installedItemsWithNotes = items.filter(
    (i) => i.status !== 'pending' && Boolean(i.notes || i.photoUrl)
  );

  const handleAddInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    const targetItem = items.find((i) => i.code === formData.itemCode) || items[0];
    const newRecord: InspectionRecord = {
      id: `insp-${Date.now()}`,
      itemCode: formData.itemCode,
      itemName: targetItem ? targetItem.name : 'Elemento de Red',
      zone: targetItem ? targetItem.zone : 'Zona General',
      inspector: formData.inspector,
      date: new Date().toISOString().split('T')[0] || '2026-10-10',
      result: formData.result,
      notes: formData.notes,
    };

    const updated = [newRecord, ...inspections];
    setInspections(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`gsit_inspections_${project.id}`, JSON.stringify(updated));
    }
    setShowForm(false);
    setFormData({
      itemCode: items[0]?.code || '',
      inspector: 'Ing. Auditor NFPA 72',
      result: 'conforme',
      notes: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and SubTab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-surface-border bg-white shadow-sm">
        <div>
          <h3 className="text-sm font-black text-brand-deep tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" strokeWidth={2} />
            Auditoría In-Situ &amp; Evidencias de Campo
          </h3>
          <p className="text-xs text-gsitText-secondary mt-0.5">
            Registro de actas de verificación técnica bajo NFPA 72 y evidencias fotográficas móviles
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* SubTab switcher */}
          <div className="flex items-center rounded-xl bg-surface-main p-1 border border-surface-border text-xs font-mono">
            <button
              onClick={() => setActiveSubTab('photos')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubTab === 'photos'
                  ? 'bg-white text-brand-deep shadow-xs'
                  : 'text-gsitText-secondary hover:text-brand-deep'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Fotos de Campo ({itemsWithPhotos.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('inspections')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubTab === 'inspections'
                  ? 'bg-white text-brand-deep shadow-xs'
                  : 'text-gsitText-secondary hover:text-brand-deep'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-brand-primary" />
              <span>Actas de Inspección ({inspections.length})</span>
            </button>
          </div>

          {canEdit && activeSubTab === 'inspections' && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-deep hover:bg-brand-hover text-white font-bold text-xs transition-all shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-brand-cyan" strokeWidth={2} />
              <span>{showForm ? 'Cerrar' : '➕ Nueva Acta'}</span>
            </button>
          )}
        </div>
      </div>

      {/* SubTab 1: Evidencias Fotográficas de Campo */}
      {activeSubTab === 'photos' && (
        <div className="space-y-4">
          {installedItemsWithNotes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-surface-border p-12 text-center bg-white shadow-sm space-y-2">
              <Camera className="w-8 h-8 text-gsitText-muted mx-auto opacity-40" />
              <p className="text-xs font-mono text-gsitText-muted">
                No hay evidencias fotográficas registradas en campo aún.
              </p>
              <p className="text-[11px] font-mono text-gsitText-muted">
                Al registrar instalaciones desde el Bot de Telegram (@global_solutions_it_bot) o desde el Kárdex, aparecerán aquí con sus fotos y notas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {installedItemsWithNotes.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-surface-border bg-white overflow-hidden shadow-sm hover:border-brand-primary/40 transition-all flex flex-col justify-between"
                >
                  {/* Photo area */}
                  <div
                    onClick={() => item.photoUrl && setSelectedPhotoItem(item)}
                    className="relative bg-surface-main aspect-video border-b border-surface-border flex items-center justify-center cursor-pointer group overflow-hidden"
                  >
                    {item.photoUrl ? (
                      <>
                        <img
                          src={item.photoUrl}
                          alt={`Evidencia ${item.code}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono font-bold gap-1.5">
                          <ExternalLink className="w-4 h-4" />
                          <span>Ampliar Evidencia</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4 text-gsitText-muted">
                        <ImageIcon className="w-8 h-8 mx-auto opacity-30 mb-1" />
                        <span className="text-[11px] font-mono">Sin fotografía adjunta</span>
                      </div>
                    )}

                    <div className="absolute top-2 left-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-deep/90 text-white shadow-sm">
                        {item.code}
                      </span>
                    </div>

                    <div className="absolute top-2 right-2">
                      <span
                        className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border shadow-sm ${
                          item.status === 'inspected'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Information Area */}
                  <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between text-xs font-mono">
                    <div>
                      <h4 className="font-bold text-brand-deep line-clamp-1">{item.name}</h4>
                      <p className="text-[11px] text-gsitText-muted mt-0.5">{item.zone}</p>
                    </div>

                    {item.notes && (
                      <div className="p-2.5 rounded-xl bg-surface-subtle border border-surface-border text-gsitText-secondary text-[11px] leading-relaxed">
                        <span className="font-bold block text-brand-deep mb-0.5">Observación de Campo:</span>
                        "{item.notes}"
                      </div>
                    )}

                    <div className="pt-2 border-t border-surface-border flex items-center justify-between text-[11px] text-gsitText-muted">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-brand-primary" />
                        <span className="truncate max-w-[130px]">{item.installerTeam || 'Técnico'}</span>
                      </div>

                      {item.installedAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                          <span>{item.installedAt.split('T')[0]}</span>
                        </div>
                      )}
                    </div>

                    {onLocateOnBlueprint && (
                      <button
                        onClick={() => onLocateOnBlueprint(item.code, item.zone)}
                        className="w-full mt-2 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-main hover:bg-surface-subtle border border-surface-border text-brand-deep text-[11px] font-bold transition-all"
                      >
                        <MapPin className="w-3.5 h-3.5 text-brand-cyan" />
                        <span>Ver en Plano</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SubTab 2: Actas de Inspección */}
      {activeSubTab === 'inspections' && (
        <div className="space-y-6">
          {/* Add Inspection Form */}
          {canEdit && showForm && (
            <form
              onSubmit={handleAddInspection}
              className="rounded-2xl border-2 border-brand-primary/40 bg-white p-6 shadow-gsit-md space-y-4 animate-in fade-in duration-200 text-xs font-mono"
            >
              <div className="flex items-center justify-between border-b border-surface-border pb-2">
                <h4 className="font-bold text-brand-deep uppercase">Nueva Acta de Inspección</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gsitText-secondary mb-1 font-bold">Elemento Inspeccionado *</label>
                  <select
                    value={formData.itemCode}
                    onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                    className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none"
                  >
                    {items.map((i) => (
                      <option key={i.id} value={i.code}>
                        {i.code} — {i.name} ({i.zone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gsitText-secondary mb-1 font-bold">Auditor / Inspector *</label>
                  <input
                    type="text"
                    required
                    value={formData.inspector}
                    onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                    className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gsitText-secondary mb-1 font-bold">Dictamen Técnico *</label>
                  <select
                    value={formData.result}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        result: e.target.value as 'conforme' | 'observacion' | 'no-conforme',
                      })
                    }
                    className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none"
                  >
                    <option value="conforme">Conforme (Aprobado NFPA 72)</option>
                    <option value="observacion">Con Observaciones Menores</option>
                    <option value="no-conforme">No Conforme (Rechazado)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gsitText-secondary mb-1 font-bold">Observaciones Técnicas *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detalla pruebas de continuidad, apriete de conexiones o calibración..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl border border-surface-borderStrong text-gsitText-secondary hover:bg-surface-subtle"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-deep hover:bg-brand-hover text-white font-bold"
                >
                  Guardar Inspección
                </button>
              </div>
            </form>
          )}

          {/* Inspections Timeline Grid */}
          {inspections.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-surface-border p-12 text-center bg-white shadow-sm space-y-2">
              <ShieldCheck className="w-8 h-8 text-gsitText-muted mx-auto opacity-40" />
              <p className="text-xs font-mono text-gsitText-muted">
                Sin actas de inspección registradas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inspections.map((insp) => (
                <div
                  key={insp.id}
                  className="rounded-2xl border border-surface-border bg-white p-5 shadow-sm space-y-3 hover:border-brand-primary/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-surface-border pb-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-brand-primary">{insp.itemCode}</span>
                      <h4 className="text-xs font-bold text-brand-deep mt-0.5">{insp.itemName}</h4>
                      <p className="text-[11px] font-mono text-gsitText-muted">{insp.zone}</p>
                    </div>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase border ${
                        insp.result === 'conforme'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : insp.result === 'observacion'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {insp.result}
                    </span>
                  </div>

                  <p className="text-xs text-gsitText-secondary leading-relaxed">
                    "{insp.notes}"
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-gsitText-muted pt-2 border-t border-surface-border">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-brand-primary" strokeWidth={2} />
                        <span>{insp.inspector}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-brand-primary" strokeWidth={2} />
                        <span>{insp.date}</span>
                      </div>
                    </div>

                    {onLocateOnBlueprint && (
                      <button
                        onClick={() => onLocateOnBlueprint(insp.itemCode, insp.zone)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-deep hover:bg-brand-hover text-white text-[11px] font-mono font-bold transition-all shadow-xs self-start sm:self-auto"
                      >
                        <MapPin className="w-3.5 h-3.5 text-brand-cyan" />
                        <span>Ver Ubicación en Plano</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox Modal de Evidencia */}
      {selectedPhotoItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-surface-border shadow-2xl max-w-xl w-full overflow-hidden text-xs font-mono">
            <div className="p-4 border-b border-surface-border bg-surface-subtle flex items-center justify-between">
              <div>
                <span className="text-brand-primary font-bold">{selectedPhotoItem.code}</span>
                <h4 className="font-bold text-brand-deep text-sm">{selectedPhotoItem.name}</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhotoItem(null)}
                className="p-1 rounded-lg hover:bg-surface-main text-gsitText-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                <img
                  src={selectedPhotoItem.photoUrl || ''}
                  alt={`Evidencia ${selectedPhotoItem.code}`}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] p-3 rounded-xl bg-surface-main border border-surface-border">
                <div>
                  <span className="text-gsitText-muted block">Zona:</span>
                  <strong className="text-brand-deep">{selectedPhotoItem.zone}</strong>
                </div>
                <div>
                  <span className="text-gsitText-muted block">Cuadrilla:</span>
                  <strong className="text-brand-deep">{selectedPhotoItem.installerTeam || 'Técnico'}</strong>
                </div>
              </div>

              {selectedPhotoItem.notes && (
                <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border text-gsitText-secondary text-[11px]">
                  <span className="font-bold block text-brand-deep mb-0.5">Observación técnica:</span>
                  "{selectedPhotoItem.notes}"
                </div>
              )}
            </div>

            <div className="p-3 border-t border-surface-border bg-surface-subtle flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPhotoItem(null)}
                className="px-4 py-2 rounded-xl bg-brand-deep hover:bg-brand-hover text-white font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
