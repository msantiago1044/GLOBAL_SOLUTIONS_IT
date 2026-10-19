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
  saveProjectItems,
  recalculateProjectProgress,
  lockProjectSchema,
  FloorZone,
} from '@/src/lib/projects-data';
import { ItemsRepository } from '@/src/services/items.repository';
import { Project } from '@/src/schemas/project.schema';
import { FloorItem } from '@/src/schemas/floor-item.schema';
import { isAdmin, isAuthenticated } from '@/src/lib/auth';
import {
  ArrowLeft,
  Gauge,
  Compass,
  Package,
  Camera,
  FileText,
  Settings,
  Lock,
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [highlightedItemCode, setHighlightedItemCode] = useState<string | null>(null);
  const [preselectedZone, setPreselectedZone] = useState<string | null>(null);

  const handleLocateOnBlueprint = (itemCode: string, zoneName: string) => {
    setHighlightedItemCode(itemCode);
    setPreselectedZone(zoneName);
    setActiveTab('blueprint');
  };

  const loadData = async () => {
    if (!projectId) return;
    const proj = getProject(projectId);
    if (proj) {
      setProject({ ...proj });
      setFloors([...getFloors(projectId)]);
      setItems([...getProjectItems(projectId)]);
    }

    // Carga de estado actualizado desde Supabase al entrar o recargar (F5)
    try {
      const repo = new ItemsRepository();
      const remoteItems = await repo.getItemsByProject(projectId);
      if (remoteItems && remoteItems.length >= 4000) {
        setItems(remoteItems);
        saveProjectItems(projectId, remoteItems);
        recalculateProjectProgress(projectId);
        const updatedProj = getProject(projectId);
        if (updatedProj) setProject({ ...updatedProj });
      }
    } catch {
      // Fallback a almacenamiento local si está en modo offline/demo
    }
  };

  useEffect(() => {
    loadData();
    const syncAuth = () => {
      const auth = isAuthenticated();
      setIsLoggedIn(auth);
      setIsAdminUser(isAdmin());
      if (!auth) {
        setActiveTab((prev) => (prev === 'settings' ? 'overview' : prev));
      }
    };
    syncAuth();
    window.addEventListener('gsit_auth_change', syncAuth);
    window.addEventListener('storage', syncAuth);
    return () => {
      window.removeEventListener('gsit_auth_change', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, [projectId]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-surface-main text-gsitText-main">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-brand-primary mx-auto" strokeWidth={2} />
          <h2 className="text-xl font-bold text-brand-deep">Proyecto No Encontrado</h2>
          <p className="text-xs text-gsitText-secondary font-mono">
            El identificador "{projectId}" no corresponde a una obra registrada.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-deep text-white text-xs font-semibold hover:bg-brand-hover shadow-sm"
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
    if (!isLoggedIn) return;
    lockProjectSchema(project.id);
    loadData();
  };

  const isLocked = project.schemaStatus === 'locked';

  return (
    <div className="min-h-screen flex flex-col bg-surface-main text-gsitText-main">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-gsitText-muted">
          <Link href="/projects" className="hover:text-brand-deep flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Portafolio de Proyectos</span>
          </Link>
          <span>/</span>
          <span className="text-brand-deep font-bold">{project.name}</span>
        </div>

        {/* Project Header Card */}
        <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-gsit-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-brand-deep tracking-tight">
                {project.name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-gsitText-secondary">
              <div>
                Cliente: <strong className="text-brand-deep">{project.client}</strong>
              </div>
              <div>
                Ubicación: <strong className="text-brand-deep">{project.address}</strong>
              </div>
              <div>
                Interventoría: <strong className="text-brand-deep">{project.interventoria}</strong>
              </div>
            </div>

            <div className="text-xs font-mono text-brand-accent font-bold pt-1">
              {project.systemType}
            </div>
          </div>

          {/* Quick stats on the right */}
          <div className="flex items-center gap-6 self-start lg:self-auto border-t lg:border-t-0 lg:border-l border-surface-border pt-4 lg:pt-0 lg:pl-6 text-xs">
            <div className="text-center">
              <span className="text-gsitText-muted text-[10px] uppercase font-bold block">Avance</span>
              <span className="text-2xl font-black text-emerald-600">{project.globalProgress}%</span>
            </div>
            <div className="text-center">
              <span className="text-gsitText-muted text-[10px] uppercase font-bold block">Zonas</span>
              <span className="text-2xl font-black text-brand-deep">{floors.length}</span>
            </div>
            <div className="text-center">
              <span className="text-gsitText-muted text-[10px] uppercase font-bold block">Ítems</span>
              <span className="text-2xl font-black text-brand-primary">{items.length}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Tools Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-surface-border text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all border ${
              activeTab === 'overview'
                ? 'bg-brand-deep text-white font-bold border-brand-deep shadow-sm'
                : 'bg-white hover:bg-surface-subtle text-gsitText-secondary hover:text-brand-deep border-surface-border'
            }`}
          >
            <Gauge className="w-4 h-4" strokeWidth={2} />
            <span>Visión General &amp; Metrado</span>
          </button>

          <button
            onClick={() => setActiveTab('blueprint')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all border ${
              activeTab === 'blueprint'
                ? 'bg-brand-deep text-white font-bold border-brand-deep shadow-sm'
                : 'bg-white hover:bg-surface-subtle text-gsitText-secondary hover:text-brand-deep border-surface-border'
            }`}
          >
            <Compass className="w-4 h-4" strokeWidth={2} />
            <span>Plano Técnico &amp; Esquema</span>
          </button>

          <button
            onClick={() => setActiveTab('kardex')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all border ${
              activeTab === 'kardex'
                ? 'bg-brand-deep text-white font-bold border-brand-deep shadow-sm'
                : 'bg-white hover:bg-surface-subtle text-gsitText-secondary hover:text-brand-deep border-surface-border'
            }`}
          >
            <Package className="w-4 h-4" strokeWidth={2} />
            <span>Kárdex de Componentes ({items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inspections')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all border ${
              activeTab === 'inspections'
                ? 'bg-brand-deep text-white font-bold border-brand-deep shadow-sm'
                : 'bg-white hover:bg-surface-subtle text-gsitText-secondary hover:text-brand-deep border-surface-border'
            }`}
          >
            <Camera className="w-4 h-4" strokeWidth={2} />
            <span>Evidencias e Inspección</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all border ${
              activeTab === 'billing'
                ? 'bg-brand-deep text-white font-bold border-brand-deep shadow-sm'
                : 'bg-white hover:bg-surface-subtle text-gsitText-secondary hover:text-brand-deep border-surface-border'
            }`}
          >
            <FileText className="w-4 h-4" strokeWidth={2} />
            <span>Corte de Facturación</span>
          </button>

          {isLoggedIn && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all border ${
                activeTab === 'settings'
                  ? 'bg-brand-deep text-white font-bold border-brand-deep shadow-sm'
                  : 'bg-white hover:bg-surface-subtle text-gsitText-secondary hover:text-brand-deep border-surface-border'
              }`}
            >
              <Settings className="w-4 h-4" strokeWidth={2} />
              <span>Configuración del Proyecto</span>
            </button>
          )}
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
              canEdit={isLoggedIn}
              highlightedItemCode={highlightedItemCode}
              preselectedZone={preselectedZone}
              onRefresh={loadData}
              onOpenLockModal={() => setIsLockModalOpen(true)}
            />
          )}

          {activeTab === 'kardex' && (
            <KardexTab
              project={project}
              items={items}
              canEdit={isLoggedIn}
              onRefresh={loadData}
              onLocateOnBlueprint={handleLocateOnBlueprint}
            />
          )}

          {activeTab === 'inspections' && (
            <InspectionsTab
              project={project}
              items={items}
              canEdit={isLoggedIn}
              onLocateOnBlueprint={handleLocateOnBlueprint}
            />
          )}

          {activeTab === 'billing' && (
            <BillingTab project={project} items={items} />
          )}

          {activeTab === 'settings' && isLoggedIn && (
            <SettingsTab project={project} canEdit={isLoggedIn} onRefresh={loadData} />
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
