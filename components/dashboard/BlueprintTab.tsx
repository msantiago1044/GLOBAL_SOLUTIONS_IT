'use client';

import React, { useState } from 'react';
import { Project } from '@/src/schemas/project.schema';
import { FloorZone, addItem, removeItem } from '@/src/lib/projects-data';
import { FloorItem, ItemTypeSchema } from '@/src/schemas/floor-item.schema';
import EstadioBlueprint from '@/components/blueprints/EstadioBlueprint';
import TitaniumBlueprint from '@/components/blueprints/TitaniumBlueprint';
import { Lock, Unlock, Plus, Trash2, Shield, Wrench, AlertCircle, Check } from 'lucide-react';

interface Props {
  project: Project;
  floors: FloorZone[];
  items: FloorItem[];
  onRefresh: () => void;
  onOpenLockModal: () => void;
}

export default function BlueprintTab({
  project,
  floors,
  items,
  onRefresh,
  onOpenLockModal,
}: Props) {
  const [selectedFloorId, setSelectedFloorId] = useState<string>(floors[0]?.id || '');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FloorItem | null>(null);

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
  const isEditable = project.schemaStatus === 'editable';

  // Filter items belonging to the selected zone/floor
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
    if (!currentFloor) return;

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
    if (!isEditable) return;
    if (confirm('¿Eliminar este elemento del esquema técnico?')) {
      removeItem(project.id, itemId);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Schema Status & Actions */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isEditable
          ? 'bg-industrial-900 border-radar-500/30'
          : 'bg-industrial-900 border-industrial-800'
      }`}>
        <div className="flex items-start sm:items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            isEditable
              ? 'bg-radar-500/10 text-radar-500 border border-radar-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
          }`}>
            {isEditable ? <Unlock className="w-5 h-5" strokeWidth={2} /> : <Lock className="w-5 h-5" strokeWidth={2} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                {isEditable ? 'Modo: Esquema Técnico Editable' : 'Esquema Técnico Bloqueado y Certificado'}
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold uppercase ${
                isEditable
                  ? 'bg-radar-500/20 text-radar-500 border border-radar-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {isEditable ? 'Borrador Activo' : 'Congelado para Obra'}
              </span>
            </div>
            <p className="text-xs text-industrial-400 font-mono mt-0.5">
              {isEditable
                ? 'Puedes añadir tuberías, cables y equipos libremente. Cuando termines el diseño, bloquéalo para iniciar obra.'
                : 'El diseño ha sido congelado. No se pueden agregar ni borrar elementos; solo registrar su avance e inspección.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {isEditable && (
            <>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-industrial-850 hover:bg-industrial-800 border border-industrial-700 text-xs font-mono text-white transition-colors"
              >
                <Plus className="w-4 h-4 text-radar-500" strokeWidth={2} />
                <span>{showAddForm ? 'Cerrar Formulario' : '➕ Añadir Elemento'}</span>
              </button>
              <button
                onClick={onOpenLockModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-mono tracking-wide transition-colors shadow-lg"
              >
                <Lock className="w-4 h-4" strokeWidth={2} />
                <span>Bloquear Esquema</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Add Item Form (When Editable) */}
      {isEditable && showAddForm && (
        <form
          onSubmit={handleCreateItem}
          className="rounded-xl border border-radar-500/40 bg-industrial-900 p-5 shadow-industrial-md space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-industrial-800 pb-2">
            <h4 className="text-xs font-bold font-mono uppercase text-radar-500 flex items-center gap-2">
              <Plus className="w-4 h-4" strokeWidth={2} />
              Agregar Componente Técnico al Esquema ({currentFloor?.name})
            </h4>
            <span className="text-[11px] font-mono text-industrial-400">
              Zona Asignada: <strong className="text-white">{currentFloor?.name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <label className="block text-industrial-400 mb-1">Código / Tag *</label>
              <input
                type="text"
                required
                placeholder="Ej. DET-SMK-10, TUB-01"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full rounded border border-industrial-800 bg-industrial-950 px-2.5 py-1.5 text-white focus:border-radar-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-industrial-400 mb-1">Tipo de Componente *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full rounded border border-industrial-800 bg-industrial-950 px-2.5 py-1.5 text-white focus:border-radar-500 focus:outline-none"
              >
                <option value="detector-autonomo">Detector de Humo Óptico / Fotoeléctrico</option>
                <option value="tuberia">Tubería Conduit EMT / IMC</option>
                <option value="cableado">Cable FPLR Blindado 2x14 AWG</option>
                <option value="sirena">Sirena Estroboscópica Notifier / System Sensor</option>
                <option value="palanca">Estación Manual de Alarma (Palanca)</option>
                <option value="facp">Panel Principal FACP / Subpanel</option>
                <option value="cuadro-bomba">Tablero Bomba RCI / Red Contra Incendio</option>
              </select>
            </div>

            <div>
              <label className="block text-industrial-400 mb-1">Nombre Técnico *</label>
              <input
                type="text"
                required
                placeholder="Ej. Tubería EMT 3/4 pulg"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded border border-industrial-800 bg-industrial-950 px-2.5 py-1.5 text-white focus:border-radar-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-industrial-400 mb-1">Modelo / Fabricante</label>
              <input
                type="text"
                placeholder="Ej. Notifier FSP-951 / Colmena EMT"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full rounded border border-industrial-800 bg-industrial-950 px-2.5 py-1.5 text-white focus:border-radar-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <label className="block text-industrial-400 mb-1">Cantidad / Longitud *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="w-full rounded border border-industrial-800 bg-industrial-950 px-2.5 py-1.5 text-white focus:border-radar-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-industrial-400 mb-1">Unidad de Medida</label>
              <input
                type="text"
                placeholder="Unidad, Metros, Tramos"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full rounded border border-industrial-800 bg-industrial-950 px-2.5 py-1.5 text-white focus:border-radar-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-industrial-400 mb-1">Precio Unitario ($ COP)</label>
              <input
                type="number"
                min="0"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                className="w-full rounded border border-industrial-800 bg-industrial-950 px-2.5 py-1.5 text-white focus:border-radar-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded border border-industrial-800 text-industrial-400 hover:text-white text-xs font-mono"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-radar-500 hover:bg-radar-400 text-industrial-950 font-bold text-xs font-mono"
            >
              Guardar en Esquema
            </button>
          </div>
        </form>
      )}

      {/* Zone / Level Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-industrial-800">
        {floors.map((fl) => (
          <button
            key={fl.id}
            onClick={() => setSelectedFloorId(fl.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedFloorId === fl.id
                ? 'bg-radar-500 text-industrial-950 font-bold shadow-industrial-sm'
                : 'bg-industrial-900 hover:bg-industrial-850 text-industrial-400 hover:text-white border border-industrial-800'
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
            isEditable={isEditable}
            onSelectItem={(item) => setSelectedItem(item)}
          />
        ) : (
          <TitaniumBlueprint
            items={floorItems}
            currentFloorName={currentFloor?.name || 'Piso 1'}
            isEditable={isEditable}
            onSelectItem={(item) => setSelectedItem(item)}
          />
        )}
      </div>

      {/* Items list in current zone with delete capabilities when editable */}
      <div className="rounded-xl border border-industrial-800 bg-industrial-900 p-5 shadow-industrial-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-industrial-800">
          <h4 className="text-xs font-bold font-mono uppercase text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-radar-500" strokeWidth={1.75} />
            Componentes del Esquema en {currentFloor?.name} ({floorItems.length})
          </h4>
          <span className="text-[11px] font-mono text-industrial-400">
            {isEditable ? 'Modo Edición Habilitado' : 'Solo Lectura'}
          </span>
        </div>

        {floorItems.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-industrial-500">
            No hay componentes registrados en esta zona aún.
            {isEditable && ' Haz clic en "➕ Añadir Elemento" para comenzar.'}
          </div>
        ) : (
          <div className="divide-y divide-industrial-850">
            {floorItems.map((item) => (
              <div
                key={item.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-radar-500">{item.code}</span>
                    <span className="text-white font-medium">{item.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                        item.status === 'inspected'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : item.status === 'installed'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-radar-500/20 text-radar-500'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-industrial-400">
                    Modelo: {item.model} &bull; Cantidad: {item.quantity} {item.unit} &bull; Total: ${(item.quantity * item.unitPrice).toLocaleString('es-CO')} COP
                  </p>
                </div>

                {isEditable && (
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 rounded hover:bg-industrial-800 text-industrial-500 hover:text-red-400 transition-colors self-start sm:self-auto"
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
