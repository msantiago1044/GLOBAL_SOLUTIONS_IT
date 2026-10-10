'use client';

import React from 'react';
import { Lock, AlertTriangle, X, CheckCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  projectName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LockSchemaModal({ isOpen, projectName, onClose, onConfirm }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-xl border border-red-500/40 bg-industrial-900 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-industrial-400 hover:text-white hover:bg-industrial-800 transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={1.75} />
        </button>

        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-industrial-800">
          <div className="w-10 h-10 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500">
            <Lock className="w-5 h-5" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">
              Bloquear Esquema Técnico Definitivo
            </h3>
            <p className="text-xs text-industrial-400 font-mono">
              Congelamiento de ingeniería para ejecución en obra
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-industrial-300">
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 flex gap-3 text-amber-300">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" strokeWidth={1.75} />
            <div>
              <p className="font-semibold text-white">¿Estás seguro de congelar el diseño de {projectName}?</p>
              <p className="mt-1 text-[11px] text-amber-200/80">
                Al bloquear el esquema, ya no se permitirá añadir, renombrar ni eliminar equipos, tramos de tubería ni tiradas de cable.
              </p>
            </div>
          </div>

          <p>
            Este paso formaliza el inventario base para:
          </p>
          <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-industrial-400">
            <li>Inspecciones y auditorías en terreno</li>
            <li>Seguimiento de porcentajes de instalación física</li>
            <li>Generación de Actas de Metrado y Cortes de Facturación</li>
          </ul>
        </div>

        <div className="flex items-center justify-end gap-3 pt-5 mt-4 border-t border-industrial-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-industrial-800 hover:bg-industrial-800 text-industrial-300 text-xs font-mono transition-colors"
          >
            Seguir Editando
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold tracking-wide text-xs font-mono transition-colors shadow-lg"
          >
            <Lock className="w-4 h-4" strokeWidth={2} />
            <span>Confirmar y Bloquear Esquema</span>
          </button>
        </div>
      </div>
    </div>
  );
}
