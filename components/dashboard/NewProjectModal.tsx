'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateProjectPayloadSchema } from '@/src/schemas/project.schema';
import { createProject } from '@/src/lib/projects-data';
import { isAuthenticated } from '@/src/lib/auth';
import { PlusCircle, X, AlertCircle, Building2 } from 'lucide-react';

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

    if (!isAuthenticated()) {
      setErrors(['Debes iniciar sesión para poder crear un nuevo proyecto.']);
      return;
    }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl border border-surface-border bg-white p-6 shadow-gsit-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gsitText-muted hover:text-gsitText-main hover:bg-surface-subtle transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-surface-border">
          <div className="w-10 h-10 rounded-xl bg-brand-ice border border-brand-light flex items-center justify-center text-brand-deep">
            <Building2 className="w-5 h-5 text-brand-primary" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-lg font-black text-brand-deep tracking-tight">Crear Nuevo Proyecto Técnico</h3>
            <p className="text-xs text-gsitText-secondary">
              Inicia un proyecto en blanco para configurar equipos, tuberías y cableado.
            </p>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
            <div className="flex items-center gap-2 font-bold mb-1">
              <AlertCircle className="w-4 h-4 text-red-600" strokeWidth={2} />
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
            <label className="block text-gsitText-secondary mb-1 font-bold uppercase">
              Nombre de la Obra / Proyecto *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Estadio Metropolitano Roberto Meléndez"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main placeholder-gsitText-muted focus:border-brand-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gsitText-secondary mb-1 font-bold uppercase">
                Cliente o Entidad *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Alcaldía Distrital"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main placeholder-gsitText-muted focus:border-brand-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gsitText-secondary mb-1 font-bold uppercase">
                Ciudad / Ubicación *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Barranquilla, Atlántico"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main placeholder-gsitText-muted focus:border-brand-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gsitText-secondary mb-1 font-bold uppercase">
                Número de Zonas o Pisos
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.floorsCount}
                onChange={(e) => setFormData({ ...formData, floorsCount: Number(e.target.value) })}
                className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gsitText-secondary mb-1 font-bold uppercase">
                Especificación del Sistema
              </label>
              <select
                value={formData.system}
                onChange={(e) => setFormData({ ...formData, system: e.target.value })}
                className="w-full rounded-xl border border-surface-border bg-surface-main px-3 py-2 text-gsitText-main focus:border-brand-primary focus:outline-none"
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

          <div className="rounded-xl bg-brand-ice/60 border border-brand-light p-3 text-brand-deep text-[11px] leading-relaxed">
            <span className="font-bold">&bull; Configuración Inicial:</span> Podrás agregar tuberías, cables y equipos conforme avance el desarrollo de la obra.
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-surface-borderStrong hover:bg-surface-subtle text-gsitText-secondary transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-deep hover:bg-brand-hover text-white font-bold tracking-wide transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-brand-cyan" strokeWidth={2} />
              <span>{loading ? 'Creando...' : 'Crear Proyecto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
