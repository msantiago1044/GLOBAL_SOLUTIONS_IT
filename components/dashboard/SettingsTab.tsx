'use client';

import React, { useState } from 'react';
import { Project } from '@/src/schemas/project.schema';
import { updateProject } from '@/src/lib/projects-data';
import { Settings, Save, Sliders, Shield, CheckCircle } from 'lucide-react';

interface Props {
  project: Project;
  onRefresh: () => void;
}

export default function SettingsTab({ project, onRefresh }: Props) {
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Metadata Card */}
        <div className="rounded-xl border border-industrial-800 bg-industrial-900 p-6 shadow-industrial-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-industrial-800 pb-3">
            <Settings className="w-4 h-4 text-radar-500" strokeWidth={1.75} />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Configuración General del Proyecto
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-industrial-400 mb-1">Nombre del Proyecto *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded border border-industrial-800 bg-industrial-950 px-3 py-2 text-white focus:border-radar-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-industrial-400 mb-1">Cliente / Entidad *</label>
              <input
                type="text"
                required
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full rounded border border-industrial-800 bg-industrial-950 px-3 py-2 text-white focus:border-radar-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-industrial-400 mb-1">Dirección / Ubicación *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full rounded border border-industrial-800 bg-industrial-950 px-3 py-2 text-white focus:border-radar-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-industrial-400 mb-1">Contratista Ejecutor</label>
              <input
                type="text"
                required
                value={formData.contractor}
                onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
                className="w-full rounded border border-industrial-800 bg-industrial-950 px-3 py-2 text-white focus:border-radar-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-industrial-400 mb-1">Interventoría Técnica</label>
              <input
                type="text"
                required
                value={formData.interventoria}
                onChange={(e) => setFormData({ ...formData, interventoria: e.target.value })}
                className="w-full rounded border border-industrial-800 bg-industrial-950 px-3 py-2 text-white focus:border-radar-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-industrial-400 mb-1">Especificación NFPA 72</label>
              <input
                type="text"
                required
                value={formData.systemType}
                onChange={(e) => setFormData({ ...formData, systemType: e.target.value })}
                className="w-full rounded border border-industrial-800 bg-industrial-950 px-3 py-2 text-white focus:border-radar-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Modular Tool Toggles */}
        <div className="rounded-xl border border-industrial-800 bg-industrial-900 p-6 shadow-industrial-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-industrial-800 pb-3">
            <Sliders className="w-4 h-4 text-radar-500" strokeWidth={1.75} />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Módulos y Herramientas Habilitadas para este Proyecto
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <label className="flex items-center justify-between p-3 rounded-lg bg-industrial-950 border border-industrial-850 cursor-pointer">
              <span>Módulo Detección Temprana (NFPA 72)</span>
              <input
                type="checkbox"
                checked={modules.detection}
                onChange={(e) => setModules({ ...modules, detection: e.target.checked })}
                className="accent-radar-500 w-4 h-4 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-industrial-950 border border-industrial-850 cursor-pointer">
              <span>Módulo Tuberías Metálicas Conduit EMT</span>
              <input
                type="checkbox"
                checked={modules.conduit}
                onChange={(e) => setModules({ ...modules, conduit: e.target.checked })}
                className="accent-radar-500 w-4 h-4 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-industrial-950 border border-industrial-850 cursor-pointer">
              <span>Módulo Cableado FPLR / Fibra Óptica</span>
              <input
                type="checkbox"
                checked={modules.cabling}
                onChange={(e) => setModules({ ...modules, cabling: e.target.checked })}
                className="accent-radar-500 w-4 h-4 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-industrial-950 border border-industrial-850 cursor-pointer">
              <span>Módulo Corte Financiero y Facturación</span>
              <input
                type="checkbox"
                checked={modules.billing}
                onChange={(e) => setModules({ ...modules, billing: e.target.checked })}
                className="accent-radar-500 w-4 h-4 rounded"
              />
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <CheckCircle className="w-4 h-4" strokeWidth={1.75} />
              Configuración guardada exitosamente.
            </span>
          )}
          <button
            type="submit"
            className="ml-auto flex items-center gap-2 px-6 py-2.5 rounded-lg bg-radar-500 hover:bg-radar-400 text-industrial-950 font-bold text-xs font-mono tracking-wide transition-colors shadow-industrial-sm"
          >
            <Save className="w-4 h-4" strokeWidth={2} />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </form>
    </div>
  );
}
