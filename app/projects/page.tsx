'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewProjectModal from '@/components/dashboard/NewProjectModal';
import { getProjects } from '@/src/lib/projects-data';
import { Project } from '@/src/schemas/project.schema';
import {
  Layers,
  Plus,
  ArrowRight,
  Building2,
  Lock,
  Unlock,
  Search,
  Gauge,
  Radio,
  Flame,
} from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-industrial-950 text-industrial-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Header & Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-industrial-800">
          <div>
            <div className="flex items-center gap-2 text-radar-500 font-mono text-xs font-semibold uppercase tracking-wider">
              <Layers className="w-4 h-4" strokeWidth={1.75} />
              <span>Portafolio de Redes &middot; Global Solutions IT</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-wide mt-1">
              Proyectos de Instalación &amp; Seguridad Electrónica
            </h1>
            <p className="text-xs text-industrial-400 font-mono mt-1">
              Selecciona un proyecto para abrir su Dashboard interactivo o crea uno nuevo en blanco con esquema editable.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-radar-500 hover:bg-radar-400 text-industrial-950 font-bold text-xs font-mono tracking-wide transition-all shadow-industrial-sm"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              <span>➕ Nuevo Proyecto</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-industrial-500" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Buscar por nombre, cliente o ubicación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-industrial-800 bg-industrial-900 pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-industrial-600 focus:border-radar-500 focus:outline-none"
          />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => {
            const isLocked = proj.schemaStatus === 'locked';

            return (
              <div
                key={proj.id}
                className="rounded-xl border border-industrial-800 bg-industrial-900 p-6 shadow-industrial-sm flex flex-col justify-between hover:border-industrial-700 transition-all hover:shadow-industrial-md group"
              >
                <div className="space-y-4">
                  {/* Top Status Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold uppercase flex items-center gap-1 ${
                        isLocked
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-radar-500/15 text-radar-500 border border-radar-500/30'
                      }`}
                    >
                      {isLocked ? (
                        <>
                          <Lock className="w-3 h-3" strokeWidth={2} />
                          <span>Esquema Bloqueado</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3 h-3" strokeWidth={2} />
                          <span>Esquema Editable</span>
                        </>
                      )}
                    </span>

                    <span className="text-[11px] font-mono text-industrial-500">
                      {proj.totalFloors} zonas
                    </span>
                  </div>

                  {/* Project Title and Client */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-radar-500 transition-colors">
                      {proj.name}
                    </h3>
                    <p className="text-xs text-industrial-400 font-mono mt-0.5">
                      {proj.client} &bull; {proj.address}
                    </p>
                  </div>

                  {/* System spec */}
                  <div className="p-2.5 rounded bg-industrial-950 border border-industrial-850 text-xs font-mono text-industrial-300">
                    <span className="text-[10px] text-industrial-500 block uppercase font-semibold">Sistema NFPA 72:</span>
                    <span className="line-clamp-1">{proj.systemType}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-industrial-400">Avance Físico:</span>
                      <span className="font-bold text-white">{proj.globalProgress}%</span>
                    </div>
                    <div className="w-full bg-industrial-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          proj.globalProgress > 50 ? 'bg-emerald-500' : proj.globalProgress > 0 ? 'bg-radar-500' : 'bg-industrial-700'
                        }`}
                        style={{ width: `${proj.globalProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Link */}
                <div className="pt-6 mt-4 border-t border-industrial-800">
                  <Link
                    href={`/projects/${proj.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-industrial-850 hover:bg-radar-500 text-white hover:text-industrial-950 font-bold text-xs font-mono tracking-wide transition-all border border-industrial-750 hover:border-radar-500 shadow-industrial-sm"
                  >
                    <span>Abrir Dashboard del Proyecto</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Quick Create Card */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl border border-dashed border-industrial-750 bg-industrial-900/40 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-radar-500 hover:bg-industrial-900 transition-all min-h-[300px] group"
          >
            <div className="w-12 h-12 rounded-xl bg-radar-500/10 border border-radar-500/30 flex items-center justify-center text-radar-500 group-hover:scale-110 transition-transform mb-3">
              <Plus className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-radar-500 transition-colors">
              ➕ Crear Nuevo Proyecto
            </h3>
            <p className="text-xs text-industrial-400 font-mono mt-1 max-w-xs">
              Inicia un nuevo proyecto con esquema editable para configurar equipos, tuberías y cableado.
            </p>
          </div>
        </div>
      </main>

      <Footer />

      {/* New Project Modal */}
      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
