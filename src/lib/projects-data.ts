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

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'torre-titanium',
    name: 'Torre Titanium Plaza',
    client: 'Titanium Real Estate S.A.S.',
    address: 'Calle 100 # 19A-40, Bogotá D.C.',
    contractor: 'Global Solutions IT S.A.S.',
    interventoria: 'Consorcio Interventor Andino',
    systemType: 'Direccionable NFPA 72 - Clase A (Panel Notifier NFS2-3030)',
    totalFloors: 15,
    globalProgress: 58,
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
    totalFloors: 6,
    globalProgress: 0,
    schemaStatus: 'editable',
    createdAt: '2026-10-10T10:00:00Z',
    updatedAt: '2026-10-10T14:30:00Z',
  },
];

const DEFAULT_FLOORS: Record<string, FloorZone[]> = {
  'torre-titanium': [
    { id: 'tt-s2', projectId: 'torre-titanium', number: -2, name: 'Sótano 2 — Parqueaderos y Bombas', type: 'sotano', progress: 100 },
    { id: 'tt-s1', projectId: 'torre-titanium', number: -1, name: 'Sótano 1 — Subestación & Tableros', type: 'sotano', progress: 100 },
    { id: 'tt-p1', projectId: 'torre-titanium', number: 1, name: 'Piso 1 — Lobby Principal & FACP', type: 'cerebro', progress: 100 },
    { id: 'tt-p2', projectId: 'torre-titanium', number: 2, name: 'Piso 2 — Auditorio & Mezzanine', type: 'oficinas', progress: 85 },
    { id: 'tt-p3', projectId: 'torre-titanium', number: 3, name: 'Piso 3 — Oficinas Corporativas', type: 'oficinas', progress: 75 },
    { id: 'tt-p4', projectId: 'torre-titanium', number: 4, name: 'Piso 4 — Oficinas Coworking', type: 'oficinas', progress: 60 },
    { id: 'tt-p5', projectId: 'torre-titanium', number: 5, name: 'Piso 5 — Planta Técnica Central', type: 'ejecucion', progress: 40 },
    { id: 'tt-p6', projectId: 'torre-titanium', number: 6, name: 'Piso 6 — Oficinas Zona Norte', type: 'oficinas', progress: 30 },
    { id: 'tt-p7', projectId: 'torre-titanium', number: 7, name: 'Piso 7 — Oficinas Operativas', type: 'oficinas', progress: 15 },
    { id: 'tt-p8', projectId: 'torre-titanium', number: 8, name: 'Piso 8 — En Adecuación', type: 'ejecucion', progress: 0 },
    { id: 'tt-p9', projectId: 'torre-titanium', number: 9, name: 'Piso 9 — Cableado Estructurado', type: 'ejecucion', progress: 0 },
    { id: 'tt-p10', projectId: 'torre-titanium', number: 10, name: 'Piso 10 — Sin Intervenir', type: 'ejecucion', progress: 0 },
    { id: 'tt-p11', projectId: 'torre-titanium', number: 11, name: 'Piso 11 — Sin Intervenir', type: 'ejecucion', progress: 0 },
    { id: 'tt-p12', projectId: 'torre-titanium', number: 12, name: 'Piso 12 — Sin Intervenir', type: 'ejecucion', progress: 0 },
    { id: 'tt-p13', projectId: 'torre-titanium', number: 13, name: 'Piso 13 — Terraza Técnica', type: 'cerebro', progress: 0 },
  ],
  'estadio-metropolitano': [
    { id: 'em-z1', projectId: 'estadio-metropolitano', number: 1, name: 'Zona 1 — Gradería Occidental & Prensa', type: 'ejecucion', progress: 0 },
    { id: 'em-z2', projectId: 'estadio-metropolitano', number: 2, name: 'Zona 2 — Gradería Oriental & Accesos', type: 'ejecucion', progress: 0 },
    { id: 'em-z3', projectId: 'estadio-metropolitano', number: 3, name: 'Zona 3 — Gradería Norte', type: 'ejecucion', progress: 0 },
    { id: 'em-z4', projectId: 'estadio-metropolitano', number: 4, name: 'Zona 4 — Gradería Sur', type: 'ejecucion', progress: 0 },
    { id: 'em-z5', projectId: 'estadio-metropolitano', number: 5, name: 'Zona 5 — Palcos VIP & Zona Mixta', type: 'oficinas', progress: 0 },
    { id: 'em-z6', projectId: 'estadio-metropolitano', number: 6, name: 'Zona 6 — Cuarto Bombas & Subestación', type: 'sotano', progress: 0 },
  ],
};

const DEFAULT_ITEMS: Record<string, FloorItem[]> = {
  'torre-titanium': [
    {
      id: 'tt-item-1',
      projectId: 'torre-titanium',
      code: 'FACP-01',
      type: 'facp',
      name: 'Panel Principal de Alarma Contra Incendio',
      model: 'Notifier NFS2-3030 (Addressable)',
      zone: 'Piso 1 — Lobby Principal & FACP',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 28500000,
      installedAt: '2026-03-10T10:00:00Z',
      installerTeam: 'Cuadrilla Especializada Redes A',
      notes: 'Instalado y comisionado con lazo SLC activo.',
    },
    {
      id: 'tt-item-tub-riser',
      projectId: 'torre-titanium',
      code: 'TUB-RIS-01',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 1-1/2" Troncal Vertical (Riser)',
      model: 'Colmena EMT C-80 Galvanizada Riser',
      zone: 'Piso 1 — Lobby Principal & FACP',
      status: 'inspected',
      quantity: 120,
      unit: 'Metros Lineales',
      unitPrice: 62000,
      installedAt: '2026-03-11T12:00:00Z',
      installerTeam: 'Cuadrilla Tubería A',
      notes: 'Montante vertical en ducto eléctrico con anclajes antisísmicos cada 1.5m.',
    },
    {
      id: 'tt-item-cab-riser',
      projectId: 'torre-titanium',
      code: 'CAB-RIS-01',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Riser Vertical Principal',
      model: 'Honeywell Genesis FPLR 300V',
      zone: 'Piso 1 — Lobby Principal & FACP',
      status: 'inspected',
      quantity: 250,
      unit: 'Metros',
      unitPrice: 14500,
      installedAt: '2026-03-11T14:00:00Z',
      installerTeam: 'Cuadrilla Cableado C',
      notes: 'Tendido en tubería Conduit vertical con certificación de continuidad 100%.',
    },
    {
      id: 'tt-p1-sen-1',
      projectId: 'torre-titanium',
      code: 'TT-P1-SEN-01',
      type: 'detector-autonomo',
      name: 'Sensor Óptico de Humo Direccionable SLC',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Piso 1 — Lobby Principal & FACP',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 320000,
      installedAt: '2026-03-12T10:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Interconectado en lazo SLC mediante tubería Conduit EMT 3/4".',
    },
    {
      id: 'tt-p1-sen-2',
      projectId: 'torre-titanium',
      code: 'TT-P1-SEN-02',
      type: 'detector-autonomo',
      name: 'Sensor Térmico de Temperatura Direccionable SLC',
      model: 'Notifier FST-951 Sensor Térmico 57°C',
      zone: 'Piso 1 — Lobby Principal & FACP',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 295000,
      installedAt: '2026-03-12T11:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Interconectado en lazo SLC mediante tubería Conduit EMT 3/4".',
    },
    {
      id: 'tt-p1-sen-3',
      projectId: 'torre-titanium',
      code: 'TT-P1-SEN-03',
      type: 'detector-autonomo',
      name: 'Sensor Fotoeléctrico de Detección Temprana SLC',
      model: 'Notifier FSP-951IV',
      zone: 'Piso 1 — Lobby Principal & FACP',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 320000,
      installedAt: '2026-03-12T12:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Interconectado en lazo SLC hacia panel FACP central.',
    },
    {
      id: 'tt-p1-aut-1',
      projectId: 'torre-titanium',
      code: 'TT-P1-AUT-01',
      type: 'detector-autonomo',
      name: 'Detector Autónomo con Batería de Respaldo 10 Años',
      model: 'First Alert Pro Lithium 10Y Standalone',
      zone: 'Piso 1 — Lobby Principal & FACP',
      status: 'installed',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 195000,
      installedAt: '2026-03-12T14:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Equipo autónomo independiente a batería. No requiere tubería ni cable exterior.',
    },
    {
      id: 'tt-p1-pal-1',
      projectId: 'torre-titanium',
      code: 'TT-P1-PAL-01',
      type: 'palanca',
      name: 'Estación Manual de Alarma Doble Acción (Acceso Principal)',
      model: 'Notifier NBG-12LX Direccionable',
      zone: 'Piso 1 — Lobby Principal & FACP',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installedAt: '2026-03-13T10:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Conectada a lazo SLC por tubería Conduit EMT 3/4".',
    },
    {
      id: 'tt-p1-pal-2',
      projectId: 'torre-titanium',
      code: 'TT-P1-PAL-02',
      type: 'palanca',
      name: 'Estación Manual de Alarma Doble Acción (Salida Emergencia)',
      model: 'Notifier NBG-12LX Direccionable',
      zone: 'Piso 1 — Lobby Principal & FACP',
      status: 'installed',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installedAt: '2026-03-13T11:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Conectada a lazo SLC por tubería Conduit EMT 3/4".',
    },
    {
      id: 'tt-p1-sir-1',
      projectId: 'torre-titanium',
      code: 'TT-P1-SIR-01',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Sincronizada 24V (Lobby A)',
      model: 'System Sensor SpectrAlert Advance P2R',
      zone: 'Piso 1 — Lobby Principal & FACP',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 245000,
      installedAt: '2026-03-13T15:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Conectada a circuito NAC por tubería Conduit EMT 3/4".',
    },
    {
      id: 'tt-p1-sir-2',
      projectId: 'torre-titanium',
      code: 'TT-P1-SIR-02',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Sincronizada 24V (Lobby B)',
      model: 'System Sensor SpectrAlert Advance P2R',
      zone: 'Piso 1 — Lobby Principal & FACP',
      status: 'installed',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 245000,
      installedAt: '2026-03-13T16:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Conectada a circuito NAC por tubería Conduit EMT 3/4".',
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
      status: 'installed',
      quantity: 340,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installedAt: '2026-03-15T15:30:00Z',
      installerTeam: 'Cuadrilla Tubería B',
      notes: 'Anclaje con abrazaderas tipo U y uniones tipo tornillo.',
    },
    {
      id: 'tt-item-3',
      projectId: 'torre-titanium',
      code: 'CAB-FPLR-214',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Rojo Certificado UL',
      model: 'Genesis / Honeywell Cable FPLR 300V',
      zone: 'Piso 2 — Auditorio & Mezzanine',
      status: 'installed',
      quantity: 580,
      unit: 'Metros',
      unitPrice: 12400,
      installedAt: '2026-03-18T11:00:00Z',
      installerTeam: 'Cuadrilla Cableado C',
      notes: 'Prueba de aislamiento y continuidad 100% OK.',
    },
    {
      id: 'tt-p2-sen-1',
      projectId: 'torre-titanium',
      code: 'TT-P2-SEN-01',
      type: 'detector-autonomo',
      name: 'Sensor Óptico de Humo Direccionable SLC',
      model: 'Notifier FSP-951',
      zone: 'Piso 2 — Auditorio & Mezzanine',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 320000,
      installedAt: '2026-03-19T10:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Interconectado en lazo SLC por tubería Conduit EMT 3/4".',
    },
    {
      id: 'tt-p2-sen-2',
      projectId: 'torre-titanium',
      code: 'TT-P2-SEN-02',
      type: 'detector-autonomo',
      name: 'Sensor Térmico de Temperatura Direccionable SLC',
      model: 'Notifier FST-951',
      zone: 'Piso 2 — Auditorio & Mezzanine',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 295000,
      installedAt: '2026-03-19T11:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Interconectado en lazo SLC por tubería Conduit EMT 3/4".',
    },
    {
      id: 'tt-p2-sen-3',
      projectId: 'torre-titanium',
      code: 'TT-P2-SEN-03',
      type: 'detector-autonomo',
      name: 'Sensor Fotoeléctrico de Detección Temprana SLC',
      model: 'Notifier FSP-951',
      zone: 'Piso 2 — Auditorio & Mezzanine',
      status: 'installed',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 320000,
      installedAt: '2026-03-19T12:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Interconectado en lazo SLC hacia el panel central.',
    },
    {
      id: 'tt-p2-aut-1',
      projectId: 'torre-titanium',
      code: 'TT-P2-AUT-01',
      type: 'detector-autonomo',
      name: 'Detector Autónomo con Batería de Respaldo 10 Años',
      model: 'First Alert Pro Lithium 10Y Standalone',
      zone: 'Piso 2 — Auditorio & Mezzanine',
      status: 'installed',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 195000,
      installedAt: '2026-03-19T14:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Equipo autónomo independiente a batería. No requiere tubería ni cable exterior.',
    },
    {
      id: 'tt-p2-pal-1',
      projectId: 'torre-titanium',
      code: 'TT-P2-PAL-01',
      type: 'palanca',
      name: 'Estación Manual de Alarma Doble Acción (Acceso Auditorio)',
      model: 'Notifier NBG-12LX',
      zone: 'Piso 2 — Auditorio & Mezzanine',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installedAt: '2026-03-19T15:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Conectada a lazo SLC por tubería Conduit EMT 3/4".',
    },
    {
      id: 'tt-p2-pal-2',
      projectId: 'torre-titanium',
      code: 'TT-P2-PAL-02',
      type: 'palanca',
      name: 'Estación Manual de Alarma Doble Acción (Salida Mezzanine)',
      model: 'Notifier NBG-12LX',
      zone: 'Piso 2 — Auditorio & Mezzanine',
      status: 'installed',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installedAt: '2026-03-19T16:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Conectada a lazo SLC por tubería Conduit EMT 3/4".',
    },
    {
      id: 'tt-p2-sir-1',
      projectId: 'torre-titanium',
      code: 'TT-P2-SIR-01',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Sincronizada 24V (Sector A)',
      model: 'System Sensor SpectrAlert Advance P2R',
      zone: 'Piso 2 — Auditorio & Mezzanine',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 245000,
      installedAt: '2026-03-19T17:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Conectada a circuito NAC por tubería Conduit EMT 3/4".',
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
      notes: 'Conectada a circuito NAC por tubería Conduit EMT 3/4".',
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
      status: 'inspected',
      quantity: 210,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installedAt: '2026-03-20T14:00:00Z',
      installerTeam: 'Cuadrilla Tubería B',
      notes: 'Canalización sobre cielo raso suspendido conectando detectores de humo y difusores.',
    },
    {
      id: 'tt-item-cab-p3',
      projectId: 'torre-titanium',
      code: 'CAB-FPLR-P3',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Piso 3',
      model: 'Genesis / Honeywell Cable FPLR 300V',
      zone: 'Piso 3 — Oficinas Corporativas',
      status: 'inspected',
      quantity: 320,
      unit: 'Metros',
      unitPrice: 12400,
      installedAt: '2026-03-20T16:00:00Z',
      installerTeam: 'Cuadrilla Cableado C',
      notes: 'Tendido en tubería Conduit EMT 3/4" con conexión a panel central.',
    },
    {
      id: 'tt-p3-sen-1',
      projectId: 'torre-titanium',
      code: 'DET-SMK-01',
      type: 'detector-autonomo',
      name: 'Sensor Óptico de Humo Direccionable SLC',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Piso 3 — Oficinas Corporativas',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 320000,
      installedAt: '2026-03-22T09:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Mapeo de direcciones 101 en panel. Conectado a Conduit EMT 3/4" y lazo SLC.',
    },
    {
      id: 'tt-p3-sen-2',
      projectId: 'torre-titanium',
      code: 'DET-SMK-02',
      type: 'detector-autonomo',
      name: 'Sensor Térmico de Temperatura Direccionable SLC',
      model: 'Notifier FST-951',
      zone: 'Piso 3 — Oficinas Corporativas',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 295000,
      installedAt: '2026-03-22T10:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Interconectado en lazo SLC por tubería Conduit EMT 3/4".',
    },
    {
      id: 'tt-p3-sen-3',
      projectId: 'torre-titanium',
      code: 'DET-SMK-03',
      type: 'detector-autonomo',
      name: 'Sensor Fotoeléctrico de Detección Temprana SLC',
      model: 'Notifier FSP-951',
      zone: 'Piso 3 — Oficinas Corporativas',
      status: 'installed',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 320000,
      installedAt: '2026-03-22T11:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Interconectado en lazo SLC hacia el panel central.',
    },
    {
      id: 'tt-p3-aut-1',
      projectId: 'torre-titanium',
      code: 'TT-P3-AUT-01',
      type: 'detector-autonomo',
      name: 'Detector Autónomo con Batería de Respaldo 10 Años',
      model: 'First Alert Pro Lithium 10Y Standalone',
      zone: 'Piso 3 — Oficinas Corporativas',
      status: 'installed',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 195000,
      installedAt: '2026-03-22T14:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Equipo autónomo independiente a batería. No requiere tubería ni cable exterior.',
    },
    {
      id: 'tt-p3-pal-1',
      projectId: 'torre-titanium',
      code: 'TT-P3-PAL-01',
      type: 'palanca',
      name: 'Estación Manual de Alarma Doble Acción (Acceso Principal)',
      model: 'Notifier NBG-12LX',
      zone: 'Piso 3 — Oficinas Corporativas',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installedAt: '2026-03-22T15:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Conectada a lazo SLC por tubería Conduit EMT 3/4".',
    },
    {
      id: 'tt-p3-pal-2',
      projectId: 'torre-titanium',
      code: 'TT-P3-PAL-02',
      type: 'palanca',
      name: 'Estación Manual de Alarma Doble Acción (Escalera Emergencia)',
      model: 'Notifier NBG-12LX',
      zone: 'Piso 3 — Oficinas Corporativas',
      status: 'installed',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installedAt: '2026-03-22T16:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Conectada a lazo SLC por tubería Conduit EMT 3/4".',
    },
    {
      id: 'tt-item-5',
      projectId: 'torre-titanium',
      code: 'SIR-STR-01',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Sincronizada 24V (Sector A)',
      model: 'System Sensor SpectrAlert Advance P2R',
      zone: 'Piso 3 — Oficinas Corporativas',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 245000,
      installedAt: '2026-03-22T17:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Alimentación por circuito NAC Conduit EMT.',
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
      notes: 'Pendiente suministro de candelas seleccionables. Alimentación por circuito NAC Conduit EMT.',
    },
  ],
  'estadio-metropolitano': [
    // Sistema Central FACP
    {
      id: 'em-item-facp',
      projectId: 'estadio-metropolitano',
      code: 'EST-FACP-01',
      type: 'facp',
      name: 'Panel Principal de Alarma & Control Central FACP',
      model: 'Notifier NFS2-3030 con Red Noti-Fire-Net',
      zone: 'Zona 1 — Gradería Occidental & Prensa',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 34500000,
      installedAt: '2026-03-12T10:00:00Z',
      installerTeam: 'Cuadrilla Especializada Redes A',
      notes: 'Sistema Central FACP. Todos los lazos direccionables y circuitos NAC convergen aquí bajo NFPA 72.',
    },
    // ZONA 1: Gradería Occidental & Prensa
    {
      id: 'em-z1-tub',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z1-TUB-01',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 1" Tramo Principal Zona 1',
      model: 'Conduit EMT 1 pulg Heavy Duty C-80',
      zone: 'Zona 1 — Gradería Occidental & Prensa',
      status: 'inspected',
      quantity: 380,
      unit: 'Metros Lineales',
      unitPrice: 46000,
      installedAt: '2026-03-18T14:00:00Z',
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: 'Tubería troncal perimetral instalada con abrazaderas antisísmicas y uniones herméticas a intemperie.',
    },
    {
      id: 'em-z1-cab',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z1-CAB-01',
      type: 'cableado',
      name: 'Cable FPLR 2x14 AWG Lazo SLC Dirección FACP Zona 1',
      model: 'Honeywell Genesis UV-Resistant FPLR',
      zone: 'Zona 1 — Gradería Occidental & Prensa',
      status: 'inspected',
      quantity: 750,
      unit: 'Metros',
      unitPrice: 14500,
      installedAt: '2026-03-20T11:00:00Z',
      installerTeam: 'Cuadrilla Cableado C',
      notes: 'Lazo SLC Clase A tendido dentro de la tubería Conduit EMT 1" con certificación 100% conforme hacia FACP.',
    },
    {
      id: 'em-z1-sen-1',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z1-SEN-01',
      type: 'detector-autonomo',
      name: 'Sensor Óptico de Humo Direccionable Inteligente',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Zona 1 — Gradería Occidental & Prensa',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installedAt: '2026-03-22T09:30:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Sensor 1 de 3 interconectados en lazo SLC. Canalizado por Tubería Conduit EMT 1" hacia FACP.',
    },
    {
      id: 'em-z1-sen-2',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z1-SEN-02',
      type: 'detector-autonomo',
      name: 'Sensor Térmico de Temperatura Direccionable SLC',
      model: 'Notifier FST-951 Sensor Térmico 57°C',
      zone: 'Zona 1 — Gradería Occidental & Prensa',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 345000,
      installedAt: '2026-03-22T10:30:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Sensor 2 de 3 interconectados en lazo SLC. Canalizado por Tubería Conduit EMT 1" hacia FACP.',
    },
    {
      id: 'em-z1-sen-3',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z1-SEN-03',
      type: 'detector-autonomo',
      name: 'Sensor de Humo Haz Proyectado Beam SLC',
      model: 'System Sensor BEAM1224 (Alcance 100m)',
      zone: 'Zona 1 — Gradería Occidental & Prensa',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 3850000,
      installedAt: '2026-03-22T11:30:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Sensor 3 de 3 interconectados en lazo SLC. Alineado a 12m de elevación y canalizado por Conduit EMT 1".',
    },
    {
      id: 'em-z1-aut-1',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z1-AUT-01',
      type: 'detector-autonomo',
      name: 'Detector Autónomo con Batería de Respaldo 10 Años',
      model: 'First Alert Pro Lithium 10Y Standalone',
      zone: 'Zona 1 — Gradería Occidental & Prensa',
      status: 'installed',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 215000,
      installedAt: '2026-03-23T14:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Equipo autónomo a batería interna de litio. Operación independiente, no requiere canalización de tubería ni cable exterior.',
    },
    {
      id: 'em-z1-pal-1',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z1-PAL-01',
      type: 'palanca',
      name: 'Estación Manual de Alarma Doble Acción (Acceso Prensa)',
      model: 'Notifier NBG-12LX con Cubierta Weatherproof',
      zone: 'Zona 1 — Gradería Occidental & Prensa',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installedAt: '2026-03-25T14:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Estación 1 de 2. Conectada rígidamente con tubería Conduit EMT 3/4" y lazo SLC hacia el sistema central.',
    },
    {
      id: 'em-z1-pal-2',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z1-PAL-02',
      type: 'palanca',
      name: 'Estación Manual de Alarma Doble Acción (Evacuación Gradería)',
      model: 'Notifier NBG-12LX con Cubierta Weatherproof',
      zone: 'Zona 1 — Gradería Occidental & Prensa',
      status: 'installed',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installedAt: '2026-03-25T16:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Estación 2 de 2. Conectada rígidamente con tubería Conduit EMT 3/4" y lazo SLC hacia el sistema central.',
    },
    {
      id: 'em-z1-sir-1',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z1-SIR-01',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Intemperie 110dB (Sector A)',
      model: 'System Sensor P2RH-K Intemperie NEMA 4X',
      zone: 'Zona 1 — Gradería Occidental & Prensa',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 310000,
      installedAt: '2026-03-26T10:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Sirena 1 de 2. Conectada por tubería Conduit EMT 3/4" y circuito NAC hacia el sistema central FACP.',
    },
    {
      id: 'em-z1-sir-2',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z1-SIR-02',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Intemperie 110dB (Sector B)',
      model: 'System Sensor P2RH-K Intemperie NEMA 4X',
      zone: 'Zona 1 — Gradería Occidental & Prensa',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 310000,
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Sirena 2 de 2. Conectada por tubería Conduit EMT 3/4" y circuito NAC hacia el sistema central FACP.',
    },

    // ZONA 2: Gradería Oriental & Accesos
    {
      id: 'em-z2-tub',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z2-TUB-01',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 1" Tramo Principal Zona 2',
      model: 'Conduit EMT 1 pulg Heavy Duty C-80',
      zone: 'Zona 2 — Gradería Oriental & Accesos',
      status: 'inspected',
      quantity: 360,
      unit: 'Metros Lineales',
      unitPrice: 46000,
      installedAt: '2026-03-18T16:00:00Z',
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: 'Tubería troncal perimetral instalada con abrazaderas antisísmicas hacia Sistema Central FACP.',
    },
    {
      id: 'em-z2-cab',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z2-CAB-01',
      type: 'cableado',
      name: 'Cable FPLR 2x14 AWG Lazo SLC Dirección FACP Zona 2',
      model: 'Honeywell Genesis UV-Resistant FPLR',
      zone: 'Zona 2 — Gradería Oriental & Accesos',
      status: 'inspected',
      quantity: 720,
      unit: 'Metros',
      unitPrice: 14500,
      installedAt: '2026-03-20T15:00:00Z',
      installerTeam: 'Cuadrilla Cableado C',
      notes: 'Lazo SLC Clase A tendido dentro de la tubería Conduit EMT 1" hacia el FACP central.',
    },
    {
      id: 'em-z2-sen-1',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z2-SEN-01',
      type: 'detector-autonomo',
      name: 'Sensor Óptico de Humo Direccionable Inteligente',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Zona 2 — Gradería Oriental & Accesos',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installedAt: '2026-03-22T14:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Sensor 1 de 3 interconectados en lazo SLC. Canalizado por Tubería Conduit EMT 1" hacia FACP.',
    },
    {
      id: 'em-z2-sen-2',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z2-SEN-02',
      type: 'detector-autonomo',
      name: 'Sensor Térmico de Temperatura Direccionable SLC',
      model: 'Notifier FST-951 Sensor Térmico 57°C',
      zone: 'Zona 2 — Gradería Oriental & Accesos',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 345000,
      installedAt: '2026-03-22T15:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Sensor 2 de 3 interconectados en lazo SLC. Canalizado por Tubería Conduit EMT 1" hacia FACP.',
    },
    {
      id: 'em-z2-sen-3',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z2-SEN-03',
      type: 'detector-autonomo',
      name: 'Sensor Fotoeléctrico de Detección Temprana SLC',
      model: 'Notifier FSP-951',
      zone: 'Zona 2 — Gradería Oriental & Accesos',
      status: 'installed',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installedAt: '2026-03-22T16:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Sensor 3 de 3 interconectados en lazo SLC. Conexión por tubería Conduit EMT 1".',
    },
    {
      id: 'em-z2-aut-1',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z2-AUT-01',
      type: 'detector-autonomo',
      name: 'Detector Autónomo con Batería de Respaldo 10 Años',
      model: 'First Alert Pro Lithium 10Y Standalone',
      zone: 'Zona 2 — Gradería Oriental & Accesos',
      status: 'installed',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 215000,
      installedAt: '2026-03-23T15:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Equipo autónomo a batería interna de litio. Operación independiente, no requiere canalización ni cable exterior.',
    },
    {
      id: 'em-z2-pal-1',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z2-PAL-01',
      type: 'palanca',
      name: 'Estación Manual de Alarma Doble Acción (Acceso Oriental)',
      model: 'Notifier NBG-12LX con Cubierta Weatherproof',
      zone: 'Zona 2 — Gradería Oriental & Accesos',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installedAt: '2026-03-25T10:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Estación 1 de 2. Conectada por tubería Conduit EMT 3/4" y lazo SLC hacia el sistema central.',
    },
    {
      id: 'em-z2-pal-2',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z2-PAL-02',
      type: 'palanca',
      name: 'Estación Manual de Alarma Doble Acción (Salida Oriental)',
      model: 'Notifier NBG-12LX con Cubierta Weatherproof',
      zone: 'Zona 2 — Gradería Oriental & Accesos',
      status: 'installed',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installedAt: '2026-03-25T11:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Estación 2 de 2. Conectada por tubería Conduit EMT 3/4" y lazo SLC hacia el sistema central.',
    },
    {
      id: 'em-z2-sir-1',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z2-SIR-01',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Intemperie 110dB (Sector A)',
      model: 'System Sensor P2RH-K Intemperie NEMA 4X',
      zone: 'Zona 2 — Gradería Oriental & Accesos',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 310000,
      installedAt: '2026-03-26T11:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Sirena 1 de 2. Conectada por tubería Conduit EMT 3/4" y circuito NAC hacia el sistema central FACP.',
    },
    {
      id: 'em-z2-sir-2',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z2-SIR-02',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Intemperie 110dB (Sector B)',
      model: 'System Sensor P2RH-K Intemperie NEMA 4X',
      zone: 'Zona 2 — Gradería Oriental & Accesos',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 310000,
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Sirena 2 de 2. Conectada por tubería Conduit EMT 3/4" y circuito NAC hacia el sistema central FACP.',
    },

    // ZONA 3: Gradería Norte
    {
      id: 'em-z3-tub',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z3-TUB-01',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 1" Tramo Principal Zona 3',
      model: 'Conduit EMT 1 pulg Heavy Duty C-80',
      zone: 'Zona 3 — Gradería Norte',
      status: 'inspected',
      quantity: 240,
      unit: 'Metros Lineales',
      unitPrice: 46000,
      installedAt: '2026-03-18T17:00:00Z',
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: 'Tubería troncal conectada hacia Sistema Central FACP.',
    },
    {
      id: 'em-z3-cab',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z3-CAB-01',
      type: 'cableado',
      name: 'Cable FPLR 2x14 AWG Lazo SLC Dirección FACP Zona 3',
      model: 'Honeywell Genesis UV-Resistant FPLR',
      zone: 'Zona 3 — Gradería Norte',
      status: 'inspected',
      quantity: 480,
      unit: 'Metros',
      unitPrice: 14500,
      installedAt: '2026-03-20T17:00:00Z',
      installerTeam: 'Cuadrilla Cableado C',
      notes: 'Lazo SLC Clase A tendido dentro de la tubería Conduit EMT 1" hacia FACP.',
    },
    {
      id: 'em-z3-sen-1',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z3-SEN-01',
      type: 'detector-autonomo',
      name: 'Sensor Óptico de Humo Direccionable Inteligente',
      model: 'Notifier FSP-951',
      zone: 'Zona 3 — Gradería Norte',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installedAt: '2026-03-22T17:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Sensor 1 de 3 interconectados en lazo SLC. Canalizado por Tubería Conduit EMT 1" hacia FACP.',
    },
    {
      id: 'em-z3-sen-2',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z3-SEN-02',
      type: 'detector-autonomo',
      name: 'Sensor Térmico de Temperatura Direccionable SLC',
      model: 'Notifier FST-951',
      zone: 'Zona 3 — Gradería Norte',
      status: 'installed',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 345000,
      installedAt: '2026-03-22T17:30:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Sensor 2 de 3 interconectados en lazo SLC. Canalizado por Tubería Conduit EMT 1" hacia FACP.',
    },
    {
      id: 'em-z3-sen-3',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z3-SEN-03',
      type: 'detector-autonomo',
      name: 'Sensor Fotoeléctrico de Detección Temprana SLC',
      model: 'Notifier FSP-951',
      zone: 'Zona 3 — Gradería Norte',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 385000,
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Sensor 3 de 3 interconectados en lazo SLC. Conexión por tubería Conduit EMT 1".',
    },
    {
      id: 'em-z3-aut-1',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z3-AUT-01',
      type: 'detector-autonomo',
      name: 'Detector Autónomo con Batería de Respaldo 10 Años',
      model: 'First Alert Pro Lithium 10Y Standalone',
      zone: 'Zona 3 — Gradería Norte',
      status: 'installed',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 215000,
      installedAt: '2026-03-23T16:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Equipo autónomo a batería interna de litio. Operación independiente, no requiere canalización ni cable exterior.',
    },
    {
      id: 'em-z3-pal-1',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z3-PAL-01',
      type: 'palanca',
      name: 'Estación Manual de Alarma Doble Acción (Acceso Norte)',
      model: 'Notifier NBG-12LX con Cubierta Weatherproof',
      zone: 'Zona 3 — Gradería Norte',
      status: 'inspected',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installedAt: '2026-03-25T12:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Estación 1 de 2. Conectada por tubería Conduit EMT 3/4" y lazo SLC hacia el sistema central.',
    },
    {
      id: 'em-z3-pal-2',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z3-PAL-02',
      type: 'palanca',
      name: 'Estación Manual de Alarma Doble Acción (Evacuación Norte)',
      model: 'Notifier NBG-12LX con Cubierta Weatherproof',
      zone: 'Zona 3 — Gradería Norte',
      status: 'installed',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installedAt: '2026-03-25T13:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Estación 2 de 2. Conectada por tubería Conduit EMT 3/4" y lazo SLC hacia el sistema central.',
    },
    {
      id: 'em-z3-sir-1',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z3-SIR-01',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Intemperie 110dB (Sector A)',
      model: 'System Sensor P2RH-K Intemperie NEMA 4X',
      zone: 'Zona 3 — Gradería Norte',
      status: 'installed',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 310000,
      installedAt: '2026-03-26T12:00:00Z',
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Sirena 1 de 2. Conectada por tubería Conduit EMT 3/4" y circuito NAC hacia el sistema central FACP.',
    },
    {
      id: 'em-z3-sir-2',
      projectId: 'estadio-metropolitano',
      code: 'EST-Z3-SIR-02',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Intemperie 110dB (Sector B)',
      model: 'System Sensor P2RH-K Intemperie NEMA 4X',
      zone: 'Zona 3 — Gradería Norte',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 310000,
      installerTeam: 'Cuadrilla Detección A',
      notes: 'Sirena 2 de 2. Conectada por tubería Conduit EMT 3/4" y circuito NAC hacia el sistema central FACP.',
    },

    // ZONA 6: Bombas y Subestación
    {
      id: 'em-item-tub-bombas',
      projectId: 'estadio-metropolitano',
      code: 'EST-TUB-02',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Ramal Bombas & Subestación',
      model: 'Conduit EMT 3/4 pulg Colmena Heavy Duty',
      zone: 'Zona 6 — Cuarto Bombas & Subestación',
      status: 'inspected',
      quantity: 180,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installedAt: '2026-03-14T08:00:00Z',
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: 'Acometida desde cuarto de bombas hasta subestación con cajas condulet tipo LB y T.',
    },
    {
      id: 'em-item-bom-1',
      projectId: 'estadio-metropolitano',
      code: 'EST-BOM-01',
      type: 'cuadro-bomba',
      name: 'Módulo de Monitoreo Tablero Bomba Principal RCI',
      model: 'Notifier FMM-1 Módulo de Entrada',
      zone: 'Zona 6 — Cuarto Bombas & Subestación',
      status: 'inspected',
      quantity: 2,
      unit: 'Unidad',
      unitPrice: 1850000,
      installedAt: '2026-03-15T10:00:00Z',
      installerTeam: 'Cuadrilla Especializada Redes A',
      notes: 'Supervisión de presión hidroneumática y bombas contra incendio enlazadas al FACP.',
    },
  ],
};

const STORAGE_KEY_PROJECTS = 'gsit_projects';
const STORAGE_KEY_FLOORS = 'gsit_floors';
const STORAGE_KEY_ITEMS = 'gsit_items';

export function getProjects(): Project[] {
  if (typeof window === 'undefined') return DEFAULT_PROJECTS;
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
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_FLOORS}_${projectId}`);
    if (!raw) {
      const defaults = DEFAULT_FLOORS[projectId] || [];
      if (defaults.length > 0) {
        localStorage.setItem(`${STORAGE_KEY_FLOORS}_${projectId}`, JSON.stringify(defaults));
      }
      return defaults;
    }
    return JSON.parse(raw) as FloorZone[];
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
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_ITEMS}_${projectId}`);
    if (!raw) {
      const defaults = DEFAULT_ITEMS[projectId] || [];
      localStorage.setItem(`${STORAGE_KEY_ITEMS}_${projectId}`, JSON.stringify(defaults));
      return defaults;
    }
    const parsed = JSON.parse(raw) as FloorItem[];
    // Migración automática si la caché contenía los datos preliminares antiguos
    if (projectId === 'estadio-metropolitano' && !parsed.some((i) => i.code === 'EST-Z1-SEN-01')) {
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
  notes?: string
): void {
  if (typeof window !== 'undefined' && !isAuthenticated()) {
    return;
  }
  const items = getProjectItems(projectId);
  const target = items.find((i) => i.id === itemId);
  if (target) {
    target.status = status;
    if (notes) target.notes = notes;
    if (status === 'installed' || status === 'inspected') {
      target.installedAt = new Date().toISOString();
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
