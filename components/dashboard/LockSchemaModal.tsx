'use client';

import React from 'react';
import { Lock, AlertTriangle, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  projectName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LockSchemaModal({ isOpen, projectName, onClose, onConfirm }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-6 shadow-gsit-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gsitText-muted hover:text-gsitText-main hover:bg-surface-subtle transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>

        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-surface-border">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <Lock className="w-5 h-5" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-lg font-black text-brand-deep tracking-tight">
              Bloquear Esquema Técnico Definitivo
            </h3>
            <p className="text-xs text-gsitText-secondary">
              Congelamiento de ingeniería para ejecución en obra
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-gsitText-secondary">
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 flex gap-3 text-amber-900">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" strokeWidth={2} />
            <div>
              <p className="font-bold text-amber-950">¿Estás seguro de congelar el diseño de {projectName}?</p>
              <p className="mt-1 text-[11px] text-amber-800">
                Al bloquear el esquema, ya no se permitirá añadir, renombrar ni eliminar equipos, tramos de tubería ni tiradas de cable.
              </p>
            </div>
          </div>

          <p>
            Este paso formaliza el inventario base para:
          </p>
          <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-gsitText-secondary">
            <li>Inspecciones y auditorías en terreno</li>
            <li>Seguimiento de porcentajes de instalación física</li>
            <li>Generación de Actas de Metrado y Cortes de Facturación</li>
          </ul>
        </div>

        <div className="flex items-center justify-end gap-3 pt-5 mt-4 border-t border-surface-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-surface-borderStrong hover:bg-surface-subtle text-gsitText-secondary text-xs font-mono transition-colors"
          >
            Seguir Editando
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold tracking-wide text-xs font-mono transition-colors shadow-sm"
          >
            <Lock className="w-4 h-4" strokeWidth={2} />
            <span>Confirmar y Bloquear Esquema</span>
          </button>
        </div>
      </div>
    </div>
  );
}
