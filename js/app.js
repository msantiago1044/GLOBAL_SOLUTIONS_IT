/**
 * GLOBAL SOLUTIONS IT S.A.S. - Plataforma de Gestión y Ejecución de Obras
 * Redes de Detección y Alarma Contra Incendios conforme a NFPA 72
 * Arquitectura de Software, Modelo de Datos de 34 Niveles (0 al 33), Plano SVG y Corte de Facturación
 */

// ==========================================================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ==========================================================================
const AppState = {
  currentUser: null,
  activeView: 'landing', // 'landing', 'projects', 'execution'
  activeBillingTab: 'interactive', // 'interactive', 'certificate'
  currentProject: 'torre-titanium',
  selectedFloor: 33, // Comienza en el piso 33 para mostrar elementos pendientes y permitir interacción inmediata
  zoomLevel: 1,
  panX: 0,
  panY: 0,
  filters: {
    tuberia: true,
    cableado: true,
    detectores: true,
    sirenas: true,
    palancas: true,
    facp: true
  },
  selectedItemForModal: null,
  database: null
};

// Verificación de Rol y Permisos de Acceso
function isAdmin() {
  return AppState.currentUser === 'admin';
}
window.isAdmin = isAdmin;

// ==========================================================================
// MODELO DE DATOS INICIAL DE LA TORRE GRAND TITANIUM (34 NIVELES: 0 AL 33)
// ==========================================================================
function generateInitialDatabase() {
  const db = {
    project: {
      id: 'torre-titanium',
      name: 'Torre Grand Titanium - 33 Pisos',
      client: 'Constructora Bolívar & Inversiones Colpatria',
      address: 'Cra 15 # 98-42, Chicó Norte, Bogotá D.C.',
      contractor: 'Global Solutions IT S.A.S. (NIT 901.458.921-3)',
      interventoria: 'Consorcio Interventorías Civiles & Eléctricas S.A.S.',
      systemType: 'Sistema Direccionable Inteligente NFPA 72 — Notifier ONYX NFS2-3030',
      totalFloors: 34, // Pisos 0 al 33 (Sótano + 33 pisos de torre)
      status: 'En Ejecución Activa',
      startDate: '2026-04-15',
      targetDate: '2026-11-30',
      baseline: {
        globalPercentage: 90.4,
        totalPipeMeters: 15760,
        installedPipeMeters: 14250,
        totalCableMeters: 24800,
        installedCableMeters: 22400,
        totalDevices: 3445,
        installedDevices: 3115
      }
    },
    floors: {}
  };

  // Generación de cada nivel de 0 a 33
  for (let f = 0; f <= 33; f++) {
    let floorType = 'habitaciones';
    let floorName = `Piso ${f}`;

    if (f === 0) {
      floorType = 'parqueaderos';
      floorName = 'Piso 0 - Sótano / Parqueadero & Cuarto de Bombas de Incendio';
    } else if (f === 1) {
      floorType = 'cerebro';
      floorName = 'Piso 1 - CEREBRO DE LA OPERACIÓN (Sala de Control FACP & Riser Troncal)';
    } else if (f >= 2 && f <= 6) {
      floorType = 'oficinas';
      floorName = `Piso ${f} - Oficinas Corporativas & Áreas Comunes`;
    } else {
      floorType = 'habitaciones';
      floorName = `Piso ${f} - Habitaciones Residenciales (${f}01 a ${f}08)`;
    }

    const items = [];

    // ------------------------------------------------------------------------
    // PISO 1: CEREBRO DE LA OPERACIÓN (CENTRAL FACP NOTIFIER)
    // ------------------------------------------------------------------------
    if (floorType === 'cerebro') {
      items.push({
        id: `FACP-P01-MAIN`,
        code: `FACP-P01-MAIN`,
        type: 'facp',
        name: 'Central Principal de Alarma Contra Incendios FACP Notifier',
        model: 'Notifier ONYX NFS2-3030 Direccionable (Certificación UL/FM)',
        zone: 'Cuarto de Control Principal FACP Piso 1',
        status: 'installed',
        installDate: '2026-06-10',
        technician: 'Ing. Carlos Arturo Mendoza (Especialista NFPA 72)',
        quantity: 1,
        unit: 'Unidad',
        unitPrice: 14500000,
        photo: 'assets/img/facp_panel.svg',
        notes: 'Central principal energizada y programada con 4 lazos SLC activos. Supervisión de riser troncal y bombas OK.'
      });

      items.push({
        id: `BAT-P01-24V`,
        code: `BAT-P01-24V`,
        type: 'equipo',
        name: 'Banco de Baterías de Respaldo 2x12V 55Ah',
        model: 'Yuasa VRLA 24VDC Plomo-Ácido Selladas',
        zone: 'Gabinete Inferior FACP Piso 1',
        status: 'installed',
        installDate: '2026-06-10',
        technician: 'Ing. Carlos Mendoza',
        quantity: 1,
        unit: 'Kit',
        unitPrice: 2800000,
        photo: 'assets/img/facp_panel.svg',
        notes: 'Garantiza autonomía de 24 horas en supervisión continua + 15 minutos de evacuación en alarma general.'
      });

      items.push({
        id: `RIS-P01-TRK`,
        code: `RIS-P01-TRK`,
        type: 'tuberia',
        name: 'Acometida Troncal Riser Vertical EMT 1-1/2"',
        model: 'Tubería EMT 1-1/2" con Coplas de Compresión UL 797',
        zone: 'Salida de FACP a Ducto Vertical Riser',
        status: 'installed',
        installDate: '2026-06-12',
        technician: 'Cuadrilla Troncal - Tubería (M. Rodríguez)',
        quantity: 35.0,
        unit: 'Metros',
        unitPrice: 42000,
        photo: 'assets/img/pipe_emt.svg',
        notes: 'Alimentador principal que distribuye los lazos SLC hacia los 33 niveles superiores.'
      });

      items.push({
        id: `CAB-P01-TRK`,
        code: `CAB-P01-TRK`,
        type: 'cableado',
        name: 'Cable Troncal Riser Blindado FPLR 2x14 AWG',
        model: 'Cable Contra Incendio FPLR Rojo 2x14 AWG UL 1424',
        zone: 'Ducto Vertical Riser Principal',
        status: 'installed',
        installDate: '2026-06-14',
        technician: 'Cuadrilla 1 - Cableado (J. Morales)',
        quantity: 45.0,
        unit: 'Metros',
        unitPrice: 27500,
        photo: 'assets/img/cable_fire.svg',
        notes: 'Cableado vertical con aislamiento cerámico para lazo principal Clase A con retorno.'
      });

      items.push({
        id: `DET-P01-CTRL`,
        code: `DET-P01-CTRL`,
        type: 'detector-doble',
        name: 'Detector Óptico de Humo / Sala de Control',
        model: 'Notifier FSP-851 Direccionable con Base B210LP',
        zone: 'Cielo Raso Sala de Control FACP',
        status: 'installed',
        installDate: '2026-06-15',
        technician: 'Cuadrilla 3 - Dispositivos',
        quantity: 1,
        unit: 'Unidad',
        unitPrice: 245000,
        photo: 'assets/img/smoke_detector.svg',
        notes: 'Protección dedicada para la sala de comando del sistema contra incendios.'
      });

      items.push({
        id: `SIR-P01-CTRL`,
        code: `SIR-P01-CTRL`,
        type: 'sirena',
        name: 'Sirena con Luz Estroboscópica Sala de Control',
        model: 'System Sensor SpectrAlert Advance P2RL',
        zone: 'Acceso Sala de Comando Piso 1',
        status: 'installed',
        installDate: '2026-06-15',
        technician: 'Cuadrilla 3 - Dispositivos',
        quantity: 1,
        unit: 'Unidad',
        unitPrice: 280000,
        photo: 'assets/img/horn_strobe.svg',
        notes: 'Configurada a 15 candelas y tono continuo de notificación.'
      });
    }

    // ------------------------------------------------------------------------
    // PISO 0: SÓTANO / PARQUEADEROS & CUARTO DE BOMBAS
    // ------------------------------------------------------------------------
    else if (floorType === 'parqueaderos') {
      items.push({
        id: `BOM-P00-CTRL`,
        code: `BOM-P00-CTRL`,
        type: 'equipo',
        name: 'Módulo de Monitoreo de Bomba Principal y Jockey',
        model: 'Módulo Notifier FMM-1 Supervisión de Contacto Seco',
        zone: 'Cuarto de Bombas Contra Incendio Sótano',
        status: 'installed',
        installDate: '2026-05-20',
        technician: 'Ing. Carlos Mendoza',
        quantity: 1,
        unit: 'Unidad',
        unitPrice: 380000,
        photo: 'assets/img/facp_panel.svg',
        notes: 'Supervisa estado de marcha de bomba eléctrica 500 GPM, bomba diésel y presurización jockey.'
      });

      for (let s = 1; s <= 4; s++) {
        items.push({
          id: `TUB-P00-S0${s}`,
          code: `TUB-P00-S0${s}`,
          type: 'tuberia',
          name: `Tubería Conduit EMT 3/4" Sótano Zona ${s}`,
          model: 'Tubería EMT Galvanizada Industrial UL 797',
          zone: `Bahías de Estacionamiento Bahía ${s*2-1}-${s*2}`,
          status: 'installed',
          installDate: '2026-05-22',
          technician: 'Cuadrilla 2 - Tubería',
          quantity: 22.0,
          unit: 'Metros',
          unitPrice: 28500,
          photo: 'assets/img/pipe_emt.svg',
          notes: 'Instalación fijada en viga de concreto con abrazaderas tipo riel y coplas herméticas.'
        });

        items.push({
          id: `CAB-P00-S0${s}`,
          code: `CAB-P00-SLC-0${s}`,
          type: 'cableado',
          name: `Cable Blindado FPLR 2x16 AWG Sótano Tramo ${s}`,
          model: 'Cable Contra Incendio FPLR Rojo UL 1424',
          zone: `Ducto EMT Sótano Sector ${s}`,
          status: 'installed',
          installDate: '2026-05-25',
          technician: 'Cuadrilla 1 - Cableado',
          quantity: 28.0,
          unit: 'Metros',
          unitPrice: 19800,
          photo: 'assets/img/cable_fire.svg',
          notes: 'Lazo SLC cerrado y probado contra tierra.'
        });
      }

      for (let d = 1; d <= 4; d++) {
        items.push({
          id: `DET-P00-0${d}`,
          code: `DET-TERM-P00-0${d}`,
          type: 'detector-doble',
          name: `Detector Térmico de Temperatura / Sótano ${d}`,
          model: 'Notifier FST-851 Térmico Termovelocimétrico (57°C)',
          zone: `Bahía de Parqueadero P0${d}`,
          status: 'installed',
          installDate: '2026-05-28',
          technician: 'Cuadrilla 3 - Dispositivos',
          quantity: 1,
          unit: 'Unidad',
          unitPrice: 260000,
          photo: 'assets/img/smoke_detector.svg',
          notes: 'Inmune a gases de escape de vehículos. Verificado con lámpara térmica.'
        });
      }

      items.push({
        id: `SIR-P00-IND`,
        code: `SIR-P00-IND`,
        type: 'sirena',
        name: 'Sirena-Estrobo Industrial Sótano IP65',
        model: 'System Sensor P2RK Resistente a Intemperie / Polvo',
        zone: 'Rampa de Salida Vehicular Sótano',
        status: 'installed',
        installDate: '2026-05-29',
        technician: 'Cuadrilla 3 - Dispositivos',
        quantity: 1,
        unit: 'Unidad',
        unitPrice: 320000,
        photo: 'assets/img/horn_strobe.svg',
        notes: 'Potencia acústica de 90 dBA para superar ruido de motores.'
      });

      items.push({
        id: `PAL-P00-IND`,
        code: `EM-P00-ESC`,
        type: 'palanca',
        name: 'Estación Manual Salida de Evacuación Sótano',
        model: 'Notifier NBG-12LX Doble Acción Direccionable',
        zone: 'Acceso a Escalera de Emergencia Sótano',
        status: 'installed',
        installDate: '2026-05-29',
        technician: 'Cuadrilla 3 - Dispositivos',
        quantity: 1,
        unit: 'Unidad',
        unitPrice: 220000,
        photo: 'assets/img/pull_station.svg',
        notes: 'Montada a 1.20m sobre nivel de piso terminado.'
      });
    }

    // ------------------------------------------------------------------------
    // PISOS 2 AL 6: OFICINAS CORPORATIVAS
    // ------------------------------------------------------------------------
    else if (floorType === 'oficinas') {
      for (let s = 1; s <= 5; s++) {
        items.push({
          id: `TUB-P${f}-S0${s}`,
          code: `TUB-P${f}-S0${s}`,
          type: 'tuberia',
          name: `Tubería Conduit EMT 3/4" Oficinas Tramo ${s}`,
          model: 'Tubería EMT 3/4" Galvanizada UL 797',
          zone: `Área Corporativa Piso ${f} Sector ${s}`,
          status: 'installed',
          installDate: `2026-07-${10 + s}`,
          technician: 'Cuadrilla 2 - Tubería',
          quantity: 20.0,
          unit: 'Metros',
          unitPrice: 28500,
          photo: 'assets/img/pipe_emt.svg',
          notes: 'Instalación aérea con coplas de compresión y cajas condulet.'
        });

        items.push({
          id: `CAB-P${f}-S0${s}`,
          code: `CAB-P${f}-SLC-0${s}`,
          type: 'cableado',
          name: `Cable Blindado FPLR 2x16 AWG Tramo ${s}`,
          model: 'Cable FPLR Rojo 2x16 AWG UL 1424',
          zone: `Ducto Piso ${f} Sector ${s}`,
          status: 'installed',
          installDate: `2026-07-${15 + s}`,
          technician: 'Cuadrilla 1 - Cableado',
          quantity: 27.0,
          unit: 'Metros',
          unitPrice: 19800,
          photo: 'assets/img/cable_fire.svg',
          notes: 'Cableado SLC direccionable probado.'
        });
      }

      for (let d = 1; d <= 6; d++) {
        items.push({
          id: `DET-P${f}-0${d}`,
          code: `DET-OFIC-P${f}-0${d}`,
          type: 'detector-doble',
          name: `Detector Óptico Humo / Oficina P${f}-0${d}`,
          model: 'Notifier FSP-851 Fotoeléctrico Direccionable',
          zone: `Área Oficina / Open Space P${f}`,
          status: 'installed',
          installDate: '2026-07-22',
          technician: 'Cuadrilla 3 - Dispositivos',
          quantity: 1,
          unit: 'Unidad',
          unitPrice: 245000,
          photo: 'assets/img/smoke_detector.svg',
          notes: 'Montado en cielo raso acústico. LED parpadeando en verde de supervisión.'
        });
      }

      items.push({
        id: `SIR-P${f}-01`,
        code: `SIR-OFIC-P${f}-01`,
        type: 'sirena',
        name: `Sirena con Luz Estroboscópica Piso ${f}`,
        model: 'System Sensor P2RL SpectrAlert Advance',
        zone: `Hall de Ascensores Piso ${f}`,
        status: 'installed',
        installDate: '2026-07-24',
        technician: 'Cuadrilla 3 - Dispositivos',
        quantity: 1,
        unit: 'Unidad',
        unitPrice: 280000,
        photo: 'assets/img/horn_strobe.svg',
        notes: 'Configurada a 30 candelas.'
      });

      items.push({
        id: `PAL-P${f}-01`,
        code: `EM-OFIC-P${f}-01`,
        type: 'palanca',
        name: `Estación Manual Salida Piso ${f}`,
        model: 'Notifier NBG-12LX',
        zone: `Acceso Escalera de Evacuación Piso ${f}`,
        status: 'installed',
        installDate: '2026-07-24',
        technician: 'Cuadrilla 3 - Dispositivos',
        quantity: 1,
        unit: 'Unidad',
        unitPrice: 220000,
        photo: 'assets/img/pull_station.svg',
        notes: 'Verificada apertura y switch de alarma direccionable.'
      });
    }

    // ------------------------------------------------------------------------
    // PISOS 7 AL 33: NIVELES RESIDENCIALES CON 8 HABITACIONES PRIVADAS
    // ------------------------------------------------------------------------
    else {
      // 6 Tramos de Tubería Conduit EMT 3/4" (Ítem independiente)
      for (let s = 1; s <= 6; s++) {
        let isInstalled = true;
        // Definición exacta de pendientes para que los porcentajes coincidan:
        if (f === 33 && s === 4) isInstalled = false; // Piso 33: tramo 4 pendiente
        else if (f === 32 && s === 5) isInstalled = false;
        else if (f === 31 && s === 6) isInstalled = false;
        else if (f === 30 && s === 6) isInstalled = false;

        items.push({
          id: `TUB-P${f}-S0${s}`,
          code: `TUB-P${f}-S0${s}`,
          type: 'tuberia',
          name: `Tubería Conduit EMT 3/4" Tramo ${s}`,
          model: 'Tubo EMT Galvanizado Certificado UL 797',
          zone: `Pasillo Distribución Zona ${s}`,
          status: isInstalled ? 'installed' : 'pending',
          installDate: isInstalled ? `2026-08-${10 + (s % 15)}` : null,
          technician: isInstalled ? 'Cuadrilla 2 - Tubería (M. Rodríguez)' : 'Pendiente Asignación',
          quantity: 18.5,
          unit: 'Metros',
          unitPrice: 28500,
          photo: 'assets/img/pipe_emt.svg',
          notes: isInstalled
            ? 'Tubería fijada con abrazaderas unistrut cada 1.5m con coplas de compresión herméticas.'
            : 'Trazado marcado en losa. Pendiente perforación y montaje de soportes unistrut.'
        });
      }

      // 6 Tramos de Cableado Blindado FPLR 2x16 AWG (Ítem independiente del ducto)
      for (let c = 1; c <= 6; c++) {
        let isInstalled = true;
        if (f === 33 && (c === 3 || c === 4)) isInstalled = false; // Piso 33: tramos 3 y 4 pendientes
        else if (f === 32 && (c === 4 || c === 5)) isInstalled = false;
        else if (f === 31 && c === 5) isInstalled = false;
        else if (f === 30 && c === 6) isInstalled = false;

        items.push({
          id: `CAB-P${f}-S0${c}`,
          code: `CAB-P${f}-SLC-0${c}`,
          type: 'cableado',
          name: `Cable Blindado FPLR 2x16 AWG Tramo ${c}`,
          model: 'Cable Contra Incendio FPLR Rojo UL 1424 (Resistente al Fuego)',
          zone: `Pasillo Distribución Tramo ${c}`,
          status: isInstalled ? 'installed' : 'pending',
          installDate: isInstalled ? `2026-08-${14 + (c % 12)}` : null,
          technician: isInstalled ? 'Cuadrilla 1 - Cableado (J. Morales)' : 'Pendiente Asignación',
          quantity: 26.0,
          unit: 'Metros',
          unitPrice: 19800,
          photo: 'assets/img/cable_fire.svg',
          notes: isInstalled
            ? 'Cable peinado en caja 4x4 condulet, rotulado en ambos extremos, aislamiento sin fuga a tierra.'
            : 'Tubería metálica instalada, pero pendiente tirado y peinado de cable en ducto.'
        });
      }

      // 8 Habitaciones Privadas con Detector de Humo Autónomo en cada una
      for (let r = 1; r <= 8; r++) {
        let isInstalled = true;
        if (f === 33 && (r === 6 || r === 7)) isInstalled = false; // Piso 33: habitaciones 3306 y 3307 pendientes
        else if (f === 32 && r === 8) isInstalled = false;
        else if (f === 31 && r === 8) isInstalled = false;

        items.push({
          id: `DET-P${f}-${r}`,
          code: `DET-HAB-${f}0${r}`,
          type: 'detector-autonomo',
          name: `Detector de Humo Autónomo / Habitación ${f}0${r}`,
          model: 'Notifier Fotoeléctrico Direccionable FSP-851 + Base B210LP',
          zone: `Interior Habitación ${f}0${r}`,
          status: isInstalled ? 'installed' : 'pending',
          installDate: isInstalled ? `2026-09-${04 + (r % 10)}` : null,
          technician: isInstalled ? 'Cuadrilla 3 - Dispositivos (A. Herrera)' : 'Pendiente Asignación',
          quantity: 1,
          unit: 'Unidad',
          unitPrice: 245000,
          photo: 'assets/img/smoke_detector.svg',
          notes: isInstalled
            ? 'Montado sobre caja octagonal en cielo raso acústico. LED verde de supervisión parpadeando en lazo SLC.'
            : 'Caja octagonal metálica instalada en losa. Falta montaje de base B210LP y cabeza de sensor.'
        });
      }

      // 2 Sirenas Estroboscópicas en Pasillo
      for (let s = 1; s <= 2; s++) {
        items.push({
          id: `SIR-P${f}-${s}`,
          code: `SIR-PAS-P${f}-0${s}`,
          type: 'sirena',
          name: `Sirena con Luz Estroboscópica Pasillo ${s}`,
          model: 'System Sensor SpectrAlert Advance P2RL 15/75 cd',
          zone: `Pasillo Principal Sector ${s === 1 ? 'Norte' : 'Sur'}`,
          status: 'installed',
          installDate: `2026-09-02`,
          technician: 'Cuadrilla 3 - Dispositivos',
          quantity: 1,
          unit: 'Unidad',
          unitPrice: 280000,
          photo: 'assets/img/horn_strobe.svg',
          notes: 'Verificada intensidad lumínica sincronizada y presión sonora mayor a 75 dBA en pasillo.'
        });
      }

      // 1 Estación Manual / Palanca de Emergencia en Acceso a Escalera
      items.push({
        id: `PAL-P${f}-01`,
        code: `EM-ESC-P${f}-01`,
        type: 'palanca',
        name: `Estación Manual de Emergencia / Acceso Escalera 1`,
        model: 'Notifier NBG-12LX Doble Acción Direccionable',
        zone: `Acceso Escalera de Evacuación 1 Piso ${f}`,
        status: 'installed',
        installDate: `2026-09-03`,
        technician: 'Cuadrilla 3 - Dispositivos',
        quantity: 1,
        unit: 'Unidad',
        unitPrice: 220000,
        photo: 'assets/img/pull_station.svg',
        notes: 'Montada a 1.20m sobre nivel de piso terminado conforme a norma NFPA 72.'
      });
    }

    db.floors[f] = {
      floorNumber: f,
      name: floorName,
      type: floorType,
      items: items
    };
  }

  return db;
}

// ==========================================================================
// PERSISTENCIA Y CARGA DE LA BASE DE DATOS LOCAL
// ==========================================================================
function loadDatabase() {
  const stored = localStorage.getItem('gsit_database_v2');
  if (stored) {
    try {
      AppState.database = JSON.parse(stored);
      return;
    } catch (e) {
      console.warn('Error leyendo base local, regenerando...', e);
    }
  }
  AppState.database = generateInitialDatabase();
  saveDatabase();
}

function saveDatabase() {
  localStorage.setItem('gsit_database_v2', JSON.stringify(AppState.database));
}

// ==========================================================================
// MOTOR DE CÁLCULO DE MÉTRICAS (PROGRESO GLOBAL, PISOS Y MATERIALES)
// ==========================================================================
function calculateMetrics() {
  const currentFloor = AppState.database.floors[AppState.selectedFloor];
  let floorTotal = 0;
  let floorInstalled = 0;
  if (currentFloor) {
    currentFloor.items.forEach(item => {
      floorTotal++;
      if (item.status === 'installed') floorInstalled++;
    });
  }
  const floorPercentage = floorTotal > 0 ? Math.round((floorInstalled / floorTotal) * 100) : 100;

  // Cálculo de avance dinámico sobre la línea base del contrato
  // Piso 33 inicial: 18 instalados de 23 = 78.3% (~78%)
  // Piso 32 inicial: 19 de 23 = 82.6% (~83%)
  // Piso 31 inicial: 20 de 23 = 87.0% (~87%)
  // Piso 30 inicial: 21 de 23 = 91.3% (~89%-91%)
  // Contamos cuántos ítems pendientes se han completado adicionalmente
  let newlyInstalledItems = 0;
  let installedPipeMetersDelta = 0;
  let installedCableMetersDelta = 0;
  let installedDevicesDelta = 0;

  // Los 5 ítems que están originalmente pendientes en Piso 33:
  const baselinePendingIds = [
    'TUB-P33-S04', 'CAB-P33-S03', 'CAB-P33-S04', 'DET-P33-6', 'DET-P33-7',
    'TUB-P32-S05', 'CAB-P32-S04', 'CAB-P32-S05', 'DET-P32-8',
    'TUB-P31-S06', 'CAB-P31-S05', 'DET-P31-8',
    'TUB-P30-S06', 'CAB-P30-S06'
  ];

  for (let f = 30; f <= 33; f++) {
    const floor = AppState.database.floors[f];
    if (!floor) continue;
    floor.items.forEach(item => {
      if (baselinePendingIds.includes(item.id)) {
        if (item.status === 'installed') {
          newlyInstalledItems++;
          if (item.type === 'tuberia') installedPipeMetersDelta += item.quantity;
          else if (item.type === 'cableado') installedCableMetersDelta += item.quantity;
          else installedDevicesDelta += item.quantity;
        }
      }
    });
  }

  // Cada ítem instalado de los pendientes añade +0.2% al avance global
  const baselinePct = AppState.database.project.baseline.globalPercentage; // 90.4
  const dynamicGlobal = (baselinePct + (newlyInstalledItems * 0.2)).toFixed(1);

  const baselinePipe = AppState.database.project.baseline.installedPipeMeters; // 14250
  const baselineCable = AppState.database.project.baseline.installedCableMeters; // 22400
  const baselineDevices = AppState.database.project.baseline.installedDevices; // 3115

  return {
    globalPercentage: dynamicGlobal,
    installedPipeMeters: Math.round(baselinePipe + installedPipeMetersDelta),
    totalPipeMeters: AppState.database.project.baseline.totalPipeMeters,
    installedCableMeters: Math.round(baselineCable + installedCableMetersDelta),
    totalCableMeters: AppState.database.project.baseline.totalCableMeters,
    installedDevices: Math.round(baselineDevices + installedDevicesDelta),
    totalDevices: AppState.database.project.baseline.totalDevices,
    floorPercentage,
    floorTotal,
    floorInstalled
  };
}

// ==========================================================================
// INICIALIZACIÓN DEL SISTEMA
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  loadDatabase();
  initRouting();
  initEventListeners();
  updateAuthUI();
  updateUI();
  if (AppState.activeView === 'execution') {
    renderFloorBlueprint();
    renderFloorItemsList();
  }
});

// Enrutador sencillo para vistas SPA
function initRouting() {
  const user = localStorage.getItem('gsit_auth_user');
  if (user) {
    AppState.currentUser = user;
    showView('execution');
  } else {
    showView('landing');
  }
}

function showView(viewId) {
  AppState.activeView = viewId;
  document.querySelectorAll('.view-container').forEach(el => el.classList.remove('active'));
  const target = document.getElementById(`view-${viewId}`);
  if (target) {
    target.classList.add('active');
  }
  window.scrollTo(0, 0);

  if (viewId === 'execution') {
    updateUI();
    renderFloorBlueprint();
    renderFloorItemsList();
  }
}
window.showView = showView;

// ==========================================================================
// ESCUCHADORES DE EVENTOS
// ==========================================================================
function initEventListeners() {
  // Botones de navegación a Login
  document.querySelectorAll('[data-action="open-login"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openLoginModal();
    });
  });

  document.getElementById('login-modal-close')?.addEventListener('click', closeLoginModal);

  // Formulario de Login
  const loginForm = document.getElementById('login-form');
  loginForm?.addEventListener('submit', handleLogin);

  const fillAdminBtn = document.getElementById('btn-fill-admin-creds') || document.getElementById('btn-fill-demo-creds');
  fillAdminBtn?.addEventListener('click', () => {
    const userIn = document.getElementById('login-username');
    const passIn = document.getElementById('login-password');
    if (userIn) userIn.value = 'admin';
    if (passIn) passIn.value = 'admin';
    showToast('Credenciales de Administrador completadas');
  });

  // Botón Logout
  document.querySelectorAll('[data-action="logout"]').forEach(btn => {
    btn.addEventListener('click', handleLogout);
  });

  // Selector de proyectos -> Abrir Torre Titanium
  document.querySelectorAll('[data-action="select-project"]').forEach(card => {
    card.addEventListener('click', () => {
      showView('execution');
    });
  });

  // Selector desplegable de Pisos
  const floorDropdown = document.getElementById('floor-selector-dropdown');
  floorDropdown?.addEventListener('change', (e) => {
    selectFloor(parseInt(e.target.value, 10));
  });

  // Botones de zoom en el plano
  document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
    AppState.zoomLevel = Math.min(AppState.zoomLevel + 0.18, 2.5);
    applyBlueprintTransform();
  });

  document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
    AppState.zoomLevel = Math.max(AppState.zoomLevel - 0.18, 0.55);
    applyBlueprintTransform();
  });

  document.getElementById('btn-zoom-reset')?.addEventListener('click', () => {
    AppState.zoomLevel = 1;
    AppState.panX = 0;
    AppState.panY = 0;
    applyBlueprintTransform();
  });

  // Filtros de Capas
  ['tuberia', 'cableado', 'detectores', 'sirenas', 'palancas', 'facp'].forEach(type => {
    const cb = document.getElementById(`filter-${type}`);
    cb?.addEventListener('change', (e) => {
      AppState.filters[type] = e.target.checked;
      renderFloorBlueprint();
    });
  });

  // Modal de Detalle de Elemento
  document.getElementById('modal-item-close')?.addEventListener('click', closeItemModal);
  document.getElementById('btn-cancel-item-modal')?.addEventListener('click', closeItemModal);
  document.getElementById('btn-save-item-modal')?.addEventListener('click', saveItemModalChanges);

  // Carga de Fotos
  const fileInput = document.getElementById('item-photo-input');
  fileInput?.addEventListener('change', handleUserPhotoUpload);

  // Modal de Corte de Facturación
  document.querySelectorAll('[data-action="open-billing"]').forEach(btn => {
    btn.addEventListener('click', openBillingModal);
  });
  document.getElementById('modal-billing-close')?.addEventListener('click', closeBillingModal);
  document.getElementById('btn-apply-billing-filter')?.addEventListener('click', renderBillingReport);
  document.getElementById('btn-export-billing-csv')?.addEventListener('click', exportBillingToCSV);
  document.getElementById('btn-print-billing')?.addEventListener('click', () => {
    window.print();
  });

  // Arrastre (Pan) y rueda de ratón (Wheel Zoom) del Plano
  initBlueprintPanAndZoom();
}

// Manejo de Autenticación
function handleLogin(e) {
  e.preventDefault();
  const u = document.getElementById('login-username').value.trim();
  const p = document.getElementById('login-password').value.trim();

  if (u === 'admin' && p === 'admin') {
    AppState.currentUser = 'admin';
    localStorage.setItem('gsit_auth_user', 'admin');
    closeLoginModal();
    updateAuthUI();
    showToast('Bienvenido, Ingeniero Administrador GSIT — Modo Edición Habilitado');

    // Si la ficha técnica estaba abierta en modo público, refrescarla a modo editable
    if (AppState.selectedItemForModal) {
      openItemModal(AppState.selectedItemForModal);
    } else if (AppState.activeView !== 'execution') {
      showView('execution');
    }
  } else {
    showToast('Credenciales incorrectas. Acceso exclusivo para administradores de obra.');
    const box = document.getElementById('login-card-box');
    box?.classList.add('shake');
    setTimeout(() => box?.classList.remove('shake'), 400);
  }
}

function handleLogout() {
  localStorage.removeItem('gsit_auth_user');
  AppState.currentUser = null;
  updateAuthUI();

  // Si la ficha técnica estaba abierta, refrescarla a modo solo lectura
  if (AppState.selectedItemForModal) {
    openItemModal(AppState.selectedItemForModal);
  }
  showToast('Sesión de administrador finalizada. Modo Consulta Pública (Solo Lectura) activo');
}

function updateAuthUI() {
  const profileMenu = document.getElementById('nav-user-profile');
  const loginBtn = document.getElementById('nav-btn-login');
  const navRoleBadge = document.getElementById('nav-role-badge');
  const sidebarAccessTag = document.getElementById('sidebar-access-tag');
  const projectsRoleBadge = document.getElementById('projects-role-badge');
  const itemsHelpTag = document.getElementById('items-help-tag');

  const adminActive = isAdmin();

  if (adminActive) {
    if (profileMenu) profileMenu.style.display = 'flex';
    if (loginBtn) loginBtn.style.display = 'none';
    if (navRoleBadge) {
      navRoleBadge.className = 'access-role-badge admin';
      navRoleBadge.innerHTML = '🛡️ Administrador Autorizado';
    }
    if (sidebarAccessTag) {
      sidebarAccessTag.className = 'sidebar-access-tag admin';
      sidebarAccessTag.innerHTML = '🛡️ Modo Edición Habilitado (Administrador)';
    }
    if (projectsRoleBadge) {
      projectsRoleBadge.className = 'access-role-badge admin';
      projectsRoleBadge.innerHTML = '🛡️ Modo Edición (Administrador)';
    }
    if (itemsHelpTag) {
      itemsHelpTag.innerHTML = '✏️ Clic para editar elemento';
      itemsHelpTag.onclick = () => showToast('Modo Administrador: Haz clic en cualquier elemento para modificar su instalación y fotos');
    }
  } else {
    if (profileMenu) profileMenu.style.display = 'none';
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (navRoleBadge) {
      navRoleBadge.className = 'access-role-badge public';
      navRoleBadge.innerHTML = '👁️ Consulta Pública';
    }
    if (sidebarAccessTag) {
      sidebarAccessTag.className = 'sidebar-access-tag public';
      sidebarAccessTag.innerHTML = '👁️ Modo Consulta Pública (Solo Lectura)';
    }
    if (projectsRoleBadge) {
      projectsRoleBadge.className = 'access-role-badge public';
      projectsRoleBadge.innerHTML = '👁️ Consulta Pública (Solo Lectura)';
    }
    if (itemsHelpTag) {
      itemsHelpTag.innerHTML = '👁️ Clic para ver ficha técnica';
      itemsHelpTag.onclick = () => showToast('Modo Consulta Pública: Haz clic en cualquier elemento para ver sus especificaciones técnicas');
    }
  }
}

function openLoginModal() {
  document.getElementById('login-modal-overlay')?.classList.add('active');
  document.getElementById('login-username')?.focus();
}

function closeLoginModal() {
  document.getElementById('login-modal-overlay')?.classList.remove('active');
}

// Selector de Piso
function selectFloor(floorNum) {
  AppState.selectedFloor = floorNum;
  AppState.zoomLevel = 1;
  AppState.panX = 0;
  AppState.panY = 0;

  // Actualizar selector desplegable
  const dropdown = document.getElementById('floor-selector-dropdown');
  if (dropdown) dropdown.value = floorNum;

  // Actualizar chips de pisos y hacer auto-scroll al chip activo
  document.querySelectorAll('.floor-chip').forEach(chip => {
    const isAct = parseInt(chip.dataset.floor, 10) === floorNum;
    chip.classList.toggle('active', isAct);
    if (isAct) {
      chip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  });

  updateUI();
  renderFloorBlueprint();
  renderFloorItemsList();
}

// Actualizar toda la interfaz de usuario
function updateUI() {
  const metrics = calculateMetrics();

  // Actualizar textos y barras de progreso globales
  document.querySelectorAll('.global-progress-value').forEach(el => {
    el.textContent = `${metrics.globalPercentage}%`;
  });
  document.querySelectorAll('.global-progress-fill').forEach(el => {
    el.style.width = `${metrics.globalPercentage}%`;
  });

  // Métricas del panel lateral izquierdo
  const pipeEl = document.getElementById('metric-pipe-meters');
  if (pipeEl) pipeEl.textContent = `${metrics.installedPipeMeters.toLocaleString()} m`;

  const cableEl = document.getElementById('metric-cable-meters');
  if (cableEl) cableEl.textContent = `${metrics.installedCableMeters.toLocaleString()} m`;

  const devEl = document.getElementById('metric-devices-count');
  if (devEl) devEl.textContent = `${metrics.installedDevices.toLocaleString()} un`;

  // Datos del piso actual en cabecera del plano
  const currentFloor = AppState.database.floors[AppState.selectedFloor];
  const floorTitleEl = document.getElementById('blueprint-current-floor-title');
  if (floorTitleEl && currentFloor) {
    floorTitleEl.textContent = currentFloor.name;
  }

  const floorTagEl = document.getElementById('blueprint-floor-status-tag');
  if (floorTagEl) {
    floorTagEl.textContent = `${metrics.floorPercentage}% Ejecutado (${metrics.floorInstalled}/${metrics.floorTotal} Ítems)`;
    if (metrics.floorPercentage >= 99) {
      floorTagEl.style.backgroundColor = '#ecfdf5';
      floorTagEl.style.color = '#059669';
    } else {
      floorTagEl.style.backgroundColor = '#fffbeb';
      floorTagEl.style.color = '#b45309';
    }
  }

  // Refrescar selector desplegable de pisos y scroller de chips
  renderFloorDropdown();
  renderFloorChips();
}

// Renderizar el selector desplegable con todos los 34 niveles (0 al 33)
function renderFloorDropdown() {
  const dropdown = document.getElementById('floor-selector-dropdown');
  if (!dropdown) return;

  const currentVal = AppState.selectedFloor;
  let html = '';

  for (let f = 33; f >= 0; f--) {
    const floor = AppState.database.floors[f];
    if (!floor) continue;

    let installed = 0;
    floor.items.forEach(i => { if (i.status === 'installed') installed++; });
    const pct = Math.round((installed / floor.items.length) * 100);

    let label = '';
    if (f === 33) label = `Piso 33 - Ático / Penthouse (${pct}% Ejecutado)`;
    else if (f === 1) label = `Piso 1 - CEREBRO FACP / Sala de Control (100% OK)`;
    else if (f === 0) label = `Piso 0 - Sótano & Bombas de Incendio (100% OK)`;
    else if (f >= 2 && f <= 6) label = `Piso ${f} - Oficinas Corporativas (${pct}% OK)`;
    else label = `Piso ${f} - Habitaciones Residenciales (${pct}% ${pct === 100 ? 'OK' : 'En Obra'})`;

    html += `<option value="${f}" ${f === currentVal ? 'selected' : ''}>${label}</option>`;
  }

  dropdown.innerHTML = html;
}

// Renderizar la barra horizontal scroller de chips de pisos
function renderFloorChips() {
  const container = document.getElementById('floor-chips-scroller');
  if (!container) return;

  container.innerHTML = '';
  // De piso 33 a piso 0 descendente
  for (let f = 33; f >= 0; f--) {
    const floor = AppState.database.floors[f];
    if (!floor) continue;

    let installed = 0;
    floor.items.forEach(i => { if (i.status === 'installed') installed++; });
    const pct = Math.round((installed / floor.items.length) * 100);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `floor-chip ${f === AppState.selectedFloor ? 'active' : ''} ${f === 1 ? 'brain' : ''}`;
    btn.dataset.floor = f;
    btn.innerHTML = `${f === 1 ? '🧠 ' : ''}<strong>P${f}</strong> <span style="font-size:0.68rem;opacity:0.85;">${pct}%</span>`;
    btn.addEventListener('click', () => selectFloor(f));
    container.appendChild(btn);
  }
}

// Renderizar la lista de elementos en el sidebar izquierdo
function renderFloorItemsList() {
  const container = document.getElementById('current-floor-items-container');
  if (!container) return;

  const currentFloor = AppState.database.floors[AppState.selectedFloor];
  if (!currentFloor) return;

  container.innerHTML = '';

  currentFloor.items.forEach(item => {
    const isInst = item.status === 'installed';
    const card = document.createElement('div');
    card.className = 'item-row-card';
    card.innerHTML = `
      <div class="item-row-info">
        <span class="item-code">${item.code}</span>
        <span class="item-desc">${item.name}</span>
      </div>
      <span class="status-badge ${isInst ? 'installed' : 'pending'}">
        ${isInst ? 'Instalado' : 'Pendiente'}
      </span>
    `;
    card.addEventListener('click', () => openItemModal(item));
    container.appendChild(card);
  });
}

// ==========================================================================
// RENDERIZADO DEL PLANO ARQUITECTÓNICO INTERACTIVO (SVG VECTORIAL DINÁMICO)
// ==========================================================================
function renderFloorBlueprint() {
  const container = document.getElementById('blueprint-canvas-container');
  if (!container) return;

  if (!AppState.database || !AppState.database.floors) {
    console.warn('Base de datos no disponible para plano');
    return;
  }

  const floor = AppState.database.floors[AppState.selectedFloor];
  if (!floor) return;

  let svgContent = '';

  // Fondo y Cuadrícula Técnica
  svgContent += `
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpace">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" stroke-width="1"/>
      </pattern>
      <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#10b981" flood-opacity="0.8"/>
      </filter>
      <filter id="glowAmber" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#f59e0b" flood-opacity="0.8"/>
      </filter>
    </defs>
    <rect width="1000" height="650" fill="#ffffff" rx="12"/>
    <rect width="1000" height="650" fill="url(#grid)" rx="12"/>
  `;

  // ------------------------------------------------------------------------
  // PISO 1: SALA DE CONTROL PRINCIPAL - CEREBRO FACP
  // ------------------------------------------------------------------------
  if (floor.type === 'cerebro') {
    svgContent += `
      <!-- Muros Perimetrales Piso 1 -->
      <rect x="50" y="50" width="900" height="550" fill="#f8fafc" stroke="#1e293b" stroke-width="4" rx="8"/>
      
      <!-- Cuarto Técnico FACP (Cerebro) -->
      <rect x="80" y="80" width="420" height="490" fill="#f1f5f9" stroke="#004b87" stroke-width="3" stroke-dasharray="8 4" rx="6"/>
      <text x="290" y="115" font-family="'Outfit', sans-serif" font-size="16" font-weight="800" fill="#004b87" text-anchor="middle">SALA DE CONTROL PRINCIPAL — FACP NOTIFIER NFS2-3030</text>
      <text x="290" y="135" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#0284c7" text-anchor="middle">CEREBRO DE OPERACIONES & SUPERVISIÓN NFPA 72</text>

      <!-- Zona de Oficinas Administrativas y Monitoreo -->
      <rect x="520" y="80" width="400" height="490" fill="#ffffff" stroke="#94a3b8" stroke-width="2" rx="6"/>
      <text x="720" y="115" font-family="'Outfit', sans-serif" font-size="15" font-weight="800" fill="#475569" text-anchor="middle">ÁREA DE MONITOREO & RESIDENCIA DE OBRA</text>

      <!-- Ducto Vertical Riser Troncal -->
      <rect x="440" y="270" width="100" height="120" fill="#e0f2fe" stroke="#0077b6" stroke-width="2.5" rx="6"/>
      <text x="490" y="325" font-family="'Outfit', sans-serif" font-size="11" font-weight="800" fill="#0369a1" text-anchor="middle">DUCTO RISER</text>
      <text x="490" y="342" font-family="'Outfit', sans-serif" font-size="10" font-weight="600" fill="#0284c7" text-anchor="middle">PISOS 0 AL 33</text>
    `;

    // Gabinete FACP Notifier
    const facp = floor.items.find(i => i.type === 'facp');
    if (facp && AppState.filters.facp) {
      const isInst = facp.status === 'installed';
      const col = isInst ? '#10b981' : '#f59e0b';
      svgContent += `
        <!-- Gabinete Notifier NFS2-3030 -->
        <g class="svg-interactive-item" onclick="window.onSvgItemClick('${facp.id}')">
          <rect x="180" y="200" width="190" height="220" rx="10" fill="#991b1b" stroke="${col}" stroke-width="4" filter="${isInst ? 'url(#glowGreen)' : 'url(#glowAmber)'}"/>
          <!-- Pantalla LCD Central -->
          <rect x="200" y="225" width="150" height="60" rx="4" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
          <text x="275" y="250" font-family="monospace" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">NOTIFIER NFS2-3030</text>
          <text x="275" y="270" font-family="monospace" font-size="9" font-weight="bold" fill="#bae6fd" text-anchor="middle">SISTEMA CEREBRO ACTIVO</text>
          <!-- Teclado y LEDs de Lazos -->
          <rect x="215" y="305" width="120" height="40" rx="4" fill="#1e293b"/>
          <circle cx="235" cy="325" r="5" fill="#10b981"/>
          <circle cx="255" cy="325" r="5" fill="#ef4444"/>
          <circle cx="275" cy="325" r="5" fill="#f59e0b"/>
          <circle cx="295" cy="325" r="5" fill="#3b82f6"/>
          <!-- Rótulo de Identificación -->
          <rect x="195" y="380" width="160" height="26" rx="5" fill="${col}"/>
          <text x="275" y="397" font-family="'Outfit', sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">${facp.code}</text>
        </g>
      `;
    }

    // Tubería de salida hacia Riser en Piso 1
    if (AppState.filters.tuberia) {
      svgContent += `
        <line x1="370" y1="310" x2="440" y2="310" stroke="#10b981" stroke-width="8" stroke-linecap="round"/>
        <line x1="370" y1="310" x2="440" y2="310" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
        <rect x="390" y="295" width="40" height="14" rx="3" fill="#ffffff" stroke="#10b981" stroke-width="1"/>
        <text x="410" y="305" font-family="monospace" font-size="8" font-weight="bold" fill="#10b981" text-anchor="middle">TUB-RIS</text>
      `;
    }
  }

  // ------------------------------------------------------------------------
  // PISO 0: SÓTANO / PARQUEADEROS & CUARTO DE BOMBAS
  // ------------------------------------------------------------------------
  else if (floor.type === 'parqueaderos') {
    svgContent += `
      <rect x="50" y="50" width="900" height="550" fill="#f8fafc" stroke="#334155" stroke-width="4" rx="8"/>
      
      <!-- Cuarto de Bombas Contra Incendio -->
      <rect x="80" y="80" width="360" height="490" fill="#fef2f2" stroke="#dc2626" stroke-width="2.5" rx="6"/>
      <text x="260" y="115" font-family="'Outfit', sans-serif" font-size="15" font-weight="800" fill="#991b1b" text-anchor="middle">CUARTO DE BOMBAS CONTRA INCENDIO</text>
      
      <!-- Bomba Principal Eléctrica -->
      <circle cx="200" cy="240" r="45" fill="#ef4444" stroke="#991b1b" stroke-width="3"/>
      <text x="200" y="245" font-family="'Outfit', sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">BOMBA 500 GPM</text>
      
      <!-- Bomba Jockey -->
      <circle cx="320" cy="240" r="25" fill="#f97316" stroke="#c2410c" stroke-width="2"/>
      <text x="320" y="244" font-family="'Outfit', sans-serif" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">JOCKEY</text>

      <!-- Bahías de Estacionamiento -->
      <rect x="470" y="80" width="450" height="490" fill="#ffffff" stroke="#94a3b8" stroke-width="2" rx="6"/>
      <text x="695" y="115" font-family="'Outfit', sans-serif" font-size="15" font-weight="800" fill="#475569" text-anchor="middle">BAHÍAS DE ESTACIONAMIENTO P01 - P08</text>
      
      <!-- Columnas estructurales -->
      ${[530, 670, 810].map(x => `
        <rect x="${x}" y="200" width="30" height="30" fill="#64748b" rx="4"/>
        <rect x="${x}" y="380" width="30" height="30" fill="#64748b" rx="4"/>
      `).join('')}
    `;
  }

  // ------------------------------------------------------------------------
  // PISOS 2 AL 6: OFICINAS CORPORATIVAS
  // ------------------------------------------------------------------------
  else if (floor.type === 'oficinas') {
    svgContent += `
      <!-- Muros Perimetrales Oficinas -->
      <rect x="50" y="50" width="900" height="550" fill="#ffffff" stroke="#1e293b" stroke-width="4" rx="8"/>
      
      <!-- Pasillo Central -->
      <rect x="60" y="270" width="880" height="110" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <text x="500" y="332" font-family="'Outfit', sans-serif" font-size="14" font-weight="800" fill="#94a3b8" letter-spacing="3" text-anchor="middle">CIRCULACIÓN GENERAL & ÁREAS COMUNES</text>

      <!-- Oficinas Superiores -->
      <rect x="80" y="70" width="240" height="180" fill="#ffffff" stroke="#94a3b8" stroke-width="2" rx="6"/>
      <text x="200" y="100" font-family="'Outfit', sans-serif" font-size="12" font-weight="800" fill="#475569" text-anchor="middle">SALA DE JUNTAS DIRECTIVA</text>

      <rect x="360" y="70" width="280" height="180" fill="#ffffff" stroke="#94a3b8" stroke-width="2" rx="6"/>
      <text x="500" y="100" font-family="'Outfit', sans-serif" font-size="12" font-weight="800" fill="#475569" text-anchor="middle">OPEN SPACE CORPORATIVO</text>

      <rect x="680" y="70" width="240" height="180" fill="#ffffff" stroke="#94a3b8" stroke-width="2" rx="6"/>
      <text x="800" y="100" font-family="'Outfit', sans-serif" font-size="12" font-weight="800" fill="#475569" text-anchor="middle">SITE DE TELECOMUNICACIONES</text>

      <!-- Oficinas Inferiores -->
      <rect x="80" y="400" width="380" height="180" fill="#ffffff" stroke="#94a3b8" stroke-width="2" rx="6"/>
      <text x="270" y="430" font-family="'Outfit', sans-serif" font-size="12" font-weight="800" fill="#475569" text-anchor="middle">OFICINAS DE GERENCIA Y PROYECTOS</text>

      <rect x="500" y="400" width="420" height="180" fill="#ffffff" stroke="#94a3b8" stroke-width="2" rx="6"/>
      <text x="710" y="430" font-family="'Outfit', sans-serif" font-size="12" font-weight="800" fill="#475569" text-anchor="middle">ÁREA ADMINISTRATIVA Y SERVICIOS</text>
    `;
  }

  // ------------------------------------------------------------------------
  // PISOS 7 AL 33: HABITACIONES RESIDENCIALES (8 HABITACIONES POR PISO)
  // ------------------------------------------------------------------------
  else {
    svgContent += `
      <!-- Muros Perimetrales del Edificio -->
      <rect x="50" y="50" width="900" height="550" fill="#ffffff" stroke="#1e293b" stroke-width="4" rx="10"/>

      <!-- Pasillo Central Principal -->
      <rect x="60" y="270" width="880" height="110" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <text x="500" y="332" font-family="'Outfit', sans-serif" font-size="14" font-weight="800" fill="#94a3b8" letter-spacing="4" text-anchor="middle">PASILLO DE CIRCULACIÓN PRINCIPAL</text>

      <!-- Ducto Vertical Riser Eléctrico / Contra Incendio -->
      <rect x="470" y="280" width="60" height="90" rx="4" fill="#e0f2fe" stroke="#0077b6" stroke-width="2"/>
      <text x="500" y="325" font-family="monospace" font-size="9" font-weight="bold" fill="#0077b6" text-anchor="middle">RISER</text>
      <text x="500" y="340" font-family="monospace" font-size="8" fill="#0284c7" text-anchor="middle">P0-P33</text>

      <!-- Escaleras de Emergencia Cortafuegos -->
      <rect x="60" y="275" width="45" height="100" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5" rx="4"/>
      <text x="82" y="330" font-family="'Outfit', sans-serif" font-size="9" font-weight="bold" fill="#dc2626" text-anchor="middle">ESC 1</text>

      <rect x="895" y="275" width="45" height="100" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5" rx="4"/>
      <text x="917" y="330" font-family="'Outfit', sans-serif" font-size="9" font-weight="bold" fill="#dc2626" text-anchor="middle">ESC 2</text>
    `;

    // 4 Habitaciones Superiores: Habitación 1 a 4
    const topRooms = [
      { num: 1, x: 60, y: 60, w: 200, h: 200 },
      { num: 2, x: 280, y: 60, w: 200, h: 200 },
      { num: 3, x: 520, y: 60, w: 200, h: 200 },
      { num: 4, x: 740, y: 60, w: 200, h: 200 },
    ];

    topRooms.forEach(r => {
      svgContent += `
        <rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="#ffffff" stroke="#94a3b8" stroke-width="2" rx="6"/>
        <text x="${r.x + 15}" y="${r.y + 25}" font-family="'Outfit', sans-serif" font-size="12" font-weight="800" fill="#475569">Habitación ${AppState.selectedFloor}0${r.num}</text>
        <!-- Puerta batiente -->
        <line x1="${r.x + 80}" y1="${r.y + r.h}" x2="${r.x + 120}" y2="${r.y + r.h}" stroke="#ffffff" stroke-width="4"/>
        <path d="M ${r.x + 80} ${r.y + r.h} A 30 30 0 0 1 ${r.x + 110} ${r.y + r.h - 25}" fill="none" stroke="#cbd5e1" stroke-dasharray="2 2"/>
      `;
    });

    // 4 Habitaciones Inferiores: Habitación 5 a 8
    const bottomRooms = [
      { num: 5, x: 60, y: 390, w: 200, h: 200 },
      { num: 6, x: 280, y: 390, w: 200, h: 200 },
      { num: 7, x: 520, y: 390, w: 200, h: 200 },
      { num: 8, x: 740, y: 390, w: 200, h: 200 },
    ];

    bottomRooms.forEach(r => {
      svgContent += `
        <rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="#ffffff" stroke="#94a3b8" stroke-width="2" rx="6"/>
        <text x="${r.x + 15}" y="${r.y + 25}" font-family="'Outfit', sans-serif" font-size="12" font-weight="800" fill="#475569">Habitación ${AppState.selectedFloor}0${r.num}</text>
        <!-- Puerta -->
        <line x1="${r.x + 80}" y1="${r.y}" x2="${r.x + 120}" y2="${r.y}" stroke="#ffffff" stroke-width="4"/>
        <path d="M ${r.x + 80} ${r.y} A 30 30 0 0 0 ${r.x + 110} ${r.y + 25}" fill="none" stroke="#cbd5e1" stroke-dasharray="2 2"/>
      `;
    });
  }

  // ------------------------------------------------------------------------
  // TRAZADO DE REDES: TUBERÍA CONDUIT EMT VS CABLEADO FPLR (ÍTEMS INDEPENDIENTES)
  // ------------------------------------------------------------------------
  const pipeCoordinates = [
    { s: 1, x1: 110, y1: 310, x2: 240, y2: 310, branchX: 160, branchY: 160 },
    { s: 2, x1: 240, y1: 310, x2: 380, y2: 310, branchX: 380, branchY: 160 },
    { s: 3, x1: 380, y1: 310, x2: 500, y2: 310, branchX: 160, branchY: 490 },
    { s: 4, x1: 500, y1: 310, x2: 620, y2: 310, branchX: 380, branchY: 490 },
    { s: 5, x1: 620, y1: 310, x2: 760, y2: 310, branchX: 620, branchY: 160 },
    { s: 6, x1: 760, y1: 310, x2: 890, y2: 310, branchX: 840, branchY: 160 },
  ];

  // 1. CAPA DE TUBERÍA CONDUIT EMT (Azul técnico si pendiente, Verde esmeralda si instalado)
  if (AppState.filters.tuberia && floor.type !== 'cerebro') {
    pipeCoordinates.forEach(seg => {
      const item = floor.items.find(i => i.id === `TUB-P${AppState.selectedFloor}-S0${seg.s}`);
      if (!item) return;

      const isInst = item.status === 'installed';
      const col = isInst ? '#10b981' : '#2563eb'; // Verde si instalado, Azul técnico si pendiente

      svgContent += `
        <!-- Tubería Tramo ${seg.s} -->
        <g class="svg-interactive-item" onclick="window.onSvgItemClick('${item.id}')">
          <!-- Tramo principal en pasillo (offset y=310) -->
          <line x1="${seg.x1}" y1="${seg.y1}" x2="${seg.x2}" y2="${seg.y2}" 
                stroke="${col}" stroke-width="7" stroke-linecap="round"/>
          <line x1="${seg.x1}" y1="${seg.y1}" x2="${seg.x2}" y2="${seg.y2}" 
                stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
          
          <!-- Derivación de tubería hacia habitación -->
          <line x1="${seg.x1 + 30}" y1="${seg.y1}" x2="${seg.branchX}" y2="${seg.branchY}" 
                stroke="${col}" stroke-width="5" stroke-linecap="round"/>

          <!-- Cajas de paso condulet 4x4 cuadradas -->
          <rect x="${seg.x1 - 6}" y="${seg.y1 - 6}" width="12" height="12" rx="2" fill="${col}" stroke="#1e293b" stroke-width="1.5"/>
          <rect x="${seg.x2 - 6}" y="${seg.y2 - 6}" width="12" height="12" rx="2" fill="${col}" stroke="#1e293b" stroke-width="1.5"/>

          <!-- Etiqueta del tramo de tubería -->
          <rect x="${(seg.x1 + seg.x2) / 2 - 25}" y="${seg.y1 - 22}" width="50" height="14" rx="3" fill="#ffffff" stroke="${col}" stroke-width="1.5"/>
          <text x="${(seg.x1 + seg.x2) / 2}" y="${seg.y1 - 12}" font-family="monospace" font-size="8" font-weight="bold" fill="${col}" text-anchor="middle">TUB-S${seg.s}</text>
        </g>
      `;
    });
  }

  // 2. CAPA DE CABLEADO FPLR (Rojo fuego si pendiente, Verde esmeralda si instalado)
  if (AppState.filters.cableado && floor.type !== 'cerebro') {
    pipeCoordinates.forEach(seg => {
      const item = floor.items.find(i => i.id === `CAB-P${AppState.selectedFloor}-S0${seg.s}`);
      if (!item) return;

      const isInst = item.status === 'installed';
      const col = isInst ? '#10b981' : '#dc2626'; // Verde si instalado, Rojo fuego si pendiente

      svgContent += `
        <!-- Cableado Tramo ${seg.s} -->
        <g class="svg-interactive-item" onclick="window.onSvgItemClick('${item.id}')">
          <!-- Línea paralela de cable (offset y=326) -->
          <line x1="${seg.x1}" y1="${seg.y1 + 16}" x2="${seg.x2}" y2="${seg.y2 + 16}" 
                stroke="${col}" stroke-width="4" stroke-dasharray="${isInst ? 'none' : '6 3'}" stroke-linecap="round"/>
          
          <line x1="${seg.x1 + 30}" y1="${seg.y1 + 16}" x2="${seg.branchX + 5}" y2="${seg.branchY + 5}" 
                stroke="${col}" stroke-width="3" stroke-dasharray="${isInst ? 'none' : '4 3'}"/>

          <!-- Marcador de cable -->
          <circle cx="${(seg.x1 + seg.x2) / 2}" cy="${seg.y1 + 16}" r="5" fill="${col}" stroke="#ffffff" stroke-width="1.5"/>
          <text x="${(seg.x1 + seg.x2) / 2}" y="${seg.y1 + 32}" font-family="monospace" font-size="7.5" font-weight="bold" fill="${col}" text-anchor="middle">CAB-S${seg.s}</text>
        </g>
      `;
    });
  }

  // ------------------------------------------------------------------------
  // CAPA DE DISPOSITIVOS DE DETECCIÓN Y ALARMA (NFPA 72)
  // ------------------------------------------------------------------------

  // 3. Detectores Autónomos en Habitaciones
  if (AppState.filters.detectores && floor.type === 'habitaciones') {
    const detectorCoords = [
      { r: 1, x: 160, y: 160 },
      { r: 2, x: 380, y: 160 },
      { r: 3, x: 620, y: 160 },
      { r: 4, x: 840, y: 160 },
      { r: 5, x: 160, y: 490 },
      { r: 6, x: 380, y: 490 },
      { r: 7, x: 620, y: 490 },
      { r: 8, x: 840, y: 490 },
    ];

    detectorCoords.forEach(d => {
      const item = floor.items.find(i => i.id === `DET-P${AppState.selectedFloor}-${d.r}`);
      if (!item) return;

      const isInst = item.status === 'installed';
      const col = isInst ? '#10b981' : '#f59e0b'; // Verde si instalado, Ámbar si pendiente

      svgContent += `
        <!-- Detector Habitación ${d.r} -->
        <g class="svg-interactive-item" onclick="window.onSvgItemClick('${item.id}')">
          <!-- Radio de Cobertura -->
          <circle cx="${d.x}" cy="${d.y}" r="38" fill="${col}" opacity="0.12"/>
          <!-- Base del Detector -->
          <circle cx="${d.x}" cy="${d.y}" r="18" fill="#ffffff" stroke="${col}" stroke-width="3" filter="${isInst ? 'url(#glowGreen)' : 'url(#glowAmber)'}"/>
          <!-- Cámara Óptica -->
          <circle cx="${d.x}" cy="${d.y}" r="8" fill="${col}"/>
          <text x="${d.x}" y="${d.y + 3}" font-family="'Outfit', sans-serif" font-size="8" font-weight="900" fill="#ffffff" text-anchor="middle">D</text>
          
          <!-- Rótulo del Detector -->
          <rect x="${d.x - 38}" y="${d.y + 24}" width="76" height="15" rx="3" fill="#ffffff" stroke="${col}" stroke-width="1"/>
          <text x="${d.x}" y="${d.y + 35}" font-family="monospace" font-size="8" font-weight="bold" fill="#0f172a" text-anchor="middle">H-${AppState.selectedFloor}0${d.r}</text>
        </g>
      `;
    });
  }

  // 4. Sirenas Estroboscópicas en Pasillo
  if (AppState.filters.sirenas && floor.type === 'habitaciones') {
    const strobeCoords = [
      { s: 1, x: 260, y: 310 },
      { s: 2, x: 740, y: 310 }
    ];

    strobeCoords.forEach(s => {
      const item = floor.items.find(i => i.id === `SIR-P${AppState.selectedFloor}-${s.s}`);
      if (!item) return;

      const isInst = item.status === 'installed';
      const col = isInst ? '#10b981' : '#f59e0b';

      svgContent += `
        <!-- Sirena Estrobo ${s.s} -->
        <g class="svg-interactive-item" onclick="window.onSvgItemClick('${item.id}')">
          <polygon points="${s.x-14},${s.y+12} ${s.x+14},${s.y+12} ${s.x},${s.y-14}" fill="#ffffff" stroke="${col}" stroke-width="3" filter="${isInst ? 'url(#glowGreen)' : 'url(#glowAmber)'}"/>
          <circle cx="${s.x}" cy="${s.y+2}" r="5" fill="${col}"/>
          <text x="${s.x}" y="${s.y - 18}" font-family="'Outfit', sans-serif" font-size="8.5" font-weight="800" fill="${col}" text-anchor="middle">SIRENA</text>
        </g>
      `;
    });
  }

  // 5. Palancas / Estaciones Manuales de Emergencia en accesos
  if (AppState.filters.palancas && floor.type === 'habitaciones') {
    const item = floor.items.find(i => i.id === `PAL-P${AppState.selectedFloor}-01`);
    if (item) {
      const isInst = item.status === 'installed';
      const col = isInst ? '#10b981' : '#f59e0b';
      const px = 105;
      const py = 325;

      svgContent += `
        <!-- Palanca Manual Escalera 1 -->
        <g class="svg-interactive-item" onclick="window.onSvgItemClick('${item.id}')">
          <rect x="${px - 12}" y="${py - 12}" width="24" height="24" rx="4" fill="#ffffff" stroke="${col}" stroke-width="3" filter="${isInst ? 'url(#glowGreen)' : 'url(#glowAmber)'}"/>
          <rect x="${px - 7}" y="${py - 7}" width="14" height="14" rx="2" fill="${col}"/>
          <text x="${px}" y="${py + 4}" font-family="'Outfit', sans-serif" font-size="9" font-weight="900" fill="#ffffff" text-anchor="middle">M</text>
          <text x="${px}" y="${py + 24}" font-family="'Outfit', sans-serif" font-size="8" font-weight="bold" fill="${col}" text-anchor="middle">PALANCA</text>
        </g>
      `;
    }
  }

  container.innerHTML = `
    <svg id="blueprint-main-svg" class="blueprint-svg" viewBox="0 0 1000 650" width="1000" height="650" xmlns="http://www.w3.org/2000/svg">
      ${svgContent}
    </svg>
  `;
  applyBlueprintTransform();
}

// Aplicar transformaciones de Zoom y Pan
function applyBlueprintTransform() {
  const svg = document.getElementById('blueprint-main-svg');
  if (svg) {
    const zoom = (typeof AppState.zoomLevel === 'number' && !isNaN(AppState.zoomLevel)) ? AppState.zoomLevel : 1;
    const px = (typeof AppState.panX === 'number' && !isNaN(AppState.panX)) ? AppState.panX : 0;
    const py = (typeof AppState.panY === 'number' && !isNaN(AppState.panY)) ? AppState.panY : 0;
    svg.style.transform = `translate(${px}px, ${py}px) scale(${zoom})`;
  }
}

// Arrastre interactivo y Rueda de ratón del plano
function initBlueprintPanAndZoom() {
  const container = document.getElementById('blueprint-canvas-container');
  if (!container) return;

  let isDragging = false;
  let startX = 0;
  let startY = 0;

  container.addEventListener('mousedown', (e) => {
    if (e.target.closest('.svg-interactive-item')) return;
    isDragging = true;
    container.classList.add('is-dragging');
    startX = e.clientX - AppState.panX;
    startY = e.clientY - AppState.panY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    AppState.panX = e.clientX - startX;
    AppState.panY = e.clientY - startY;
    applyBlueprintTransform();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    container.classList.remove('is-dragging');
  });

  // Zoom suave con rueda de ratón (Mouse Wheel)
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    AppState.zoomLevel = Math.min(Math.max(AppState.zoomLevel + delta, 0.55), 2.5);
    applyBlueprintTransform();
  }, { passive: false });
}

// Handler global expuesto para los elementos clicables del SVG
window.onSvgItemClick = function(itemId) {
  const floor = AppState.database.floors[AppState.selectedFloor];
  if (!floor) return;

  const item = floor.items.find(i => i.id === itemId);
  if (item) {
    openItemModal(item);
  }
};

// ==========================================================================
// MODAL DE DETALLE Y REGISTRO DE INSTALACIÓN (FICHA TÉCNICA Y FOTOS)
// ==========================================================================
function openItemModal(item) {
  AppState.selectedItemForModal = item;

  document.getElementById('modal-item-code').textContent = item.code;
  document.getElementById('modal-item-name').textContent = item.name;
  document.getElementById('modal-item-type').textContent = item.type.toUpperCase();
  document.getElementById('modal-item-model').textContent = item.model;
  document.getElementById('modal-item-zone').textContent = item.zone;
  document.getElementById('modal-item-quantity').textContent = `${item.quantity} ${item.unit}`;

  const isUserAdmin = isAdmin();

  // Banner explicativo según rol
  const roleBanner = document.getElementById('modal-role-banner');
  if (roleBanner) {
    if (isUserAdmin) {
      roleBanner.className = 'modal-role-banner admin';
      roleBanner.innerHTML = `
        <span class="role-icon">🛡️</span>
        <div>
          <strong>Modo Edición Autorizada (Administrador de Obra)</strong>
          <p>Tiene permisos de control técnico para actualizar estados de instalación, certificar fechas y cuadrillas, y registrar evidencias fotográficas in situ.</p>
        </div>
      `;
    } else {
      roleBanner.className = 'modal-role-banner public';
      roleBanner.innerHTML = `
        <span class="role-icon">👁️</span>
        <div>
          <strong>Modo Consulta Pública (Solo Lectura)</strong>
          <p>Visualización de especificaciones técnicas y trazabilidad. El registro de avances, modificación de estados y carga de evidencias requiere inicio de sesión como Administrador.</p>
        </div>
      `;
    }
  }

  // Estado
  const statusSelect = document.getElementById('modal-item-status');
  if (statusSelect) {
    statusSelect.value = item.status;
    statusSelect.disabled = !isUserAdmin;
  }

  // Fecha de Instalación (si no tiene, colocar fecha actual)
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('modal-item-date');
  if (dateInput) {
    dateInput.value = item.installDate || today;
    dateInput.disabled = !isUserAdmin;
  }

  // Técnico
  const techInput = document.getElementById('modal-item-tech');
  if (techInput) {
    techInput.value = item.technician || 'Cuadrilla de Instalación GSIT';
    techInput.disabled = !isUserAdmin;
  }

  // Notas de campo
  const notesInput = document.getElementById('modal-item-notes');
  if (notesInput) {
    notesInput.value = item.notes || '';
    notesInput.disabled = !isUserAdmin;
  }

  // Controles de carga de fotos
  const photoUploadControls = document.getElementById('modal-photo-upload-controls');
  if (photoUploadControls) {
    photoUploadControls.style.display = isUserAdmin ? 'block' : 'none';
  }

  // Botones de acción del pie de modal
  const btnSave = document.getElementById('btn-save-item-modal');
  const btnLogin = document.getElementById('btn-login-from-modal');
  const btnCancel = document.getElementById('btn-cancel-item-modal');

  if (btnSave) btnSave.style.display = isUserAdmin ? 'inline-flex' : 'none';
  if (btnLogin) btnLogin.style.display = isUserAdmin ? 'none' : 'inline-flex';
  if (btnCancel) btnCancel.textContent = isUserAdmin ? 'Cancelar' : 'Cerrar';

  // Fotos de evidencia
  renderItemModalPhotos(item);

  document.getElementById('modal-item-detail')?.classList.add('active');
}

function closeItemModal() {
  document.getElementById('modal-item-detail')?.classList.remove('active');
  AppState.selectedItemForModal = null;
}

function renderItemModalPhotos(item) {
  const container = document.getElementById('modal-photo-preview-container');
  if (!container) return;

  let photoSrc = item.photo;
  if (!photoSrc) {
    if (item.type === 'tuberia') photoSrc = 'assets/img/pipe_emt.svg';
    else if (item.type === 'cableado') photoSrc = 'assets/img/cable_fire.svg';
    else if (item.type === 'sirena') photoSrc = 'assets/img/horn_strobe.svg';
    else if (item.type === 'palanca') photoSrc = 'assets/img/pull_station.svg';
    else if (item.type === 'facp') photoSrc = 'assets/img/facp_panel.svg';
    else photoSrc = 'assets/img/smoke_detector.svg';
  }

  container.innerHTML = `
    <div class="photo-preview-card">
      <img src="${photoSrc}" alt="Evidencia Técnica">
      <div class="photo-badge-label">Evidencia de Instalación In Situ</div>
    </div>
  `;
}

function handleUserPhotoUpload(e) {
  if (!isAdmin()) {
    showToast('Acceso restringido: Solo los administradores pueden cargar fotografías de evidencia');
    return;
  }

  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    if (AppState.selectedItemForModal) {
      AppState.selectedItemForModal.photo = event.target.result;
      renderItemModalPhotos(AppState.selectedItemForModal);
      showToast('Fotografía de evidencia adjuntada correctamente');
    }
  };
  reader.readAsDataURL(file);
}

function saveItemModalChanges() {
  if (!isAdmin()) {
    showToast('Acceso denegado: Solo administradores autorizados pueden guardar cambios en obra.');
    return;
  }

  const item = AppState.selectedItemForModal;
  if (!item) return;

  const newStatus = document.getElementById('modal-item-status').value;
  const newDate = document.getElementById('modal-item-date').value;
  const newTech = document.getElementById('modal-item-tech').value;
  const newNotes = document.getElementById('modal-item-notes').value;

  item.status = newStatus;
  item.installDate = (newStatus === 'installed') ? newDate : null;
  item.technician = newTech;
  item.notes = newNotes;

  saveDatabase();
  closeItemModal();

  // Recalcular métricas, redibujar plano y actualizar interfaz
  updateUI();
  renderFloorBlueprint();
  renderFloorItemsList();

  const metrics = calculateMetrics();
  showToast(`Elemento ${item.code} actualizado a [${newStatus.toUpperCase()}] — Avance Global: ${metrics.globalPercentage}%`);
}

// ==========================================================================
// MODAL DE CORTE DE FACTURACIÓN Y ACTA FORMAL MEMBRETADA
// ==========================================================================
function switchBillingTab(tab) {
  AppState.activeBillingTab = tab;

  const tabBtnInteractive = document.getElementById('tab-btn-interactive');
  const tabBtnCertificate = document.getElementById('tab-btn-certificate');
  const viewInteractive = document.getElementById('billing-interactive-view');
  const viewCertificate = document.getElementById('billing-printable-certificate');

  if (tab === 'interactive') {
    tabBtnInteractive?.classList.add('active');
    tabBtnCertificate?.classList.remove('active');
    if (viewInteractive) viewInteractive.style.display = 'block';
    if (viewCertificate) viewCertificate.style.display = 'none';
  } else {
    tabBtnCertificate?.classList.add('active');
    tabBtnInteractive?.classList.remove('active');
    if (viewCertificate) viewCertificate.style.display = 'block';
    if (viewInteractive) viewInteractive.style.display = 'none';
  }
}
window.switchBillingTab = switchBillingTab;

function openBillingModal() {
  const today = new Date().toISOString().split('T')[0];
  const startDateInput = document.getElementById('billing-date-start');
  const endDateInput = document.getElementById('billing-date-end');

  if (startDateInput && !startDateInput.value) startDateInput.value = '2026-05-01';
  if (endDateInput && !endDateInput.value) endDateInput.value = today;

  renderBillingReport();
  switchBillingTab('interactive');
  document.getElementById('modal-billing-cutoff')?.classList.add('active');
}

function closeBillingModal() {
  document.getElementById('modal-billing-cutoff')?.classList.remove('active');
}

function renderBillingReport() {
  const startDate = document.getElementById('billing-date-start').value || '2026-05-01';
  const endDate = document.getElementById('billing-date-end').value || new Date().toISOString().split('T')[0];
  const floorFilter = document.getElementById('billing-floor-scope').value; // 'all' o número de piso

  let totalPipeMeters = 0;
  let totalCableMeters = 0;
  let totalDevicesCount = 0;
  let subtotalAmount = 0;

  const matchedItems = [];

  for (let f = 0; f <= 33; f++) {
    if (floorFilter !== 'all' && parseInt(floorFilter, 10) !== f) continue;

    const floor = AppState.database.floors[f];
    if (!floor) continue;

    floor.items.forEach(item => {
      if (item.status === 'installed' && item.installDate) {
        if (item.installDate >= startDate && item.installDate <= endDate) {
          const itemTotal = item.quantity * item.unitPrice;
          subtotalAmount += itemTotal;

          if (item.type === 'tuberia') totalPipeMeters += item.quantity;
          else if (item.type === 'cableado') totalCableMeters += item.quantity;
          else totalDevicesCount += item.quantity;

          matchedItems.push({
            ...item,
            floor: f,
            itemTotal
          });
        }
      }
    });
  }

  const ivaAmount = Math.round(subtotalAmount * 0.19);
  const grandTotal = subtotalAmount + ivaAmount;

  // 1. Actualizar Tarjetas de Resumen en Vista Interactiva
  const pipeSumEl = document.getElementById('billing-summary-pipe');
  if (pipeSumEl) pipeSumEl.textContent = `${Math.round(totalPipeMeters).toLocaleString()} m`;

  const cableSumEl = document.getElementById('billing-summary-cable');
  if (cableSumEl) cableSumEl.textContent = `${Math.round(totalCableMeters).toLocaleString()} m`;

  const devSumEl = document.getElementById('billing-summary-devices');
  if (devSumEl) devSumEl.textContent = `${Math.round(totalDevicesCount).toLocaleString()} un`;

  const totalSumEl = document.getElementById('billing-summary-total');
  if (totalSumEl) totalSumEl.textContent = `$ ${Math.round(grandTotal).toLocaleString('es-CO')}`;

  // 2. Actualizar Tabla Interactiva
  const tbody = document.getElementById('billing-table-body');
  if (tbody) {
    if (matchedItems.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:1.75rem;color:var(--text-muted);">No se encontraron ítems instalados certificados en el rango de fechas seleccionado.</td></tr>`;
    } else {
      tbody.innerHTML = matchedItems.map(item => `
        <tr>
          <td>${item.installDate}</td>
          <td><strong>${item.code}</strong></td>
          <td>${item.name}</td>
          <td>Piso ${item.floor}</td>
          <td>${item.quantity} ${item.unit}</td>
          <td>$ ${item.unitPrice.toLocaleString('es-CO')}</td>
          <td><strong>$ ${item.itemTotal.toLocaleString('es-CO')}</strong></td>
        </tr>
      `).join('');
    }
  }

  // 3. Actualizar Acta Formal Membretada (Imprimible)
  const certPeriodEl = document.getElementById('cert-period-range');
  if (certPeriodEl) certPeriodEl.textContent = `${startDate} hasta ${endDate}`;

  const certScopeEl = document.getElementById('cert-scope-floors');
  if (certScopeEl) certScopeEl.textContent = floorFilter === 'all' ? 'Todos los Niveles de la Torre (Pisos 0 al 33)' : `Exclusivo Piso ${floorFilter}`;

  const certDateEl = document.getElementById('cert-doc-date');
  if (certDateEl) certDateEl.textContent = `Fecha de Liquidación: ${endDate}`;

  const certPipeEl = document.getElementById('cert-sum-pipe');
  if (certPipeEl) certPipeEl.textContent = `${Math.round(totalPipeMeters).toLocaleString()} m`;

  const certCableEl = document.getElementById('cert-sum-cable');
  if (certCableEl) certCableEl.textContent = `${Math.round(totalCableMeters).toLocaleString()} m`;

  const certDevEl = document.getElementById('cert-sum-devices');
  if (certDevEl) certDevEl.textContent = `${Math.round(totalDevicesCount).toLocaleString()} un`;

  const certTotalEl = document.getElementById('cert-sum-total');
  if (certTotalEl) certTotalEl.textContent = `$ ${Math.round(grandTotal).toLocaleString('es-CO')}`;

  const certSubtotalEl = document.getElementById('cert-val-subtotal');
  if (certSubtotalEl) certSubtotalEl.textContent = `$ ${Math.round(subtotalAmount).toLocaleString('es-CO')}`;

  const certIvaEl = document.getElementById('cert-val-iva');
  if (certIvaEl) certIvaEl.textContent = `$ ${Math.round(ivaAmount).toLocaleString('es-CO')}`;

  const certGrandTotalEl = document.getElementById('cert-val-total');
  if (certGrandTotalEl) certGrandTotalEl.textContent = `$ ${Math.round(grandTotal).toLocaleString('es-CO')} COP`;

  const certTbody = document.getElementById('cert-items-table-body');
  if (certTbody) {
    if (matchedItems.length === 0) {
      certTbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:1.5rem;">Sin registros en el rango.</td></tr>`;
    } else {
      certTbody.innerHTML = matchedItems.map(item => `
        <tr>
          <td>${item.installDate}</td>
          <td><strong>${item.code}</strong></td>
          <td>${item.name} (${item.model})</td>
          <td>Piso ${item.floor}</td>
          <td>${item.quantity} ${item.unit}</td>
          <td>$ ${item.unitPrice.toLocaleString('es-CO')}</td>
          <td>$ ${item.itemTotal.toLocaleString('es-CO')}</td>
        </tr>
      `).join('');
    }
  }
}

// Descargar archivo CSV estructurado para Excel
function exportBillingToCSV() {
  const startDate = document.getElementById('billing-date-start').value || '2026-05-01';
  const endDate = document.getElementById('billing-date-end').value || new Date().toISOString().split('T')[0];
  const floorFilter = document.getElementById('billing-floor-scope').value;

  let csv = '\uFEFFFECHA_INSTALACION,CODIGO,DESCRIPCION_TECNICA,PISO,ZONA,CANTIDAD,UNIDAD,PRECIO_UNITARIO_COP,SUBTOTAL_COP,ESTADO\n';

  let totalItemsCount = 0;

  for (let f = 0; f <= 33; f++) {
    if (floorFilter !== 'all' && parseInt(floorFilter, 10) !== f) continue;

    const floor = AppState.database.floors[f];
    if (!floor) continue;

    floor.items.forEach(item => {
      if (item.status === 'installed' && item.installDate) {
        if (item.installDate >= startDate && item.installDate <= endDate) {
          totalItemsCount++;
          const itemTotal = item.quantity * item.unitPrice;
          csv += `"${item.installDate}","${item.code}","${item.name.replace(/"/g, '""')}","Piso ${f}","${item.zone.replace(/"/g, '""')}",${item.quantity},"${item.unit}",${item.unitPrice},${itemTotal},"Instalado & Verificado"\n`;
        }
      }
    });
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Corte_Facturacion_GSIT_${startDate}_a_${endDate}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  showToast(`Archivo CSV exportado con éxito (${totalItemsCount} registros)`);
}

// Toast Notificación
function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('active');

  setTimeout(() => {
    toast.classList.remove('active');
  }, 3400);
}
window.showToast = showToast;
