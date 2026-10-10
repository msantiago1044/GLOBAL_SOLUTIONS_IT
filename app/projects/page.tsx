'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewProjectModal from '@/components/dashboard/NewProjectModal';
import { getProjects } from '@/src/lib/projects-data';
import { Project } from '@/src/schemas/project.schema';
import { isAdmin } from '@/src/lib/auth';
import {
  Plus,
  ArrowRight,
  Building2,
  Lock,
  Unlock,
  Search,
  MapPin,
  CheckCircle2,
  FolderPlus,
} from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminMode, setAdminMode] = useState(false);

  useEffect(() => {
    setProjects(getProjects());
    setAdminMode(isAdmin());
  }, []);

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-surface-main text-gsitText-main">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Header & Actions Bar (Matching media_1791659190816.png) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-surface-border">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-extrabold text-brand-deep tracking-tight">
                Portafolio de Proyectos en Ejecución
              </h1>
              {adminMode && (
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Modo Edición (Administrador)</span>
                </span>
              )}
            </div>
            <p className="text-sm text-gsitText-secondary">
              Gestión centralizada de redes de detección contra incendios Global Solutions IT
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-deep hover:bg-brand-hover text-white font-bold text-xs tracking-wide transition-all shadow-gsit-sm"
            >
              <Plus className="w-4 h-4 text-brand-cyan" strokeWidth={2.5} />
              <span>➕ Nuevo Proyecto</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gsitText-muted" strokeWidth={2} />
          <input
            type="text"
            placeholder="Buscar por nombre, cliente o ciudad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-surface-border bg-white pl-9 pr-3 py-2 text-xs font-medium text-gsitText-main placeholder-gsitText-muted focus:border-brand-primary focus:outline-none shadow-sm"
          />
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => {
            const isLocked = proj.schemaStatus === 'locked';

            return (
              <div
                key={proj.id}
                className="relative rounded-2xl border-2 border-surface-border hover:border-brand-primary bg-white p-6 shadow-sm hover:shadow-gsit-md flex flex-col justify-between transition-all group overflow-hidden"
              >
                {/* Diagonal Ribbon in Corner */}
                <div
                  className={`absolute top-4 -right-12 text-white text-[10px] font-extrabold uppercase py-1 px-12 rotate-45 shadow-sm tracking-wider ${
                    isLocked ? 'bg-brand-deep' : 'bg-brand-accent'
                  }`}
                >
                  {isLocked ? 'EN OBRA' : 'EN DISEÑO'}
                </div>

                <div className="space-y-4">
                  {/* Category Pill & Zones Count */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-brand-ice text-brand-deep uppercase">
                      {proj.id === 'estadio-metropolitano' ? 'COMPLEJO DEPORTIVO' : 'EDIFICACIÓN VERTICAL'}
                    </span>
                    <span className="text-xs font-mono text-gsitText-muted">
                      {proj.totalFloors} {proj.id === 'estadio-metropolitano' ? 'Zonas' : 'Niveles'}
                    </span>
                  </div>

                  {/* Project Title and Client */}
                  <div>
                    <h3 className="text-xl font-black text-brand-deep group-hover:text-brand-primary transition-colors">
                      {proj.name}
                    </h3>
                    <p className="text-xs text-gsitText-secondary mt-1 line-clamp-2">
                      {proj.client} &bull; {proj.address}
                    </p>
                  </div>

                  {/* Progress Bar with Green Metric */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gsitText-secondary">Avance de Ejecución</span>
                      <span className="font-black text-emerald-600 text-sm">{proj.globalProgress}%</span>
                    </div>
                    <div className="w-full bg-surface-subtle h-2.5 rounded-full overflow-hidden border border-surface-border">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(proj.globalProgress, 4)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-medium text-gsitText-secondary pt-1">
                    <span className="px-2 py-0.5 rounded bg-surface-subtle border border-surface-border flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-500" /> {proj.address.split(',')[0]}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-subtle border border-surface-border">
                      {proj.systemType.split('-')[0]}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase flex items-center gap-1 ${
                        isLocked
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {isLocked ? <Lock className="w-3 h-3 text-emerald-600" /> : <Unlock className="w-3 h-3 text-amber-600" />}
                      <span>{isLocked ? 'Esquema Bloqueado' : 'Esquema Editable'}</span>
                    </span>
                  </div>
                </div>

                {/* Big Action Button */}
                <div className="pt-6 mt-4 border-t border-surface-border">
                  <Link
                    href={`/projects/${proj.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-deep hover:bg-brand-hover text-white font-bold text-xs tracking-wide transition-all shadow-sm"
                  >
                    <span>Ingresar al Estudio Técnico de Obra</span>
                    <ArrowRight className="w-4 h-4 text-brand-cyan" />
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Quick Create Card */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="rounded-2xl border-2 border-dashed border-brand-primary/40 bg-white/70 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-primary hover:bg-brand-ice/20 transition-all min-h-[320px] group shadow-sm"
          >
            <div className="w-14 h-14 rounded-2xl bg-brand-ice border border-brand-cyan/40 flex items-center justify-center text-brand-deep group-hover:scale-110 transition-transform mb-3 shadow-sm">
              <FolderPlus className="w-7 h-7 text-brand-accent" strokeWidth={2} />
            </div>
            <h3 className="text-base font-extrabold text-brand-deep group-hover:text-brand-primary transition-colors">
              ➕ Crear Nuevo Proyecto
            </h3>
            <p className="text-xs text-gsitText-secondary mt-1 max-w-xs leading-relaxed">
              Inicia un proyecto en blanco con esquema editable para configurar equipos, tuberías y cableado.
            </p>
          </div>
        </div>
      </main>

      <Footer />

      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
