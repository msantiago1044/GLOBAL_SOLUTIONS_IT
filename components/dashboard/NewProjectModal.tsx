'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateProjectPayloadSchema } from '@/src/schemas/project.schema';
import { createProject } from '@/src/lib/projects-data';
import { PlusCircle, X, Shield, AlertCircle, Building2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewProjectModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    city: '',
    floorsCount: 4,
    system: 'Detección Temprana & Tubería Conduit EMT — NFPA 72 Clase B',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    const validation = CreateProjectPayloadSchema.safeParse({
      name: formData.name,
      client: formData.client,
      city: formData.city,
      floorsCount: Number(formData.floorsCount),
      system: formData.system,
    });

    if (!validation.success) {
      setErrors(validation.error.errors.map((err) => err.message));
      setLoading(false);
      return;
    }

    try {
      const newProj = createProject(validation.data);
      setLoading(false);
      onClose();
      router.push(`/projects/${newProj.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido al crear proyecto';
      setErrors([msg]);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-xl border border-industrial-750 bg-industrial-900 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-industrial-400 hover:text-white hover:bg-industrial-800 transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={1.75} />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-industrial-800">
          <div className="w-10 h-10 rounded-lg bg-radar-500/10 border border-radar-500/30 flex items-center justify-center text-radar-500">
            <Building2 className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">Crear Nuevo Proyecto Técnico</h3>
            <p className="text-xs text-industrial-400 font-mono">
              Inicia un proyecto en blanco con esquema editable de equipos, tuberías y cableado.
            </p>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400">
            <div className="flex items-center gap-2 font-semibold mb-1">
              <AlertCircle className="w-4 h-4" strokeWidth={1.75} />
              <span>Verifica los siguientes campos:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-industrial-300 mb-1 font-semibold uppercase">
              Nombre de la Obra / Proyecto *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Estadio Metropolitano Roberto Meléndez"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-industrial-800 bg-industrial-950 px-3 py-2 text-white placeholder-industrial-600 focus:border-radar-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-industrial-300 mb-1 font-semibold uppercase">
                Cliente o Entidad *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Alcaldía Distrital"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full rounded-lg border border-industrial-800 bg-industrial-950 px-3 py-2 text-white placeholder-industrial-600 focus:border-radar-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-industrial-300 mb-1 font-semibold uppercase">
                Ciudad / Ubicación *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Barranquilla, Atlántico"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full rounded-lg border border-industrial-800 bg-industrial-950 px-3 py-2 text-white placeholder-industrial-600 focus:border-radar-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-industrial-300 mb-1 font-semibold uppercase">
                Número de Zonas o Pisos
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.floorsCount}
                onChange={(e) => setFormData({ ...formData, floorsCount: Number(e.target.value) })}
                className="w-full rounded-lg border border-industrial-800 bg-industrial-950 px-3 py-2 text-white focus:border-radar-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-industrial-300 mb-1 font-semibold uppercase">
                Especificación del Sistema
              </label>
              <select
                value={formData.system}
                onChange={(e) => setFormData({ ...formData, system: e.target.value })}
                className="w-full rounded-lg border border-industrial-800 bg-industrial-950 px-3 py-2 text-white focus:border-radar-500 focus:outline-none"
              >
                <option value="Detección Temprana & Tubería Conduit EMT — NFPA 72 Clase B">
                  Detección Temprana & Tubería EMT (Clase B)
                </option>
                <option value="Direccionable NFPA 72 - Clase A (Lazo SLC redundante)">
                  Direccionable NFPA 72 (Lazo SLC Clase A)
                </option>
                <option value="Notificación Masiva por Voz (EVACS) & Sirenas">
                  Notificación Masiva por Voz (EVACS)
                </option>
              </select>
            </div>
          </div>

          <div className="rounded-lg bg-industrial-850 border border-industrial-800 p-3 text-industrial-400 text-[11px] leading-relaxed">
            <span className="text-radar-500 font-semibold">&bull; Estado Inicial:</span> Se creará en modo{' '}
            <strong className="text-white">Esquema Editable</strong>. Podrás agregar tuberías, cables y equipos libremente hasta que decidas bloquear el esquema definitivo.
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-industrial-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-industrial-800 hover:bg-industrial-800 text-industrial-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-radar-500 hover:bg-radar-400 text-industrial-950 font-bold tracking-wide transition-colors shadow-industrial-sm"
            >
              <PlusCircle className="w-4 h-4" strokeWidth={2} />
              <span>{loading ? 'Creando...' : 'Crear Proyecto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
