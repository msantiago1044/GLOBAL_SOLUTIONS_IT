'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/src/schemas/project.schema';
import { FloorZone, addItem, removeItem } from '@/src/lib/projects-data';
import { FloorItem } from '@/src/schemas/floor-item.schema';
import EstadioBlueprint from '@/components/blueprints/EstadioBlueprint';
import TitaniumBlueprint from '@/components/blueprints/TitaniumBlueprint';
import { Lock, Unlock, Plus, Trash2, Wrench, LogIn } from 'lucide-react';

interface Props {
  project: Project;
  floors: FloorZone[];
  items: FloorItem[];
  canEdit?: boolean;
  onRefresh: () => void;
  onOpenLockModal: () => void;
}

export default function BlueprintTab({
  project,
  floors,
  items,
  canEdit = false,
  onRefresh,
  onOpenLockModal,
}: Props) {
  const [selectedFloorId, setSelectedFloorId] = useState<string>(floors[0]?.id || '');
  const [showAddForm, setShowAddForm] = useState(false);

  // New item form state
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'detector-autonomo' as const,
    model: '',
    quantity: 1,
    unit: 'Unidad',
    unitPrice: 280000,
    notes: '',
  });

  const currentFloor = floors.find((f) => f.id === selectedFloorId) || floors[0];
  const isSchemaEditable = project.schemaStatus === 'editable';
  const canModifySchema = canEdit && isSchemaEditable;

  const floorItems = items.filter((i) => {
    if (!currentFloor) return true;
    return (
      i.zone.toLowerCase().includes(currentFloor.name.toLowerCase()) ||
      i.zone.includes(`Piso ${currentFloor.number}`) ||
      i.zone.includes(`Zona ${currentFloor.number}`)
    );
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canModifySchema || !currentFloor) return;

    const newItem: FloorItem = {
      id: `${project.id}-item-${Date.now()}`,
      projectId: project.id,
      code: formData.code.trim() || `ELEM-${Date.now().toString().slice(-4)}`,
      type: formData.type,
      name: formData.name.trim() || 'Elemento Técnico',
      model: formData.model.trim() || 'Estándar NFPA 72',
      zone: currentFloor.name,
      status: 'pending',
      quantity: Number(formData.quantity) || 1,
      unit: formData.unit,
      unitPrice: Number(formData.unitPrice) || 0,
      notes: formData.notes,
    };

    addItem(newItem);
    setFormData({
      code: '',
      name: '',
      type: 'detector-autonomo',
      model: '',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 280000,
      notes: '',
    });
    setShowAddForm(false);
    onRefresh();
  };

  const handleDeleteItem = (itemId: string) => {
    if (!canModifySchema) return;
    if (confirm('¿Eliminar este elemento del esquema técnico?')) {
      removeItem(project.id, itemId);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Schema Status & Actions */}
      <div className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm ${
        !canEdit
          ? 'bg-amber-50/50 border-amber-200'
          : canModifySchema
          ? 'bg-brand-ice/50 border-brand-light'
          : 'bg-white border-surface-border'
      }`}>
        <div className="flex items-start sm:items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
            !canEdit
              ? 'bg-amber-100 text-amber-800 border border-amber-300'
              : canModifySchema
              ? 'bg-brand-deep text-white'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            {!canEdit ? (
              <Lock className="w-5 h-5 text-amber-700" strokeWidth={2} />
            ) : canModifySchema ? (
              <Unlock className="w-5 h-5 text-brand-cyan" strokeWidth={2} />
            ) : (
              <Lock className="w-5 h-5 text-emerald-600" strokeWidth={2} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-brand-deep tracking-tight">
                {!canEdit
                  ? 'Modo: Solo Lectura (Sin Sesión)'
                  : canModifySchema
                  ? 'Modo: Esquema Técnico Editable'
                  : 'Esquema Técnico Bloqueado y Certificado'}
              </h3>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase border ${
                !canEdit
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : canModifySchema
                  ? 'bg-brand-ice text-brand-deep border-brand-light'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {!canEdit ? 'Solo Lectura' : canModifySchema ? 'Borrador Activo' : 'Congelado para Obra'}
              </span>
            </div>
            <p className="text-xs text-gsitText-secondary mt-0.5">
              {!canEdit
                ? 'Estás visualizando el esquema técnico en modo solo lectura. Debes iniciar sesión como administrador para agregar o eliminar elementos y bloquear el esquema.'
                : canModifySchema
                ? 'Puedes añadir tuberías, cables y equipos libremente. Cuando termines el diseño, bloquéalo para iniciar obra.'
                : 'El diseño ha sido congelado. No se pueden agregar ni borrar elementos; solo registrar su avance e inspección.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {!canEdit ? (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-deep hover:bg-brand-hover text-white font-bold text-xs tracking-wide transition-all shadow-sm"
            >
              <LogIn className="w-4 h-4 text-brand-cyan" strokeWidth={2} />
              <span>Iniciar Sesión para Editar</span>
            </Link>
          ) : canModifySchema ? (
            <>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-surface-subtle border border-surface-borderStrong text-xs font-bold text-brand-deep transition-all shadow-sm"
              >
                <Plus className="w-4 h-4 text-brand-primary" strokeWidth={2.5} />
                <span>{showAddForm ? 'Cerrar Formulario' : '➕ Añadir Elemento'}</span>
              </button>
              <button
                onClick={onOpenLockModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wide transition-all shadow-sm"
              >
                <Lock className="w-4 h-4" strokeWidth={2} />
                <span>Bloquear Esquema</span>
              </button>
            </>
          ) : null}
        </div>
      </div>

      {/* Add Item Form (When Editable and Authenticated) */}
      {canModifySchema && showAddForm && (
        <form
          onSubmit={handleCreateItem}
          className="rounded-2xl border-2 border-brand-primary/40 bg-white p-6 shadow-gsit-md space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <h4 className="text-xs font-bold font-mono uppercase text-brand-deep flex items-center gap-2">
              <Plus className="w-4 h-4 text-brand-primary" strokeWidth={2.5} />
              Agregar Componente Técnico al Esquema ({currentFloor?.name})
            </h4>
            <span className="text-xs text-gsitText-secondary">
              Zona Asignada: <strong className="text-brand-deep">{currentFloor?.name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <label className="block text-gsitText-secondary mb-1 font-bold">Código / Tag *</label>
              <input
                type="text"
                required
                placeholder="Ej. DET-SMK-10, TUB-01"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gsitText-secondary mb-1 font-bold">Tipo de Componente *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none"
              >
                <option value="detector-autonomo">Detector de Humo Óptico / Fotoeléctrico</option>
                <option value="tuberia">Tubería Conduit EMT / IMC</option>
                <option value="cableado">Cable FPLR Blindado 2x14 AWG</option>
                <option value="sirena">Sirena Estroboscópica Notifier</option>
                <option value="palanca">Estación Manual de Alarma (Palanca)</option>
                <option value="facp">Panel Principal FACP / Subpanel</option>
                <option value="cuadro-bomba">Tablero Bomba RCI / Red Contra Incendio</option>
              </select>
            </div>

            <div>
              <label className="block text-gsitText-secondary mb-1 font-bold">Nombre Técnico *</label>
              <input
                type="text"
                required
                placeholder="Ej. Tubería EMT 3/4 pulg"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gsitText-secondary mb-1 font-bold">Modelo / Fabricante</label>
              <input
                type="text"
                placeholder="Ej. Notifier FSP-951 / Colmena EMT"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <label className="block text-gsitText-secondary mb-1 font-bold">Cantidad / Longitud *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gsitText-secondary mb-1 font-bold">Unidad de Medida</label>
              <input
                type="text"
                placeholder="Unidad, Metros, Tramos"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gsitText-secondary mb-1 font-bold">Precio Unitario ($ COP)</label>
              <input
                type="number"
                min="0"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl border border-surface-borderStrong text-gsitText-secondary hover:bg-surface-subtle text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-deep hover:bg-brand-hover text-white font-bold text-xs shadow-sm"
            >
              Guardar en Esquema
            </button>
          </div>
        </form>
      )}

      {/* Zone Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-surface-border">
        {floors.map((fl) => (
          <button
            key={fl.id}
            onClick={() => setSelectedFloorId(fl.id)}
            className={`px-4 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all border ${
              selectedFloorId === fl.id
                ? 'bg-brand-deep text-white font-bold border-brand-deep shadow-sm'
                : 'bg-white hover:bg-surface-subtle text-gsitText-secondary hover:text-brand-deep border-surface-border'
            }`}
          >
            <span>{fl.name}</span>
          </button>
        ))}
      </div>

      {/* Blueprint Visual Rendering */}
      <div>
        {project.id === 'estadio-metropolitano' ? (
          <EstadioBlueprint
            items={floorItems}
            currentZone={currentFloor?.name || 'Zona General'}
            isEditable={canModifySchema}
          />
        ) : (
          <TitaniumBlueprint
            items={floorItems}
            currentFloorName={currentFloor?.name || 'Piso 1'}
            isEditable={canModifySchema}
          />
        )}
      </div>

      {/* Items list in current zone */}
      <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-border">
          <h4 className="text-xs font-bold uppercase text-brand-deep flex items-center gap-2">
            <Wrench className="w-4 h-4 text-brand-primary" strokeWidth={2} />
            Componentes del Esquema en {currentFloor?.name} ({floorItems.length})
          </h4>
          <span className="text-xs font-mono text-gsitText-muted">
            {canModifySchema ? 'Modo Edición Habilitado' : 'Solo Lectura'}
          </span>
        </div>

        {floorItems.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-gsitText-muted">
            No hay componentes registrados en esta zona aún.
            {canModifySchema && ' Haz clic en "➕ Añadir Elemento" para comenzar.'}
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {floorItems.map((item) => (
              <div
                key={item.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-brand-primary">{item.code}</span>
                    <span className="text-brand-deep font-bold">{item.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                        item.status === 'inspected'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : item.status === 'installed'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gsitText-secondary">
                    Modelo: {item.model} &bull; Cantidad: {item.quantity} {item.unit} &bull; Total: ${(item.quantity * item.unitPrice).toLocaleString('es-CO')} COP
                  </p>
                </div>

                {canModifySchema && (
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gsitText-muted hover:text-red-600 transition-colors self-start sm:self-auto"
                    title="Eliminar del esquema"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
