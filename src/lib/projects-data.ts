import { Project, CreateProjectPayload } from '@/src/schemas/project.schema';
import { FloorItem } from '@/src/schemas/floor-item.schema';
import { isAuthenticated } from '@/src/lib/auth';

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
    id: 'torre-titanium',
    name: 'Torre Titanium Plaza',
    client: 'Titanium Real Estate S.A.S.',
    address: 'Calle 100 # 19A-40, Bogotá D.C.',
    contractor: 'Global Solutions IT S.A.S.',
    interventoria: 'Consorcio Interventor Andino',
    systemType: 'Direccionable NFPA 72 - Clase A (Panel Notifier NFS2-3030)',
    totalFloors: 15,
    globalProgress: 0,
    schemaStatus: 'locked',
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-10-10T14:00:00Z',
  },
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
  'torre-titanium': [
    { id: 'tt-s2', projectId: 'torre-titanium', number: -2, name: 'Sótano 2 — Parqueaderos y Bombas', type: 'sotano', progress: 0 },
    { id: 'tt-s1', projectId: 'torre-titanium', number: -1, name: 'Sótano 1 — Subestación & Tableros', type: 'sotano', progress: 0 },
    { id: 'tt-p1', projectId: 'torre-titanium', number: 1, name: 'Piso 1 — Lobby Principal & FACP', type: 'cerebro', progress: 0 },
    { id: 'tt-p2', projectId: 'torre-titanium', number: 2, name: 'Piso 2 — Auditorio & Mezzanine', type: 'oficinas', progress: 0 },
    { id: 'tt-p3', projectId: 'torre-titanium', number: 3, name: 'Piso 3 — Oficinas Corporativas', type: 'oficinas', progress: 0 },
    { id: 'tt-p4', projectId: 'torre-titanium', number: 4, name: 'Piso 4 — Oficinas Coworking', type: 'oficinas', progress: 0 },
    { id: 'tt-p5', projectId: 'torre-titanium', number: 5, name: 'Piso 5 — Planta Técnica Central', type: 'ejecucion', progress: 0 },
    { id: 'tt-p6', projectId: 'torre-titanium', number: 6, name: 'Piso 6 — Oficinas Zona Norte', type: 'oficinas', progress: 0 },
    { id: 'tt-p7', projectId: 'torre-titanium', number: 7, name: 'Piso 7 — Oficinas Operativas', type: 'oficinas', progress: 0 },
    { id: 'tt-p8', projectId: 'torre-titanium', number: 8, name: 'Piso 8 — En Adecuación', type: 'ejecucion', progress: 0 },
    { id: 'tt-p9', projectId: 'torre-titanium', number: 9, name: 'Piso 9 — Cableado Estructurado', type: 'ejecucion', progress: 0 },
    { id: 'tt-p10', projectId: 'torre-titanium', number: 10, name: 'Piso 10 — Sin Intervenir', type: 'ejecucion', progress: 0 },
    { id: 'tt-p11', projectId: 'torre-titanium', number: 11, name: 'Piso 11 — Sin Intervenir', type: 'ejecucion', progress: 0 },
    { id: 'tt-p12', projectId: 'torre-titanium', number: 12, name: 'Piso 12 — Sin Intervenir', type: 'ejecucion', progress: 0 },
    { id: 'tt-p13', projectId: 'torre-titanium', number: 13, name: 'Piso 13 — Terraza Técnica', type: 'cerebro', progress: 0 },
  ],
  'estadio-metropolitano': [
    { id: 'em-cancha', projectId: 'estadio-metropolitano', number: 0, name: 'Nivel de Cancha (-3.80 m)', type: 'sotano', progress: 0 },
    { id: 'em-nivel-1', projectId: 'estadio-metropolitano', number: 1, name: 'Nivel 1 (+42.08 m)', type: 'cerebro', progress: 0 },
    { id: 'em-mezanine', projectId: 'estadio-metropolitano', number: 2, name: 'Mezanine (+45.57 m)', type: 'oficinas', progress: 0 },
    { id: 'em-nivel-3', projectId: 'estadio-metropolitano', number: 3, name: 'Nivel 3 (+52.45 m)', type: 'ejecucion', progress: 0 },
  ],
};

export const DEFAULT_ITEMS: Record<string, FloorItem[]> = {
  'torre-titanium': [
    {
      id: 'tt-item-1',
      projectId: 'torre-titanium',
      code: 'FACP-01',
      type: 'facp',
      name: 'Panel Principal de Alarma Contra Incendio',
      model: 'Notifier NFS2-3030 (Addressable)',
      zone: 'Piso 1 — Lobby Principal & FACP',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 28500000,
      installerTeam: 'Cuadrilla Especializada Redes A',
      notes: '',
    },
    {
      id: 'tt-item-tub-riser',
      projectId: 'torre-titanium',
      code: 'TUB-RIS-01',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 1-1/2" Troncal Vertical (Riser)',
      model: 'Colmena EMT C-80 Galvanizada Riser',
      zone: 'Piso 1 — Lobby Principal & FACP',
      status: 'pending',
      quantity: 120,
      unit: 'Metros Lineales',
      unitPrice: 62000,
      installerTeam: 'Cuadrilla Tubería A',
      notes: '',
    },
    {
      id: 'tt-item-cab-riser',
      projectId: 'torre-titanium',
      code: 'CAB-RIS-01',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Riser Vertical Principal',
      model: 'Honeywell Genesis FPLR 300V',
      zone: 'Piso 1 — Lobby Principal & FACP',
      status: 'pending',
      quantity: 250,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'tt-p1-sen-1',
      projectId: 'torre-titanium',
      code: 'TT-P1-SEN-01',
      type: 'detector-autonomo',
      name: 'Sensor Óptico de Humo Direccionable SLC',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Piso 1 — Lobby Principal & FACP',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 320000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'tt-p1-sen-2',
      projectId: 'torre-titanium',
      code: 'TT-P1-SEN-02',
      type: 'detector-autonomo',
      name: 'Sensor Térmico de Temperatura Direccionable SLC',
      model: 'Notifier FST-951 Sensor Térmico 57°C',
      zone: 'Piso 1 — Lobby Principal & FACP',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 295000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'tt-p1-sen-3',
      projectId: 'torre-titanium',
      code: 'TT-P1-SEN-03',
      type: 'detector-autonomo',
      name: 'Sensor Fotoeléctrico de Detección Temprana SLC',
      model: 'Notifier FSP-951IV',
      zone: 'Piso 1 — Lobby Principal & FACP',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 320000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'tt-p1-aut-1',
      projectId: 'torre-titanium',
      code: 'TT-P1-AUT-01',
      type: 'detector-autonomo',
      name: 'Detector Autónomo con Batería de Respaldo 10 Años',
      model: 'First Alert Pro Lithium 10Y Standalone',
      zone: 'Piso 1 — Lobby Principal & FACP',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 195000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'tt-p1-pal-1',
      projectId: 'torre-titanium',
      code: 'TT-P1-PAL-01',
      type: 'palanca',
      name: 'Estación Manual de Alarma Doble Acción (Acceso Principal)',
      model: 'Notifier NBG-12LX Direccionable',
      zone: 'Piso 1 — Lobby Principal & FACP',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'tt-p1-pal-2',
      projectId: 'torre-titanium',
      code: 'TT-P1-PAL-02',
      type: 'palanca',
      name: 'Estación Manual de Alarma Doble Acción (Salida Emergencia)',
      model: 'Notifier NBG-12LX Direccionable',
      zone: 'Piso 1 — Lobby Principal & FACP',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'tt-p1-sir-1',
      projectId: 'torre-titanium',
      code: 'TT-P1-SIR-01',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Sincronizada 24V (Lobby A)',
      model: 'System Sensor SpectrAlert Advance P2R',
      zone: 'Piso 1 — Lobby Principal & FACP',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 245000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'tt-p1-sir-2',
      projectId: 'torre-titanium',
      code: 'TT-P1-SIR-02',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Sincronizada 24V (Lobby B)',
      model: 'System Sensor SpectrAlert Advance P2R',
      zone: 'Piso 1 — Lobby Principal & FACP',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 245000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    // Piso 2
    {
      id: 'tt-item-2',
      projectId: 'torre-titanium',
      code: 'TUB-EMT-34',
      type: 'tuberia',
      name: 'Tubería Metálica Eléctrica Conduit EMT 3/4"',
      model: 'Colmena / RigiCol EMT C-80 Rojo',
      zone: 'Piso 2 — Auditorio & Mezzanine',
      status: 'pending',
      quantity: 340,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería B',
      notes: '',
    },
    {
      id: 'tt-item-3',
      projectId: 'torre-titanium',
      code: 'CAB-FPLR-214',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Rojo Certificado UL',
      model: 'Genesis / Honeywell Cable FPLR 300V',
      zone: 'Piso 2 — Auditorio & Mezzanine',
      status: 'pending',
      quantity: 580,
      unit: 'Metros',
      unitPrice: 12400,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'tt-p2-sen-1',
      projectId: 'torre-titanium',
      code: 'TT-P2-SEN-01',
      type: 'detector-autonomo',
      name: 'Sensor Óptico de Humo Direccionable SLC',
      model: 'Notifier FSP-951',
      zone: 'Piso 2 — Auditorio & Mezzanine',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 320000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'tt-p2-sen-2',
      projectId: 'torre-titanium',
      code: 'TT-P2-SEN-02',
      type: 'detector-autonomo',
      name: 'Sensor Térmico de Temperatura Direccionable SLC',
      model: 'Notifier FST-951',
      zone: 'Piso 2 — Auditorio & Mezzanine',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 295000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'tt-p2-sen-3',
      projectId: 'torre-titanium',
      code: 'TT-P2-SEN-03',
      type: 'detector-autonomo',
      name: 'Sensor Fotoeléctrico de Detección Temprana SLC',
      model: 'Notifier FSP-951',
      zone: 'Piso 2 — Auditorio & Mezzanine',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 320000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'tt-p2-aut-1',
      projectId: 'torre-titanium',
      code: 'TT-P2-AUT-01',
      type: 'detector-autonomo',
      name: 'Detector Autónomo con Batería de Respaldo 10 Años',
      model: 'First Alert Pro Lithium 10Y Standalone',
      zone: 'Piso 2 — Auditorio & Mezzanine',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 195000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'tt-p2-pal-1',
      projectId: 'torre-titanium',
      code: 'TT-P2-PAL-01',
      type: 'palanca',
      name: 'Estación Manual de Alarma Doble Acción (Acceso Auditorio)',
      model: 'Notifier NBG-12LX',
      zone: 'Piso 2 — Auditorio & Mezzanine',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'tt-p2-pal-2',
      projectId: 'torre-titanium',
      code: 'TT-P2-PAL-02',
      type: 'palanca',
      name: 'Estación Manual de Alarma Doble Acción (Salida Mezzanine)',
      model: 'Notifier NBG-12LX',
      zone: 'Piso 2 — Auditorio & Mezzanine',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'tt-p2-sir-1',
      projectId: 'torre-titanium',
      code: 'TT-P2-SIR-01',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Sincronizada 24V (Sector A)',
      model: 'System Sensor SpectrAlert Advance P2R',
      zone: 'Piso 2 — Auditorio & Mezzanine',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 245000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'tt-p2-sir-2',
      projectId: 'torre-titanium',
      code: 'TT-P2-SIR-02',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Sincronizada 24V (Sector B)',
      model: 'System Sensor SpectrAlert Advance P2R',
      zone: 'Piso 2 — Auditorio & Mezzanine',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 245000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    // Piso 3
    {
      id: 'tt-item-tub-p3',
      projectId: 'torre-titanium',
      code: 'TUB-EMT-P3',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Anillo Distribución',
      model: 'Colmena EMT C-80 Rojo',
      zone: 'Piso 3 — Oficinas Corporativas',
      status: 'pending',
      quantity: 210,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería B',
      notes: '',
    },
    {
      id: 'tt-item-cab-p3',
      projectId: 'torre-titanium',
      code: 'CAB-FPLR-P3',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Piso 3',
      model: 'Genesis / Honeywell Cable FPLR 300V',
      zone: 'Piso 3 — Oficinas Corporativas',
      status: 'pending',
      quantity: 320,
      unit: 'Metros',
      unitPrice: 12400,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'tt-p3-sen-1',
      projectId: 'torre-titanium',
      code: 'DET-SMK-01',
      type: 'detector-autonomo',
      name: 'Sensor Óptico de Humo Direccionable SLC',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Piso 3 — Oficinas Corporativas',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 320000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'tt-p3-sen-2',
      projectId: 'torre-titanium',
      code: 'DET-SMK-02',
      type: 'detector-autonomo',
      name: 'Sensor Térmico de Temperatura Direccionable SLC',
      model: 'Notifier FST-951',
      zone: 'Piso 3 — Oficinas Corporativas',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 295000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'tt-p3-sen-3',
      projectId: 'torre-titanium',
      code: 'DET-SMK-03',
      type: 'detector-autonomo',
      name: 'Sensor Fotoeléctrico de Detección Temprana SLC',
      model: 'Notifier FSP-951',
      zone: 'Piso 3 — Oficinas Corporativas',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 320000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'tt-p3-aut-1',
      projectId: 'torre-titanium',
      code: 'TT-P3-AUT-01',
      type: 'detector-autonomo',
      name: 'Detector Autónomo con Batería de Respaldo 10 Años',
      model: 'First Alert Pro Lithium 10Y Standalone',
      zone: 'Piso 3 — Oficinas Corporativas',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 195000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'tt-p3-pal-1',
      projectId: 'torre-titanium',
      code: 'TT-P3-PAL-01',
      type: 'palanca',
      name: 'Estación Manual de Alarma Doble Acción (Acceso Principal)',
      model: 'Notifier NBG-12LX',
      zone: 'Piso 3 — Oficinas Corporativas',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'tt-p3-pal-2',
      projectId: 'torre-titanium',
      code: 'TT-P3-PAL-02',
      type: 'palanca',
      name: 'Estación Manual de Alarma Doble Acción (Escalera Emergencia)',
      model: 'Notifier NBG-12LX',
      zone: 'Piso 3 — Oficinas Corporativas',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'tt-item-5',
      projectId: 'torre-titanium',
      code: 'SIR-STR-01',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Sincronizada 24V (Sector A)',
      model: 'System Sensor SpectrAlert Advance P2R',
      zone: 'Piso 3 — Oficinas Corporativas',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 245000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'tt-p3-sir-2',
      projectId: 'torre-titanium',
      code: 'SIR-STR-02',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Sincronizada 24V (Sector B)',
      model: 'System Sensor SpectrAlert Advance P2R',
      zone: 'Piso 3 — Oficinas Corporativas',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 245000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
  ],
  'estadio-metropolitano': [
    // =========================================================================
    // NIVEL DE CANCHA (-3.80 m) — Plancha SDI A100
    // =========================================================================
    {
      id: 'em-can-tub-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-CAN-TUB-01',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Cárcamo Perimetral (+37.35m)',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 420,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: 'Anillo técnico por cárcamo perimetral alimentando túneles de acceso.',
    },
    {
      id: 'em-can-cab-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-CAN-CAB-01',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Cancha',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 850,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: 'Lazo SLC tendido en tubería EMT para conexión de detectores y palancas de túneles.',
    },
    {
      id: 'em-can-sen-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-CAN-SEN-01',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Túnel Acceso Sur',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Monitoreo de humos en ducto de acceso sur a nivel de campo.',
    },
    {
      id: 'em-can-sen-02',
      projectId: 'estadio-metropolitano',
      code: 'EST-CAN-SEN-02',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Túnel Acceso Norte',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Monitoreo de humos en ducto de acceso norte a nivel de campo.',
    },
    {
      id: 'em-can-sen-03',
      projectId: 'estadio-metropolitano',
      code: 'EST-CAN-SEN-03',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Túnel Hospitality A',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-can-sen-04',
      projectId: 'estadio-metropolitano',
      code: 'EST-CAN-SEN-04',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Túnel Hospitality B',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-can-sen-05',
      projectId: 'estadio-metropolitano',
      code: 'EST-CAN-SEN-05',
      type: 'detector-autonomo',
      name: 'Detector Térmico (T) — Cuarto Técnico Cárcamo',
      model: 'Notifier FST-951 Térmico Fijo 57°C',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 345000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-can-pal-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-CAN-PAL-01',
      type: 'palanca',
      name: 'Estación Manual Doble Acción (F) — Boca Túnel Sur',
      model: 'Notifier NBG-12LX con Cubierta Weatherproof',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Punto de activación de alarma manual en ingreso a gramilla.',
    },
    {
      id: 'em-can-pal-02',
      projectId: 'estadio-metropolitano',
      code: 'EST-CAN-PAL-02',
      type: 'palanca',
      name: 'Estación Manual Doble Acción (F) — Boca Túnel Norte',
      model: 'Notifier NBG-12LX con Cubierta Weatherproof',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Punto de activación de alarma manual en salida norte de emergencia.',
    },
    {
      id: 'em-can-sir-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-CAN-SIR-01',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Intemperie 110dB (Túnel Sur)',
      model: 'System Sensor P2RH-K NEMA 4X Outdoor',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 310000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-can-sir-02',
      projectId: 'estadio-metropolitano',
      code: 'EST-CAN-SIR-02',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Intemperie 110dB (Túnel Norte)',
      model: 'System Sensor P2RH-K NEMA 4X Outdoor',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 310000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-can-caj-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-CAN-CAJ-01',
      type: 'tuberia',
      name: 'Cajas Condulet 4"x4" y Registros de Cárcamo 50x50',
      model: 'Rawelt Condulet FS/FD 3/4" IP66',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 18,
      unit: 'Unidad',
      unitPrice: 65000,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: 'Puntos de derivación e inspección estanca.',
    },

    // =========================================================================
    // NIVEL 1 (+42.08 m) — Plancha SDI A101 (Cerebro Operativo & Camerinos)
    // =========================================================================
    {
      id: 'em-n1-facp-02',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-FACP-02',
      type: 'facp',
      name: 'Panel de Incendio Notifier No. 2 (Centro de Control)',
      model: 'Notifier NFS2-3030 con Red Noti-Fire-Net',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 34500000,
      installerTeam: 'Cuadrilla Especializada Redes A',
      notes: 'Controlador central de lazo SLC y notificación para Nivel 1 y Cancha.',
    },
    {
      id: 'em-n1-facp-03',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-FACP-03',
      type: 'facp',
      name: 'Panel de Incendio Notifier No. 3 (Subestación Occidental)',
      model: 'Notifier NFS2-640 Direccionable',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 22800000,
      installerTeam: 'Cuadrilla Especializada Redes A',
      notes: 'Subpanel secundario para potencia y lazos de áreas técnicas.',
    },
    {
      id: 'em-n1-ar-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-AR-01',
      type: 'facp',
      name: 'Anunciador Remoto LCD Notifier (Acceso Taquillas / Recepción)',
      model: 'Notifier LCD-160 Repetidor de Alarma',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 4850000,
      installerTeam: 'Cuadrilla Especializada Redes A',
      notes: 'Visualización y silenciamiento remoto en recepción de autoridades.',
    },
    {
      id: 'em-n1-tub-tron',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-TUB-TRON',
      type: 'tuberia',
      name: 'Tubería 1" EMT Troncal Anillo Perimetral Nivel 1',
      model: 'Conduit EMT 1 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 680,
      unit: 'Metros Lineales',
      unitPrice: 46000,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: 'Canalización troncal en anillo cerrado por pasillo de distribución.',
    },
    {
      id: 'em-n1-tub-ram',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-TUB-RAM',
      type: 'tuberia',
      name: 'Tubería 3/4" EMT Ramales Camerinos y Áreas Técnicas',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 520,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: 'Derivaciones a Camerinos, Museo, Sala de Prensa y Ligas Deportivas.',
    },
    {
      id: 'em-n1-cab-slc',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-CAB-SLC',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Nivel 1',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1450,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: 'Lazos SLC direccionables redundantes Clase A.',
    },
    {
      id: 'em-n1-sen-col',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-SEN-COL',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Camerino Selección Colombia',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n1-sen-jun',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-SEN-JUN',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Camerino Junior de Barranquilla',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n1-sen-vis1',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-SEN-VIS1',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Camerino Visitantes 1',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n1-sen-vis2',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-SEN-VIS2',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Camerino Visitantes 2',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n1-sen-pren',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-SEN-PREN',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Sala de Prensa Principal (252 m²)',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n1-sen-med',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-SEN-MED',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Sala Médica & Antidopaje',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n1-sen-box',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-SEN-BOX',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Liga de Boxeo (705 m²)',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n1-sen-gim',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-SEN-GIM',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Liga de Gimnasia',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n1-sen-hco1',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-SEN-HCO1',
      type: 'detector-doble',
      name: 'Detector Térmico y Monóxido CO (H CO) — Subestación Eléctrica Occ.',
      model: 'Notifier FCO-951 Sensor Avanzado CO/Térmico',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 620000,
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Detección combinada de sobrecalentamiento y gases de combustión en celdas.',
    },
    {
      id: 'em-n1-sen-hco2',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-SEN-HCO2',
      type: 'detector-doble',
      name: 'Detector Térmico y Monóxido CO (H CO) — Central de Generación Eléctrica',
      model: 'Notifier FCO-951 Sensor Avanzado CO/Térmico',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 620000,
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Supervisión en sala de generadores diésel de emergencia.',
    },
    {
      id: 'em-n1-sen-sh1',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-SEN-SH1',
      type: 'detector-doble',
      name: 'Detector Humo y Térmico (S H) — Taller de Mantenimiento',
      model: 'Notifier FAPT-951 Multicriterio Humo/Temperatura',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 580000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n1-pal-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-PAL-01',
      type: 'palanca',
      name: 'Estación Manual Doble Acción (F) — Acceso Occidental Principal',
      model: 'Notifier NBG-12LX Direccionable',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n1-pal-02',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-PAL-02',
      type: 'palanca',
      name: 'Estación Manual Doble Acción (F) — Pasillo Central Camerinos',
      model: 'Notifier NBG-12LX Direccionable',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n1-pal-03',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-PAL-03',
      type: 'palanca',
      name: 'Estación Manual Doble Acción (F) — Acceso Oriental',
      model: 'Notifier NBG-12LX Direccionable',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n1-sir-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-SIR-01',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Sincronizada 24V (Camerinos)',
      model: 'System Sensor SpectrAlert Advance P2R',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 245000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n1-sir-02',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-SIR-02',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Sincronizada 24V (Sala de Prensa)',
      model: 'System Sensor SpectrAlert Advance P2R',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 245000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n1-sir-03',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-SIR-03',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Sincronizada 24V (Ligas Deportivas)',
      model: 'System Sensor SpectrAlert Advance P2R',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 245000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n1-reg-pas',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-REG-PAS',
      type: 'tuberia',
      name: 'Registros Pasantes Verticales (⤊/⤋) — Riser Cancha / Mezanine',
      model: 'Gabinete Registro Riser 50x50cm NEMA 1',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 6,
      unit: 'Unidad',
      unitPrice: 185000,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: 'Pases de tubería troncal que interconectan Nivel 1 con Cancha y Mezanine.',
    },

    // =========================================================================
    // MEZANINE (+45.57 m) — Plancha SDI A102 (Palcos VIP & Administración)
    // =========================================================================
    {
      id: 'em-mez-tub-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-MEZ-TUB-01',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Anillo Mezanine',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Mezanine (+45.57 m)',
      status: 'pending',
      quantity: 360,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: 'Distribución por cielo falso en zonas VIP, museos y secretaría.',
    },
    {
      id: 'em-mez-cab-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-MEZ-CAB-01',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Mezanine',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Mezanine (+45.57 m)',
      status: 'pending',
      quantity: 720,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-mez-sen-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-MEZ-SEN-01',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Área VIP Occidental (518 m²)',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Mezanine (+45.57 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-mez-sen-02',
      projectId: 'estadio-metropolitano',
      code: 'EST-MEZ-SEN-02',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Museo Selección Colombia Mezanine',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Mezanine (+45.57 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-mez-sen-03',
      projectId: 'estadio-metropolitano',
      code: 'EST-MEZ-SEN-03',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Puente Conexión entre Museos',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Mezanine (+45.57 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-mez-sen-04',
      projectId: 'estadio-metropolitano',
      code: 'EST-MEZ-SEN-04',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Jefatura Escenarios Deportivos',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Mezanine (+45.57 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-mez-sen-05',
      projectId: 'estadio-metropolitano',
      code: 'EST-MEZ-SEN-05',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Sala de Espera y Juntas',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Mezanine (+45.57 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-mez-pal-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-MEZ-PAL-01',
      type: 'palanca',
      name: 'Estación Manual Doble Acción (F) — Acceso Palcos VIP',
      model: 'Notifier NBG-12LX Direccionable',
      zone: 'Mezanine (+45.57 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-mez-pal-02',
      projectId: 'estadio-metropolitano',
      code: 'EST-MEZ-PAL-02',
      type: 'palanca',
      name: 'Estación Manual Doble Acción (F) — Escalera Mezanine Sur',
      model: 'Notifier NBG-12LX Direccionable',
      zone: 'Mezanine (+45.57 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-mez-sir-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-MEZ-SIR-01',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica 24V (Salón VIP Mezanine)',
      model: 'System Sensor SpectrAlert Advance P2R',
      zone: 'Mezanine (+45.57 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 245000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-mez-mod-rel',
      projectId: 'estadio-metropolitano',
      code: 'EST-MEZ-MOD-REL',
      type: 'cuadro-bomba',
      name: 'Módulo de Relevo / Control (CR) — Corte Audio y Aire Acondicionado',
      model: 'Notifier FCM-1 Módulo de Control Direccionable',
      zone: 'Mezanine (+45.57 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 380000,
      installerTeam: 'Cuadrilla Especializada Redes A',
      notes: 'Interrupción automática de audio ambiental y despresurización en caso de alarma.',
    },

    // =========================================================================
    // NIVEL 3 (+52.45 m) — Plancha SDI A104 (Corona Alta & Puntos Fijos)
    // =========================================================================
    {
      id: 'em-n3-tub-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-N3-TUB-01',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Anillo Perimetral Nivel 3',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel 3 (+52.45 m)',
      status: 'pending',
      quantity: 580,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: 'Anillo de coronación superior recorriendo las 4 tribunas.',
    },
    {
      id: 'em-n3-cab-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-N3-CAB-01',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Nivel 3',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Nivel 3 (+52.45 m)',
      status: 'pending',
      quantity: 1100,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-n3-sen-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-N3-SEN-01',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Batería Baños y Aseos Occ.',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Nivel 3 (+52.45 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n3-sen-02',
      projectId: 'estadio-metropolitano',
      code: 'EST-N3-SEN-02',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Gradería Prensa Alta (80 m²)',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Nivel 3 (+52.45 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n3-sen-03',
      projectId: 'estadio-metropolitano',
      code: 'EST-N3-SEN-03',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Puntos Fijos y Cuartos Técnicos',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Nivel 3 (+52.45 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n3-sen-04',
      projectId: 'estadio-metropolitano',
      code: 'EST-N3-SEN-04',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Batería Baños Oriental',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Nivel 3 (+52.45 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n3-pal-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-N3-PAL-01',
      type: 'palanca',
      name: 'Estación Manual Doble Acción (F) — Salida Caracola Noroccidental',
      model: 'Notifier NBG-12LX con Cubierta Weatherproof',
      zone: 'Nivel 3 (+52.45 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n3-pal-02',
      projectId: 'estadio-metropolitano',
      code: 'EST-N3-PAL-02',
      type: 'palanca',
      name: 'Estación Manual Doble Acción (F) — Salida Caracola Suroccidental',
      model: 'Notifier NBG-12LX con Cubierta Weatherproof',
      zone: 'Nivel 3 (+52.45 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n3-pal-03',
      projectId: 'estadio-metropolitano',
      code: 'EST-N3-PAL-03',
      type: 'palanca',
      name: 'Estación Manual Doble Acción (F) — Salida Caracola Nororiental',
      model: 'Notifier NBG-12LX con Cubierta Weatherproof',
      zone: 'Nivel 3 (+52.45 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n3-pal-04',
      projectId: 'estadio-metropolitano',
      code: 'EST-N3-PAL-04',
      type: 'palanca',
      name: 'Estación Manual Doble Acción (F) — Salida Caracola Suroriental',
      model: 'Notifier NBG-12LX con Cubierta Weatherproof',
      zone: 'Nivel 3 (+52.45 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n3-sir-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-N3-SIR-01',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Intemperie 110dB (Sector Occidental)',
      model: 'System Sensor P2RH-K Intemperie NEMA 4X',
      zone: 'Nivel 3 (+52.45 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 310000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n3-sir-02',
      projectId: 'estadio-metropolitano',
      code: 'EST-N3-SIR-02',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Intemperie 110dB (Sector Oriental)',
      model: 'System Sensor P2RH-K Intemperie NEMA 4X',
      zone: 'Nivel 3 (+52.45 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 310000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n3-caj-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-N3-CAJ-01',
      type: 'tuberia',
      name: 'Cajas de Conexión 4"x4" y Cajas de Empalme Intemperie Nivel 3',
      model: 'Rawelt Condulet 3/4" NEMA 4X',
      zone: 'Nivel 3 (+52.45 m)',
      status: 'pending',
      quantity: 24,
      unit: 'Unidad',
      unitPrice: 65000,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
  ],
};

const STORAGE_KEY_PROJECTS = 'gsit_projects';
const STORAGE_KEY_FLOORS = 'gsit_floors';
const STORAGE_KEY_ITEMS = 'gsit_items';
const STORAGE_KEY_VERSION = 'gsit_data_version';
const CURRENT_DATA_VERSION = 'v7_planos_estadio_sdi';


function checkDataMigration(): void {
  if (typeof window === 'undefined') return;
  try {
    if (localStorage.getItem(STORAGE_KEY_VERSION) !== CURRENT_DATA_VERSION) {
      localStorage.removeItem(STORAGE_KEY_PROJECTS);
      localStorage.removeItem(`${STORAGE_KEY_FLOORS}_torre-titanium`);
      localStorage.removeItem(`${STORAGE_KEY_FLOORS}_estadio-metropolitano`);
      localStorage.removeItem(`${STORAGE_KEY_ITEMS}_torre-titanium`);
      localStorage.removeItem(`${STORAGE_KEY_ITEMS}_estadio-metropolitano`);
      localStorage.removeItem('gsit_inspections_torre-titanium');
      localStorage.removeItem('gsit_inspections_estadio-metropolitano');
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
    return JSON.parse(raw) as Project[];
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
    if (projectId === 'estadio-metropolitano' && !parsed.some((i) => i.code === 'EST-Z4-SEN-01')) {
      const defaults = DEFAULT_ITEMS[projectId] || [];
      localStorage.setItem(`${STORAGE_KEY_ITEMS}_${projectId}`, JSON.stringify(defaults));
      return defaults;
    }
    if (projectId === 'torre-titanium' && !parsed.some((i) => i.code === 'TT-P1-SEN-01')) {
      const defaults = DEFAULT_ITEMS[projectId] || [];
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
