'use client';

import React, { useState } from 'react';
import { Project } from '@/src/schemas/project.schema';
import { FloorItem } from '@/src/schemas/floor-item.schema';
import { ShieldCheck, Camera, UserCheck, Calendar, MapPin } from 'lucide-react';

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

const ESTADIO_INSPECTIONS: InspectionRecord[] = [
  {
    id: 'insp-em-1',
    itemCode: 'EST-FACP-01',
    itemName: 'Panel Principal de Alarma & Control Central FACP',
    zone: 'Zona 1 — Gradería Occidental & Prensa',
    inspector: 'Ing. Carlos Mendoza (Interventoría Caribe)',
    date: '2026-03-12',
    result: 'conforme',
    notes: 'Prueba de lazo SLC direccionable, transferencia a baterías 24V y comunicación conforme bajo NFPA 72.',
  },
  {
    id: 'insp-em-2',
    itemCode: 'EST-TUB-01',
    itemName: 'Tubería Conduit EMT 1" Galvanizada en Caliente',
    zone: 'Zona 1 — Gradería Occidental & Prensa',
    inspector: 'Ing. Carlos Mendoza (Interventoría Caribe)',
    date: '2026-03-18',
    result: 'conforme',
    notes: 'Trazado troncal con abrazaderas antisísmicas y continuidad equipotencial de puesta a tierra conforme a RETIE.',
  },
  {
    id: 'insp-em-3',
    itemCode: 'EST-DET-01',
    itemName: 'Detector Óptico de Humo Haz Proyectado (Beam)',
    zone: 'Zona 1 — Gradería Occidental & Prensa',
    inspector: 'Tec. Marcelo Barraza (Global Solutions IT)',
    date: '2026-03-22',
    result: 'conforme',
    notes: 'Calibración de haz óptico a 12m de elevación y conexión a tubería Conduit EMT 1" aprobada.',
  },
  {
    id: 'insp-em-4',
    itemCode: 'EST-BOM-01',
    itemName: 'Módulo de Monitoreo Tablero Bomba Principal RCI',
    zone: 'Zona 6 — Cuarto Bombas & Subestación',
    inspector: 'Ing. Carlos Mendoza (Interventoría Caribe)',
    date: '2026-03-24',
    result: 'conforme',
    notes: 'Supervisión de presostato y conmutación de bombas contra incendio enlazadas al FACP.',
  },
  {
    id: 'insp-em-5',
    itemCode: 'EST-PAL-01',
    itemName: 'Estación Manual de Alarma Doble Acción Intemperie',
    zone: 'Zona 1 — Gradería Occidental & Prensa',
    inspector: 'Tec. Marcelo Barraza (Global Solutions IT)',
    date: '2026-03-25',
    result: 'observacion',
    notes: 'Instalada a 1.20m de altura en acceso a prensa. Conexión rígida con tubería Conduit EMT 3/4".',
  },
];

const TITANIUM_INSPECTIONS: InspectionRecord[] = [
  {
    id: 'insp-tt-1',
    itemCode: 'FACP-01',
    itemName: 'Panel Principal de Alarma Contra Incendio',
    zone: 'Piso 1 — Lobby Principal & FACP',
    inspector: 'Ing. Carlos Mendoza (Interventoría)',
    date: '2026-03-20',
    result: 'conforme',
    notes: 'Prueba de lazo SLC y transferencia a batería de respaldo 24V superada satisfactoriamente bajo NFPA 72 Cap. 14.',
  },
  {
    id: 'insp-tt-2',
    itemCode: 'TUB-RIS-01',
    itemName: 'Tubería Conduit EMT 1-1/2" Troncal Vertical (Riser)',
    zone: 'Piso 1 — Lobby Principal & FACP',
    inspector: 'Ing. Carlos Mendoza (Interventoría)',
    date: '2026-03-21',
    result: 'conforme',
    notes: 'Montante vertical en ducto eléctrico técnico y cajas de paso con soportería unistrut conforme a norma.',
  },
  {
    id: 'insp-tt-3',
    itemCode: 'DET-SMK-01',
    itemName: 'Detector Fotoeléctrico Direccionable Inteligente',
    zone: 'Piso 3 — Oficinas Corporativas',
    inspector: 'Tec. Marcelo Barraza (Global Solutions IT)',
    date: '2026-03-24',
    result: 'conforme',
    notes: 'Verificación de dirección 101 en panel y destello de LED indicador con alimentación por tubería Conduit.',
  },
  {
    id: 'insp-tt-4',
    itemCode: 'TUB-EMT-34',
    itemName: 'Tubería Metálica Eléctrica Conduit EMT 3/4"',
    zone: 'Piso 2 — Auditorio & Mezzanine',
    inspector: 'Ing. Carlos Mendoza (Interventoría)',
    date: '2026-03-25',
    result: 'observacion',
    notes: 'Ajustar abrazadera en curva previa a caja de paso 4x4. Corregido en obra.',
  },
];

export default function InspectionsTab({
  project,
  items,
  canEdit = false,
  onLocateOnBlueprint,
}: Props) {
  const [inspections, setInspections] = useState<InspectionRecord[]>(() => {
    if (project.id === 'estadio-metropolitano') return ESTADIO_INSPECTIONS;
    if (project.id === 'torre-titanium') return TITANIUM_INSPECTIONS;
    return ESTADIO_INSPECTIONS;
  });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    itemCode: items[0]?.code || '',
    inspector: 'Ing. Auditor NFPA 72',
    result: 'conforme' as const,
    notes: '',
  });

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

    setInspections([newRecord, ...inspections]);
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
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-surface-border bg-white shadow-sm">
        <div>
          <h3 className="text-sm font-black text-brand-deep tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" strokeWidth={2} />
            Auditoría In-Situ &amp; Evidencias de Campo
          </h3>
          <p className="text-xs text-gsitText-secondary mt-0.5">
            Registro de actas de verificación técnica bajo NFPA 72 y RETIE
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-deep hover:bg-brand-hover text-white font-bold text-xs transition-all shadow-sm self-start sm:self-auto"
          >
            <Camera className="w-4 h-4 text-brand-cyan" strokeWidth={2} />
            <span>{showForm ? 'Cerrar Formulario' : '➕ Registrar Inspección'}</span>
          </button>
        )}
      </div>

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
                onChange={(e) => setFormData({ ...formData, result: e.target.value as any })}
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
    </div>
  );
}
