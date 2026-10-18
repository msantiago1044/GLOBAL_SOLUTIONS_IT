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
  'estadio-metropolitano': [
    // =========================================================================
    // NIVEL DE CANCHA (-3.80 m) — Plancha SDI A100 (Cota -3.80m)
    // =========================================================================
    {
      id: 'em-can-tub-01',
      projectId: 'estadio-metropolitano',
      code: 'TUB-CAN-01',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Anillo Cárcamo Suroccidental (Eje 1 a 6)',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 85,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-can-cab-01',
      projectId: 'estadio-metropolitano',
      code: 'CAB-CAN-01',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Tramo CAN-01',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 90,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-can-tub-02',
      projectId: 'estadio-metropolitano',
      code: 'TUB-CAN-02',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Ramal Cafetería VIP, Bodega & Shafte Técnico',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 54,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-can-cab-02',
      projectId: 'estadio-metropolitano',
      code: 'CAB-CAN-02',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Tramo CAN-02',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 57,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-can-tub-03',
      projectId: 'estadio-metropolitano',
      code: 'TUB-CAN-03',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Ramal Tanque Subterráneo & Servicios',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 42,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-can-cab-03',
      projectId: 'estadio-metropolitano',
      code: 'CAB-CAN-03',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Tramo CAN-03',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 45,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-can-tub-04',
      projectId: 'estadio-metropolitano',
      code: 'TUB-CAN-04',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Alimentación Boca Túnel Acceso Sur',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 65,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-can-cab-04',
      projectId: 'estadio-metropolitano',
      code: 'CAB-CAN-04',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Tramo CAN-04',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 68,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-can-tub-05',
      projectId: 'estadio-metropolitano',
      code: 'TUB-CAN-05',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Anillo Cárcamo Noroccidental (Eje 6 a 11)',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 90,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-can-cab-05',
      projectId: 'estadio-metropolitano',
      code: 'CAB-CAN-05',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Tramo CAN-05',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 95,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-can-tub-06',
      projectId: 'estadio-metropolitano',
      code: 'TUB-CAN-06',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Alimentación Boca Túnel Acceso Norte',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 65,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-can-cab-06',
      projectId: 'estadio-metropolitano',
      code: 'CAB-CAN-06',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Tramo CAN-06',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 68,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-can-tub-07',
      projectId: 'estadio-metropolitano',
      code: 'TUB-CAN-07',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Anillo Cárcamo Nororiental (Eje 11 a 16)',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 88,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-can-cab-07',
      projectId: 'estadio-metropolitano',
      code: 'CAB-CAN-07',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Tramo CAN-07',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 92,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-can-tub-08',
      projectId: 'estadio-metropolitano',
      code: 'TUB-CAN-08',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Anillo Cárcamo Suroriental (Eje 16 a 21)',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 92,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-can-cab-08',
      projectId: 'estadio-metropolitano',
      code: 'CAB-CAN-08',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Tramo CAN-08',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 96,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-can-tub-09',
      projectId: 'estadio-metropolitano',
      code: 'TUB-CAN-09',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 1" Riser Pasante Vertical Cancha ➔ Nivel 1',
      model: 'Conduit EMT 1 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 25,
      unit: 'Metros Lineales',
      unitPrice: 48500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-can-cab-09',
      projectId: 'estadio-metropolitano',
      code: 'CAB-CAN-09',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Riser Troncal Cancha ➔ Nivel 1',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 28,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-can-sen-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-CAN-SEN-01',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Boca Túnel Acceso Sur',
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
      id: 'em-can-sen-02',
      projectId: 'estadio-metropolitano',
      code: 'EST-CAN-SEN-02',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Boca Túnel Acceso Norte',
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
      id: 'em-can-sen-06',
      projectId: 'estadio-metropolitano',
      code: 'EST-CAN-SEN-06',
      type: 'detector-autonomo',
      name: 'Detectores de Humo Ópticos (S) — Lote Cárcamo y Servicios Cancha',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 65,
      unit: 'Unidad',
      unitPrice: 385000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-can-pal-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-CAN-PAL-01',
      type: 'palanca',
      name: 'Estación Manual Doble Acción (F) — Boca Túnel Acceso Sur',
      model: 'Notifier NBG-12LX con Cubierta Weatherproof',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-can-pal-02',
      projectId: 'estadio-metropolitano',
      code: 'EST-CAN-PAL-02',
      type: 'palanca',
      name: 'Estación Manual Doble Acción (F) — Boca Túnel Acceso Norte',
      model: 'Notifier NBG-12LX con Cubierta Weatherproof',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 420000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-can-pal-03',
      projectId: 'estadio-metropolitano',
      code: 'EST-CAN-PAL-03',
      type: 'palanca',
      name: 'Estaciones Manuales Doble Acción (F) — Puntos de Salida y Túneles',
      model: 'Notifier NBG-12LX con Cubierta Weatherproof',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 6,
      unit: 'Unidad',
      unitPrice: 420000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-can-ar-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-CAN-AR-01',
      type: 'facp',
      name: 'Anunciador Remoto LCD Notifier (AR) — Puesto Mando Cancha',
      model: 'Notifier LCD-80 Anunciador 80 Caracteres',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 2850000,
      installerTeam: 'Cuadrilla Especializada Redes A',
      notes: '',
    },
    {
      id: 'em-can-sir-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-CAN-SIR-01',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Intemperie (⚡) — Túnel Sur',
      model: 'System Sensor SpectrAlert Advance P2RH-K',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 245000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-can-sir-02',
      projectId: 'estadio-metropolitano',
      code: 'EST-CAN-SIR-02',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica Intemperie (⚡) — Túnel Norte',
      model: 'System Sensor SpectrAlert Advance P2RH-K',
      zone: 'Nivel de Cancha (-3.80 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 245000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },

    // =========================================================================
    // NIVEL 1 (+42.08 m) — Plancha SDI A101 (Cota +42.08m)
    // =========================================================================
    {
      id: 'em-n1-tub-01',
      projectId: 'estadio-metropolitano',
      code: 'TUB-N1-01',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 1" Riser Principal FACP-02 ➔ Cuarto de Control Occidental',
      model: 'Conduit EMT 1 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 55,
      unit: 'Metros Lineales',
      unitPrice: 48500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-n1-cab-01',
      projectId: 'estadio-metropolitano',
      code: 'CAB-N1-01',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Riser Principal Tramo N1-01',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 58,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-n1-tub-02',
      projectId: 'estadio-metropolitano',
      code: 'TUB-N1-02',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 1" Troncal Interconexión FACP-02 ➔ FACP-03 Subestación',
      model: 'Conduit EMT 1 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 180,
      unit: 'Metros Lineales',
      unitPrice: 48500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-n1-cab-02',
      projectId: 'estadio-metropolitano',
      code: 'CAB-N1-02',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Red Noti-Fire-Net FACP-02 a FACP-03',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 190,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-n1-tub-03',
      projectId: 'estadio-metropolitano',
      code: 'TUB-N1-03',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Anillo Camerino Colombia & Camerino Junior',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 125,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-n1-cab-03',
      projectId: 'estadio-metropolitano',
      code: 'CAB-N1-03',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Camerinos Tramo N1-03',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 132,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-n1-tub-04',
      projectId: 'estadio-metropolitano',
      code: 'TUB-N1-04',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Ramal Camerinos Visitantes 1 y 2',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 85,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-n1-cab-04',
      projectId: 'estadio-metropolitano',
      code: 'CAB-N1-04',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Tramo N1-04',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 90,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-n1-tub-05',
      projectId: 'estadio-metropolitano',
      code: 'TUB-N1-05',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Ramal Sala de Prensa & Médica Antidopaje',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 95,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-n1-cab-05',
      projectId: 'estadio-metropolitano',
      code: 'CAB-N1-05',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Prensa y Médica Tramo N1-05',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 100,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-n1-tub-06',
      projectId: 'estadio-metropolitano',
      code: 'TUB-N1-06',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Anillo Oriental Ligas Deportivas (Boxeo & Gimnasia)',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 210,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-n1-cab-06',
      projectId: 'estadio-metropolitano',
      code: 'CAB-N1-06',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Ligas Deportivas Tramo N1-06',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 220,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-n1-tub-07',
      projectId: 'estadio-metropolitano',
      code: 'TUB-N1-07',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Ramal Corredores Circulación & Taquillas Occ/Ori',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 145,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-n1-cab-07',
      projectId: 'estadio-metropolitano',
      code: 'CAB-N1-07',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Taquillas Tramo N1-07',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 152,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-n1-tub-08',
      projectId: 'estadio-metropolitano',
      code: 'TUB-N1-08',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Alimentación Anunciadores Remotos LCD (AR-01 a AR-03)',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 110,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-n1-cab-08',
      projectId: 'estadio-metropolitano',
      code: 'CAB-N1-08',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Red RS-485 Anunciadores LCD Nivel 1',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 116,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-n1-facp-02',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-FACP-02',
      type: 'facp',
      name: 'Panel Principal de Incendio Notifier NFS2-3030 (FACP-02)',
      model: 'Notifier NFS2-3030 Panel Direccionable 10 Lazos',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 24500000,
      installerTeam: 'Cuadrilla Especializada Redes A',
      notes: '',
    },
    {
      id: 'em-n1-facp-03',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-FACP-03',
      type: 'facp',
      name: 'Panel Secundario de Incendio Notifier NFS2-640 (FACP-03 Subestación)',
      model: 'Notifier NFS2-640 Panel Direccionable 2 Lazos',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 14200000,
      installerTeam: 'Cuadrilla Especializada Redes A',
      notes: '',
    },
    {
      id: 'em-n1-ar-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-AR-01',
      type: 'facp',
      name: 'Anunciador Remoto LCD Notifier (AR) — Taquillas Occidentales',
      model: 'Notifier LCD-80 Anunciador 80 Caracteres',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 2850000,
      installerTeam: 'Cuadrilla Especializada Redes A',
      notes: '',
    },
    {
      id: 'em-n1-ar-02',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-AR-02',
      type: 'facp',
      name: 'Anunciador Remoto LCD Notifier (AR) — Acceso Prensa Occidental',
      model: 'Notifier LCD-80 Anunciador 80 Caracteres',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 2850000,
      installerTeam: 'Cuadrilla Especializada Redes A',
      notes: '',
    },
    {
      id: 'em-n1-ar-03',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-AR-03',
      type: 'facp',
      name: 'Anunciador Remoto LCD Notifier (AR) — Taquillas Orientales',
      model: 'Notifier LCD-80 Anunciador 80 Caracteres',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 2850000,
      installerTeam: 'Cuadrilla Especializada Redes A',
      notes: '',
    },
    {
      id: 'em-n1-sen-01',
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
      id: 'em-n1-sen-02',
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
      id: 'em-n1-sen-03',
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
      id: 'em-n1-sen-04',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-SEN-PREN',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Sala de Prensa 252m²',
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
      id: 'em-n1-sen-05',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-SEN-MED',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Sala Médica & Control Antidopaje',
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
      id: 'em-n1-sen-06',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-SEN-BOX',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Liga de Boxeo del Atlántico 705m²',
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
      id: 'em-n1-sen-07',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-SEN-GIM',
      type: 'detector-autonomo',
      name: 'Detector Óptico de Humo (S) — Liga de Gimnasia del Atlántico',
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
      id: 'em-n1-sen-08',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-SEN-ALL',
      type: 'detector-autonomo',
      name: 'Detectores de Humo Ópticos (S) — Lote Corredores y Servicios Nivel 1',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 352,
      unit: 'Unidad',
      unitPrice: 385000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n1-sen-t01',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-SEN-T01',
      type: 'detector-autonomo',
      name: 'Detectores Térmicos de Temperatura Fija (H) — Subestaciones y Generadores',
      model: 'Notifier FST-951 Térmico Fijo 57°C',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 10,
      unit: 'Unidad',
      unitPrice: 395000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n1-sen-co1',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-SEN-CO1',
      type: 'detector-doble',
      name: 'Detectores de Monóxido de Carbono (CO) — Planta Eléctrica y Subestación',
      model: 'Notifier FCO-951 Detector Direccionable CO',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 2,
      unit: 'Unidad',
      unitPrice: 480000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
    {
      id: 'em-n1-pal-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-N1-PAL-01',
      type: 'palanca',
      name: 'Estación Manual Doble Acción (F) — Acceso Principal Occidental',
      model: 'Notifier NBG-12LX con Cubierta Weatherproof',
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
      name: 'Estaciones Manuales Doble Acción (F) — Lote Corredores y Salidas Nivel 1',
      model: 'Notifier NBG-12LX con Cubierta Weatherproof',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 29,
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
      name: 'Sirenas con Luz Estroboscópica 24V — Sector Camerinos y Prensa',
      model: 'System Sensor SpectrAlert Advance P2R',
      zone: 'Nivel 1 (+42.08 m)',
      status: 'pending',
      quantity: 4,
      unit: 'Unidad',
      unitPrice: 245000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },

    // =========================================================================
    // MEZANINE (+45.57 m) — Plancha SDI A102 (Cota +45.57m)
    // =========================================================================
    {
      id: 'em-mez-tub-01',
      projectId: 'estadio-metropolitano',
      code: 'TUB-MEZ-01',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Anillo Palcos VIP Occidentales',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Mezanine (+45.57 m)',
      status: 'pending',
      quantity: 110,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-mez-cab-01',
      projectId: 'estadio-metropolitano',
      code: 'CAB-MEZ-01',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Palcos VIP',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Mezanine (+45.57 m)',
      status: 'pending',
      quantity: 115,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-mez-tub-02',
      projectId: 'estadio-metropolitano',
      code: 'TUB-MEZ-02',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Ramal Salón Presidencial & Sala de Juntas VIP',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Mezanine (+45.57 m)',
      status: 'pending',
      quantity: 75,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-mez-cab-02',
      projectId: 'estadio-metropolitano',
      code: 'CAB-MEZ-02',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Salón Presidencial',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Mezanine (+45.57 m)',
      status: 'pending',
      quantity: 80,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-mez-tub-03',
      projectId: 'estadio-metropolitano',
      code: 'TUB-MEZ-03',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Ramal Museo de la Selección & Jefatura de Escenarios',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Mezanine (+45.57 m)',
      status: 'pending',
      quantity: 90,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-mez-cab-03',
      projectId: 'estadio-metropolitano',
      code: 'CAB-MEZ-03',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Museo de la Selección',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Mezanine (+45.57 m)',
      status: 'pending',
      quantity: 95,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-mez-tub-04',
      projectId: 'estadio-metropolitano',
      code: 'TUB-MEZ-04',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Acometida Módulo Relevo Control Audio/AC (CR)',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Mezanine (+45.57 m)',
      status: 'pending',
      quantity: 35,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-mez-cab-04',
      projectId: 'estadio-metropolitano',
      code: 'CAB-MEZ-04',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Control Relevo Audio y AC',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Mezanine (+45.57 m)',
      status: 'pending',
      quantity: 38,
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
      name: 'Detector Óptico de Humo (S) — Área VIP Central 518m²',
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
      name: 'Detector Óptico de Humo (S) — Museo Selección Colombia',
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
      code: 'EST-MEZ-SEN-ALL',
      type: 'detector-autonomo',
      name: 'Detectores de Humo Ópticos (S) — Lote Palcos y Salones VIP Mezanine',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Mezanine (+45.57 m)',
      status: 'pending',
      quantity: 60,
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
      name: 'Estaciones Manuales Doble Acción (F) — Salidas y Escaleras Mezanine',
      model: 'Notifier NBG-12LX con Cubierta Weatherproof',
      zone: 'Mezanine (+45.57 m)',
      status: 'pending',
      quantity: 7,
      unit: 'Unidad',
      unitPrice: 420000,
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
      notes: '',
    },
    {
      id: 'em-mez-sir-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-MEZ-SIR-01',
      type: 'sirena',
      name: 'Sirena con Luz Estroboscópica 24V — Salón VIP Mezanine',
      model: 'System Sensor SpectrAlert Advance P2R',
      zone: 'Mezanine (+45.57 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 245000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },

    // =========================================================================
    // NIVEL 3 (+52.45 m) — Plancha SDI A104 (Cota +52.45m Corona Alta)
    // =========================================================================
    {
      id: 'em-n3-tub-01',
      projectId: 'estadio-metropolitano',
      code: 'TUB-N3-01',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Corona Alta Occidental (Cabinas Radio y Prensa Alta)',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel 3 (+52.45 m)',
      status: 'pending',
      quantity: 145,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-n3-cab-01',
      projectId: 'estadio-metropolitano',
      code: 'CAB-N3-01',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Corona Alta Occidental',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Nivel 3 (+52.45 m)',
      status: 'pending',
      quantity: 152,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-n3-tub-02',
      projectId: 'estadio-metropolitano',
      code: 'TUB-N3-02',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Corona Alta Oriental (Gradería Alta Oriental)',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel 3 (+52.45 m)',
      status: 'pending',
      quantity: 155,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-n3-cab-02',
      projectId: 'estadio-metropolitano',
      code: 'CAB-N3-02',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Corona Alta Oriental',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Nivel 3 (+52.45 m)',
      status: 'pending',
      quantity: 162,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-n3-tub-03',
      projectId: 'estadio-metropolitano',
      code: 'TUB-N3-03',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Alimentación Caracolas 1 y 2 (Evacuación Norte)',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel 3 (+52.45 m)',
      status: 'pending',
      quantity: 90,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-n3-cab-03',
      projectId: 'estadio-metropolitano',
      code: 'CAB-N3-03',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Caracolas Norte',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Nivel 3 (+52.45 m)',
      status: 'pending',
      quantity: 95,
      unit: 'Metros',
      unitPrice: 14500,
      installerTeam: 'Cuadrilla Cableado C',
      notes: '',
    },
    {
      id: 'em-n3-tub-04',
      projectId: 'estadio-metropolitano',
      code: 'TUB-N3-04',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Alimentación Caracolas 3 y 4 (Evacuación Sur)',
      model: 'Conduit EMT 3/4 pulg Heavy Duty C-80 Galvanizada',
      zone: 'Nivel 3 (+52.45 m)',
      status: 'pending',
      quantity: 90,
      unit: 'Metros Lineales',
      unitPrice: 38500,
      installerTeam: 'Cuadrilla Tubería Caribe',
      notes: '',
    },
    {
      id: 'em-n3-cab-04',
      projectId: 'estadio-metropolitano',
      code: 'CAB-N3-04',
      type: 'cableado',
      name: 'Cable FPLR Blindado 2x14 AWG Lazo SLC Caracolas Sur',
      model: 'Honeywell Genesis UV-Resistant FPLR 300V',
      zone: 'Nivel 3 (+52.45 m)',
      status: 'pending',
      quantity: 95,
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
      name: 'Detector Óptico de Humo (S) — Baños Corona Occidental',
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
      name: 'Detector Óptico de Humo (S) — Cabinas de Prensa Alta 80m²',
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
      name: 'Detector Óptico de Humo (S) — Puntos Fijos Occidentales',
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
      code: 'EST-N3-SEN-ALL',
      type: 'detector-autonomo',
      name: 'Detectores de Humo Ópticos (S) — Lote Corona Alta y Pasillos Nivel 3',
      model: 'Notifier FSP-951 con Base B300-6',
      zone: 'Nivel 3 (+52.45 m)',
      status: 'pending',
      quantity: 55,
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
      name: 'Estación Manual Doble Acción (F) — Caracola 1 Nororiental',
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
      name: 'Estación Manual Doble Acción (F) — Caracola 2 Noroccidental',
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
      name: 'Estación Manual Doble Acción (F) — Caracola 3 Suroriental',
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
      name: 'Estación Manual Doble Acción (F) — Caracola 4 Suroccidental',
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
      id: 'em-n3-ar-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-N3-AR-01',
      type: 'facp',
      name: 'Anunciador Remoto LCD Notifier (AR) — Cabina de Control Nivel 3',
      model: 'Notifier LCD-80 Anunciador 80 Caracteres',
      zone: 'Nivel 3 (+52.45 m)',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 2850000,
      installerTeam: 'Cuadrilla Especializada Redes A',
      notes: '',
    },
    {
      id: 'em-n3-sir-01',
      projectId: 'estadio-metropolitano',
      code: 'EST-N3-SIR-01',
      type: 'sirena',
      name: 'Sirenas con Luz Estroboscópica Intemperie — Corona Nivel 3',
      model: 'System Sensor P2RH-K Intemperie NEMA 4X',
      zone: 'Nivel 3 (+52.45 m)',
      status: 'pending',
      quantity: 2,
      unit: 'Unidad',
      unitPrice: 265000,
      installerTeam: 'Cuadrilla Detección A',
      notes: '',
    },
  ],
};

const STORAGE_KEY_PROJECTS = 'gsit_projects';
const STORAGE_KEY_FLOORS = 'gsit_floors';
const STORAGE_KEY_ITEMS = 'gsit_items';
const STORAGE_KEY_VERSION = 'gsit_data_version';
const CURRENT_DATA_VERSION = 'v9_production';


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
