'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/src/schemas/project.schema';
import { updateProject } from '@/src/lib/projects-data';
import { Settings, Save, Sliders, CheckCircle, Lock } from 'lucide-react';

interface Props {
  project: Project;
  canEdit?: boolean;
  onRefresh: () => void;
}

export default function SettingsTab({ project, canEdit = false, onRefresh }: Props) {
  const [formData, setFormData] = useState({
    name: project.name,
    client: project.client,
    address: project.address,
    contractor: project.contractor,
    interventoria: project.interventoria,
    systemType: project.systemType,
  });

  const [modules, setModules] = useState({
    detection: true,
    conduit: true,
    cabling: true,
    billing: true,
    scada: false,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    updateProject(project.id, {
      name: formData.name,
      client: formData.client,
      address: formData.address,
      contractor: formData.contractor,
      interventoria: formData.interventoria,
      systemType: formData.systemType,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {!canEdit && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs font-mono text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Modo Solo Lectura:</strong> Debes iniciar sesión como Administrador para modificar los parámetros y módulos de este proyecto.
            </span>
          </div>
          <Link
            href="/login"
            className="px-3 py-1.5 rounded-lg bg-brand-deep hover:bg-brand-hover text-white text-xs font-bold shrink-0 inline-flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
          >
            <span>Iniciar Sesión</span>
          </Link>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Metadata Card */}
        <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-border pb-3">
            <Settings className="w-4 h-4 text-brand-primary" strokeWidth={2} />
            <h3 className="text-sm font-black text-brand-deep tracking-wide">
              Configuración General del Proyecto
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-gsitText-secondary mb-1 font-bold">Nombre del Proyecto *</label>
              <input
                type="text"
                required
                disabled={!canEdit}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gsitText-secondary mb-1 font-bold">Cliente / Entidad *</label>
              <input
                type="text"
                required
                disabled={!canEdit}
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gsitText-secondary mb-1 font-bold">Dirección / Ubicación *</label>
              <input
                type="text"
                required
                disabled={!canEdit}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gsitText-secondary mb-1 font-bold">Contratista Ejecutor</label>
              <input
                type="text"
                required
                disabled={!canEdit}
                value={formData.contractor}
                onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
                className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gsitText-secondary mb-1 font-bold">Interventoría Técnica</label>
              <input
                type="text"
                required
                disabled={!canEdit}
                value={formData.interventoria}
                onChange={(e) => setFormData({ ...formData, interventoria: e.target.value })}
                className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gsitText-secondary mb-1 font-bold">Especificación NFPA 72</label>
              <input
                type="text"
                required
                disabled={!canEdit}
                value={formData.systemType}
                onChange={(e) => setFormData({ ...formData, systemType: e.target.value })}
                className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Modular Tool Toggles */}
        <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-border pb-3">
            <Sliders className="w-4 h-4 text-brand-primary" strokeWidth={2} />
            <h3 className="text-sm font-black text-brand-deep tracking-wide">
              Módulos y Herramientas Habilitadas para este Proyecto
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <label className={`flex items-center justify-between p-3.5 rounded-xl bg-surface-main border border-surface-border transition-colors ${
              canEdit ? 'cursor-pointer hover:border-brand-primary' : 'cursor-not-allowed opacity-75'
            }`}>
              <span className="font-bold text-brand-deep">Módulo Detección Temprana (NFPA 72)</span>
              <input
                type="checkbox"
                disabled={!canEdit}
                checked={modules.detection}
                onChange={(e) => setModules({ ...modules, detection: e.target.checked })}
                className="accent-brand-deep w-4 h-4 rounded disabled:cursor-not-allowed"
              />
            </label>

            <label className={`flex items-center justify-between p-3.5 rounded-xl bg-surface-main border border-surface-border transition-colors ${
              canEdit ? 'cursor-pointer hover:border-brand-primary' : 'cursor-not-allowed opacity-75'
            }`}>
              <span className="font-bold text-brand-deep">Módulo Tuberías Metálicas Conduit EMT</span>
              <input
                type="checkbox"
                disabled={!canEdit}
                checked={modules.conduit}
                onChange={(e) => setModules({ ...modules, conduit: e.target.checked })}
                className="accent-brand-deep w-4 h-4 rounded disabled:cursor-not-allowed"
              />
            </label>

            <label className={`flex items-center justify-between p-3.5 rounded-xl bg-surface-main border border-surface-border transition-colors ${
              canEdit ? 'cursor-pointer hover:border-brand-primary' : 'cursor-not-allowed opacity-75'
            }`}>
              <span className="font-bold text-brand-deep">Módulo Cableado FPLR / Fibra Óptica</span>
              <input
                type="checkbox"
                disabled={!canEdit}
                checked={modules.cabling}
                onChange={(e) => setModules({ ...modules, cabling: e.target.checked })}
                className="accent-brand-deep w-4 h-4 rounded disabled:cursor-not-allowed"
              />
            </label>

            <label className={`flex items-center justify-between p-3.5 rounded-xl bg-surface-main border border-surface-border transition-colors ${
              canEdit ? 'cursor-pointer hover:border-brand-primary' : 'cursor-not-allowed opacity-75'
            }`}>
              <span className="font-bold text-brand-deep">Módulo Corte Financiero y Facturación</span>
              <input
                type="checkbox"
                disabled={!canEdit}
                checked={modules.billing}
                onChange={(e) => setModules({ ...modules, billing: e.target.checked })}
                className="accent-brand-deep w-4 h-4 rounded disabled:cursor-not-allowed"
              />
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 font-bold">
              <CheckCircle className="w-4 h-4" strokeWidth={2} />
              Configuración guardada exitosamente.
            </span>
          )}
          {canEdit ? (
            <button
              type="submit"
              className="ml-auto flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-deep hover:bg-brand-hover text-white font-bold text-xs tracking-wide transition-all shadow-gsit-sm"
            >
              <Save className="w-4 h-4 text-brand-cyan" strokeWidth={2} />
              <span>Guardar Cambios</span>
            </button>
          ) : (
            <div className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-subtle border border-surface-border text-xs font-mono text-gsitText-muted">
              <Lock className="w-4 h-4 text-gsitText-muted" strokeWidth={2} />
              <span>Edición deshabilitada para visitantes</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
