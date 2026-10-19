import { Project, CreateProjectPayload } from '@/src/schemas/project.schema';
import { FloorItem } from '@/src/schemas/floor-item.schema';
import { isAuthenticated } from '@/src/lib/auth';
import estadioAllItems from '@/src/data/estadio-all-items.json';

export interface FloorZone {
  id: string;
  projectId: string;
  number: number;
  name: string;
  type: 'sotano' | 'cerebro' | 'oficinas' | 'habitaciones' | 'ejecucion';
  progress: number;
}

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'estadio-metropolitano',
    name: 'Estadio Metropolitano Roberto Meléndez',
    client: 'Alcaldía Distrital / Secretaría de Deportes',
    address: 'Calle 45 Murillo, Barranquilla, Atlántico',
    contractor: 'Global Solutions IT S.A.S.',
    interventoria: 'Interventoría Técnica Caribe S.A.',
    systemType: 'Detección Temprana & Tubería Conduit EMT — NFPA 72 Clase B',
    totalFloors: 4,
    globalProgress: 0,
    schemaStatus: 'editable',
    createdAt: '2026-10-10T10:00:00Z',
    updatedAt: '2026-10-10T14:30:00Z',
  },
];

export const DEFAULT_FLOORS: Record<string, FloorZone[]> = {
  'estadio-metropolitano': [
    { id: 'em-cancha', projectId: 'estadio-metropolitano', number: 0, name: 'Nivel de Cancha (-3.80 m)', type: 'sotano', progress: 0 },
    { id: 'em-nivel-1', projectId: 'estadio-metropolitano', number: 1, name: 'Nivel 1 (+42.08 m)', type: 'cerebro', progress: 0 },
    { id: 'em-mezanine', projectId: 'estadio-metropolitano', number: 2, name: 'Mezanine (+45.57 m)', type: 'oficinas', progress: 0 },
    { id: 'em-nivel-3', projectId: 'estadio-metropolitano', number: 3, name: 'Nivel 3 (+52.45 m)', type: 'ejecucion', progress: 0 },
  ],
};

export const DEFAULT_ITEMS: Record<string, FloorItem[]> = {
  'estadio-metropolitano': estadioAllItems as FloorItem[],
};

const STORAGE_KEY_PROJECTS = 'gsit_projects';
const STORAGE_KEY_FLOORS = 'gsit_floors';
const STORAGE_KEY_ITEMS = 'gsit_items';
const STORAGE_KEY_VERSION = 'gsit_data_version';
const CURRENT_DATA_VERSION = 'v12_estadio_4317_items_full';


function checkDataMigration(): void {
  if (typeof window === 'undefined') return;
  try {
    if (localStorage.getItem(STORAGE_KEY_VERSION) !== CURRENT_DATA_VERSION) {
      localStorage.clear();
      localStorage.setItem(STORAGE_KEY_VERSION, CURRENT_DATA_VERSION);
    }
  } catch {
    // ignore
  }
}


export function getProjects(): Project[] {
  if (typeof window === 'undefined') return DEFAULT_PROJECTS;
  checkDataMigration();
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
      return DEFAULT_PROJECTS;
    }
    const parsed = (JSON.parse(raw) as Project[]).filter((p) => p.id !== 'torre-titanium');
    return parsed;
  } catch {
    return DEFAULT_PROJECTS;
  }
}

export function getProject(id: string): Project | undefined {
  const projects = getProjects();
  return projects.find((p) => p.id === id);
}

export function saveProjects(projects: Project[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
}

export function createProject(payload: CreateProjectPayload): Project {
  if (typeof window !== 'undefined' && !isAuthenticated()) {
    throw new Error('No autorizado: Se requiere sesión de administrador para registrar proyectos.');
  }

  const projects = getProjects();
  const slug = payload.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const id = `${slug}-${Date.now().toString().slice(-4)}`;

  const newProject: Project = {
    id,
    name: payload.name,
    client: payload.client,
    address: payload.city,
    contractor: 'Global Solutions IT S.A.S.',
    interventoria: 'Interventoría Oficial',
    systemType: payload.system,
    totalFloors: payload.floorsCount,
    globalProgress: 0,
    schemaStatus: 'editable',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedProjects = [newProject, ...projects];
  saveProjects(updatedProjects);

  // Initialize empty floors
  const floors = getFloors(id);
  if (floors.length === 0) {
    const newFloors: FloorZone[] = [];
    for (let i = 1; i <= payload.floorsCount; i++) {
      newFloors.push({
        id: `${id}-f${i}`,
        projectId: id,
        number: i,
        name: `Zona / Nivel ${i}`,
        type: 'ejecucion',
        progress: 0,
      });
    }
    saveFloors(id, newFloors);
  }

  return newProject;
}

export function lockProjectSchema(id: string): boolean {
  if (typeof window !== 'undefined' && !isAuthenticated()) {
    return false;
  }

  const projects = getProjects();
  const project = projects.find((p) => p.id === id);
  if (!project) return false;

  project.schemaStatus = 'locked';
  project.updatedAt = new Date().toISOString();
  saveProjects(projects);
  return true;
}

export function getFloors(projectId: string): FloorZone[] {
  if (typeof window === 'undefined') return DEFAULT_FLOORS[projectId] || [];
  checkDataMigration();
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_FLOORS}_${projectId}`);
    if (!raw) {
      const defaults = DEFAULT_FLOORS[projectId] || [];
      if (defaults.length > 0) {
        localStorage.setItem(`${STORAGE_KEY_FLOORS}_${projectId}`, JSON.stringify(defaults));
      }
      return defaults;
    }
    const parsed = JSON.parse(raw) as FloorZone[];
    // Migración automática si la caché contenía 6 zonas antiguas para el estadio
    if (projectId === 'estadio-metropolitano' && parsed.length !== 4) {
      const defaults = DEFAULT_FLOORS[projectId] || [];
      localStorage.setItem(`${STORAGE_KEY_FLOORS}_${projectId}`, JSON.stringify(defaults));
      return defaults;
    }
    return parsed;
  } catch {
    return DEFAULT_FLOORS[projectId] || [];
  }
}

export function saveFloors(projectId: string, floors: FloorZone[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${STORAGE_KEY_FLOORS}_${projectId}`, JSON.stringify(floors));
}

export function getProjectItems(projectId: string): FloorItem[] {
  if (typeof window === 'undefined') return DEFAULT_ITEMS[projectId] || [];
  checkDataMigration();
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_ITEMS}_${projectId}`);
    if (!raw) {
      const defaults = DEFAULT_ITEMS[projectId] || [];
      localStorage.setItem(`${STORAGE_KEY_ITEMS}_${projectId}`, JSON.stringify(defaults));
      return defaults;
    }
    const parsed = JSON.parse(raw) as FloorItem[];
    // Migración automática si la caché contenía los datos preliminares antiguos
    const defaults = DEFAULT_ITEMS[projectId] || [];
    if (parsed.length < defaults.length) {
      localStorage.setItem(`${STORAGE_KEY_ITEMS}_${projectId}`, JSON.stringify(defaults));
      return defaults;
    }
    
    return parsed;
  } catch {
    return DEFAULT_ITEMS[projectId] || [];
  }
}

export function saveProjectItems(projectId: string, items: FloorItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${STORAGE_KEY_ITEMS}_${projectId}`, JSON.stringify(items));
}

export function addItem(item: FloorItem): void {
  if (typeof window !== 'undefined' && !isAuthenticated()) {
    return;
  }
  const items = getProjectItems(item.projectId);
  items.push(item);
  saveProjectItems(item.projectId, items);
  recalculateProjectProgress(item.projectId);
}

export function removeItem(projectId: string, itemId: string): void {
  if (typeof window !== 'undefined' && !isAuthenticated()) {
    return;
  }
  const items = getProjectItems(projectId);
  const filtered = items.filter((i) => i.id !== itemId);
  saveProjectItems(projectId, filtered);
  recalculateProjectProgress(projectId);
}

export function updateItemStatus(
  projectId: string,
  itemId: string,
  status: 'pending' | 'installed' | 'inspected',
  notesOrOptions?: string | { notes?: string; installerTeam?: string; photoUrl?: string }
): void {
  if (typeof window !== 'undefined' && !isAuthenticated()) {
    return;
  }
  const items = getProjectItems(projectId);
  const target = items.find((i) => i.id === itemId);
  if (target) {
    target.status = status;
    if (typeof notesOrOptions === 'string') {
      target.notes = notesOrOptions;
    } else if (notesOrOptions) {
      if (notesOrOptions.notes !== undefined) target.notes = notesOrOptions.notes;
      if (notesOrOptions.installerTeam !== undefined) target.installerTeam = notesOrOptions.installerTeam;
      if (notesOrOptions.photoUrl !== undefined) target.photoUrl = notesOrOptions.photoUrl;
    }
    if ((status === 'installed' || status === 'inspected') && !target.installedAt) {
      target.installedAt = new Date().toISOString();
    } else if (status === 'pending') {
      target.installedAt = null;
    }
    saveProjectItems(projectId, items);
    recalculateProjectProgress(projectId);
  }
}

export function recalculateProjectProgress(projectId: string): number {
  const items = getProjectItems(projectId);
  if (items.length === 0) return 0;

  const weights = {
    pending: 0,
    installed: 0.8,
    inspected: 1.0,
  };

  const totalPossible = items.length * 1.0;
  const currentSum = items.reduce((acc, curr) => acc + weights[curr.status], 0);
  const progress = Math.round((currentSum / totalPossible) * 100);

  const projects = getProjects();
  const proj = projects.find((p) => p.id === projectId);
  if (proj) {
    proj.globalProgress = progress;
    proj.updatedAt = new Date().toISOString();
    saveProjects(projects);
  }

  return progress;
}

export function updateProject(id: string, updates: Partial<Project>): Project | undefined {
  if (typeof window !== 'undefined' && !isAuthenticated()) {
    return undefined;
  }
  const projects = getProjects();
  const target = projects.find((p) => p.id === id);
  if (!target) return undefined;

  Object.assign(target, updates, { updatedAt: new Date().toISOString() });
  saveProjects(projects);
  return target;
}
