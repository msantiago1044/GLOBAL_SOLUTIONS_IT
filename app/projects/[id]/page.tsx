'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OverviewTab from '@/components/dashboard/OverviewTab';
import BlueprintTab from '@/components/dashboard/BlueprintTab';
import KardexTab from '@/components/dashboard/KardexTab';
import InspectionsTab from '@/components/dashboard/InspectionsTab';
import BillingTab from '@/components/dashboard/BillingTab';
import SettingsTab from '@/components/dashboard/SettingsTab';
import LockSchemaModal from '@/components/dashboard/LockSchemaModal';
import {
  getProject,
  getFloors,
  getProjectItems,
  lockProjectSchema,
  FloorZone,
} from '@/src/lib/projects-data';
import { Project } from '@/src/schemas/project.schema';
import { FloorItem } from '@/src/schemas/floor-item.schema';
import {
  Layers,
  ArrowLeft,
  Gauge,
  Compass,
  Package,
  Camera,
  FileText,
  Settings,
  Lock,
  Unlock,
  AlertCircle,
  Building2,
} from 'lucide-react';

export default function ProjectDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = (params?.id as string) || '';

  const [project, setProject] = useState<Project | null>(null);
  const [floors, setFloors] = useState<FloorZone[]>([]);
  const [items, setItems] = useState<FloorItem[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'blueprint' | 'kardex' | 'inspections' | 'billing' | 'settings'>('overview');
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);

  const loadData = () => {
    if (!projectId) return;
    const proj = getProject(projectId);
    if (proj) {
      setProject({ ...proj });
      setFloors([...getFloors(projectId)]);
      setItems([...getProjectItems(projectId)]);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-industrial-950 text-industrial-100">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-radar-500 mx-auto" strokeWidth={1.75} />
          <h2 className="text-xl font-bold text-white">Proyecto No Encontrado</h2>
          <p className="text-xs text-industrial-400 font-mono">
            El identificador "{projectId}" no corresponde a una obra registrada.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-industrial-900 border border-industrial-800 text-xs font-mono text-radar-500 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Portafolio</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleConfirmLock = () => {
    lockProjectSchema(project.id);
    loadData();
  };

  const isLocked = project.schemaStatus === 'locked';

  return (
    <div className="min-h-screen flex flex-col bg-industrial-950 text-industrial-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-industrial-400">
          <Link href="/projects" className="hover:text-white flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Portafolio de Proyectos</span>
          </Link>
          <span>/</span>
          <span className="text-white font-semibold">{project.name}</span>
        </div>

        {/* Project Header Card */}
        <div className="rounded-xl border border-industrial-800 bg-industrial-900 p-6 shadow-industrial-md flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                {project.name}
              </h1>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded font-mono font-bold uppercase flex items-center gap-1.5 ${
                  isLocked
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-radar-500/15 text-radar-500 border border-radar-500/30'
                }`}
              >
                {isLocked ? (
                  <>
                    <Lock className="w-3.5 h-3.5" strokeWidth={2} />
                    <span>Esquema Bloqueado (Oficial)</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-3.5 h-3.5" strokeWidth={2} />
                    <span>Esquema Editable (Borrador)</span>
                  </>
                )}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs font-mono text-industrial-400">
              <div>
                Cliente: <strong className="text-white">{project.client}</strong>
              </div>
              <div>
                Ubicación: <strong className="text-white">{project.address}</strong>
              </div>
              <div>
                Interventoría: <strong className="text-white">{project.interventoria}</strong>
              </div>
            </div>

            <div className="text-[11px] font-mono text-radar-500 pt-1">
              {project.systemType}
            </div>
          </div>

          {/* Quick stats on the right */}
          <div className="flex items-center gap-4 self-start lg:self-auto border-t lg:border-t-0 lg:border-l border-industrial-800 pt-4 lg:pt-0 lg:pl-6 text-xs font-mono">
            <div className="text-center">
              <span className="text-industrial-500 text-[10px] uppercase block">Avance</span>
              <span className="text-2xl font-bold text-white">{project.globalProgress}%</span>
            </div>
            <div className="text-center">
              <span className="text-industrial-500 text-[10px] uppercase block">Zonas</span>
              <span className="text-2xl font-bold text-white">{floors.length}</span>
            </div>
            <div className="text-center">
              <span className="text-industrial-500 text-[10px] uppercase block">Ítems</span>
              <span className="text-2xl font-bold text-radar-500">{items.length}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Tools Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-industrial-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'bg-radar-500 text-industrial-950 font-bold shadow-industrial-sm'
                : 'bg-industrial-900 hover:bg-industrial-850 text-industrial-400 hover:text-white border border-industrial-800'
            }`}
          >
            <Gauge className="w-4 h-4" strokeWidth={1.75} />
            <span>Visión General &amp; Metrado</span>
          </button>

          <button
            onClick={() => setActiveTab('blueprint')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'blueprint'
                ? 'bg-radar-500 text-industrial-950 font-bold shadow-industrial-sm'
                : 'bg-industrial-900 hover:bg-industrial-850 text-industrial-400 hover:text-white border border-industrial-800'
            }`}
          >
            <Compass className="w-4 h-4" strokeWidth={1.75} />
            <span>Plano Técnico &amp; Esquema</span>
          </button>

          <button
            onClick={() => setActiveTab('kardex')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'kardex'
                ? 'bg-radar-500 text-industrial-950 font-bold shadow-industrial-sm'
                : 'bg-industrial-900 hover:bg-industrial-850 text-industrial-400 hover:text-white border border-industrial-800'
            }`}
          >
            <Package className="w-4 h-4" strokeWidth={1.75} />
            <span>Kárdex de Componentes ({items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inspections')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'inspections'
                ? 'bg-radar-500 text-industrial-950 font-bold shadow-industrial-sm'
                : 'bg-industrial-900 hover:bg-industrial-850 text-industrial-400 hover:text-white border border-industrial-800'
            }`}
          >
            <Camera className="w-4 h-4" strokeWidth={1.75} />
            <span>Evidencias e Inspección</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'billing'
                ? 'bg-radar-500 text-industrial-950 font-bold shadow-industrial-sm'
                : 'bg-industrial-900 hover:bg-industrial-850 text-industrial-400 hover:text-white border border-industrial-800'
            }`}
          >
            <FileText className="w-4 h-4" strokeWidth={1.75} />
            <span>Corte de Facturación</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'settings'
                ? 'bg-radar-500 text-industrial-950 font-bold shadow-industrial-sm'
                : 'bg-industrial-900 hover:bg-industrial-850 text-industrial-400 hover:text-white border border-industrial-800'
            }`}
          >
            <Settings className="w-4 h-4" strokeWidth={1.75} />
            <span>Configuración del Proyecto</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="pt-2">
          {activeTab === 'overview' && (
            <OverviewTab project={project} floors={floors} items={items} />
          )}

          {activeTab === 'blueprint' && (
            <BlueprintTab
              project={project}
              floors={floors}
              items={items}
              onRefresh={loadData}
              onOpenLockModal={() => setIsLockModalOpen(true)}
            />
          )}

          {activeTab === 'kardex' && (
            <KardexTab project={project} items={items} onRefresh={loadData} />
          )}

          {activeTab === 'inspections' && (
            <InspectionsTab project={project} items={items} />
          )}

          {activeTab === 'billing' && (
            <BillingTab project={project} items={items} />
          )}

          {activeTab === 'settings' && (
            <SettingsTab project={project} onRefresh={loadData} />
          )}
        </div>
      </main>

      <Footer />

      {/* Lock Schema Confirmation Modal */}
      <LockSchemaModal
        isOpen={isLockModalOpen}
        projectName={project.name}
        onClose={() => setIsLockModalOpen(false)}
        onConfirm={handleConfirmLock}
      />
    </div>
  );
}
