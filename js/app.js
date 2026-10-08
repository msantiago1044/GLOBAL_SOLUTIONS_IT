/**
 * GLOBAL SOLUTIONS IT - Plataforma de Gestión y Ejecución de Obras
 * Lógica Operativa, Modelo de Datos de 33 Pisos, Plano Interactivo y Corte de Facturación
 */

// Estado global de la aplicación
const AppState = {
  currentUser: null,
  activeView: 'landing', // 'landing', 'login', 'projects', 'execution'
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

// Generación inicial de la base de datos de los 33 Pisos de Torre Titanium
function generateInitialDatabase() {
  const db = {
    project: {
      id: 'torre-titanium',
      name: 'Torre Grand Titanium - 33 Pisos',
      client: 'Constructora Bolívar & Inversiones Colpatria',
      address: 'Cra 15 # 98-42, Bogotá D.C.',
      contractor: 'Global Solutions IT S.A.S.',
      systemType: 'Sistema Direccionable NFPA 72 - Notifier ONYX NFS2-3030',
      totalFloors: 34, // Pisos 0 al 33
      status: 'En Ejecución',
      startDate: '2026-04-15',
      targetDate: '2026-11-30'
    },
    floors: {}
  };

  // Creación de cada piso de 0 a 33
  for (let f = 0; f <= 33; f++) {
    let floorType = 'habitaciones';
    let floorName = `Piso ${f}`;
    let is100Percent = f <= 29; // Pisos 0 al 29 ejecutados al 100% (Da el 90.4% global)

    if (f === 0) {
      floorType = 'parqueaderos';
      floorName = 'Piso 0 - Sótano / Parqueaderos & Rociadores';
    } else if (f === 1) {
      floorType = 'cerebro';
      floorName = 'Piso 1 - Centro de Control / Cerebro FACP & Oficinas';
    } else if (f >= 2 && f <= 6) {
      floorType = 'oficinas';
      floorName = `Piso ${f} - Oficinas Corporativas & Estacionamientos`;
    } else {
      floorType = 'habitaciones';
      floorName = `Piso ${f} - Habitaciones Residenciales (${f}01 a ${f}08)`;
    }

    // Elementos del piso: Tubería, Cableado, Equipos
    const items = [];

    if (floorType === 'cerebro') {
      // PISO 1: CEREBRO DE LA OPERACIÓN
      items.push({
        id: `FACP-P1-01`,
        code: `FACP-P01-MAIN`,
        type: 'facp',
        name: 'Central Principal de Alarma Contra Incendios FACP',
        model: 'Notifier NFS2-3030 ONYX',
        zone: 'Cuarto de Control Eléctrico P1',
        status: 'installed',
        installDate: '2026-06-10',
        technician: 'Ing. Carlos Mendoza (Especialista NFPA)',
        quantity: 1,
        unit: 'Unidad',
        unitPrice: 14500000,
        photo: 'assets/img/facp_panel.svg',
        notes: 'Central principal energizada con 4 lazos SLC activos. Pruebas de lazo y lazo vertical OK.'
      });

      items.push({
        id: `BAT-P1-01`,
        code: `BAT-P01-24V`,
        type: 'equipo',
        name: 'Banco de Baterías de Respaldo 2x12V 55Ah',
        model: 'Yuasa VRLA 24VDC',
        zone: 'Gabinete FACP P1',
        status: 'installed',
        installDate: '2026-06-10',
        technician: 'Ing. Carlos Mendoza',
        quantity: 1,
        unit: 'Kit',
        unitPrice: 2800000,
        photo: 'assets/img/facp_panel.svg',
        notes: 'Autonomía de 24h supervisión + 15 min de alarma completa.'
      });
    }

    // Tramos de tubería Conduit EMT 3/4" (Ítem independiente)
    for (let s = 1; s <= 6; s++) {
      let isInstalled = is100Percent;
      if (!is100Percent) {
        // En pisos 30 a 33 algunos pendientes
        if (f === 33 && (s === 4 || s === 5 || s === 6)) isInstalled = false;
        else if (f === 32 && (s === 5 || s === 6)) isInstalled = false;
        else if (f === 31 && s === 6) isInstalled = false;
        else isInstalled = true;
      }

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
        quantity: 18.5, // 18.5 metros por tramo
        unit: 'Metros',
        unitPrice: 28500, // $28,500 COP por metro instalado con soportes
        photo: 'assets/img/pipe_emt.svg',
        notes: isInstalled ? 'Tubería fijada con abrazaderas tipo riel cada 1.5m con coplas de compresión.' : 'Trazado marcado en losa. Pendiente perforación y montaje de soportes.'
      });
    }

    // Tramos de Cableado FPLR 2x16 AWG Contra Incendio (Ítem independiente de la tubería)
    for (let c = 1; c <= 6; c++) {
      let isInstalled = is100Percent;
      if (!is100Percent) {
        if (f === 33 && (c >= 3)) isInstalled = false;
        else if (f === 32 && (c >= 4)) isInstalled = false;
        else if (f === 31 && (c >= 5)) isInstalled = false;
        else if (f === 30 && c === 6) isInstalled = false;
        else isInstalled = true;
      }

      items.push({
        id: `CAB-P${f}-S0${c}`,
        code: `CAB-P${f}-SLC-0${c}`,
        type: 'cableado',
        name: `Cable Blindado FPLR 2x16 AWG Tramo ${c}`,
        model: 'Cable Detección de Incendio FPLR Rojo UL 1424',
        zone: `Pasillo Distribución Tramo ${c}`,
        status: isInstalled ? 'installed' : 'pending',
        installDate: isInstalled ? `2026-08-${15 + (c % 12)}` : null,
        technician: isInstalled ? 'Cuadrilla 1 - Cableado (J. Morales)' : 'Pendiente Asignación',
        quantity: 26.0, // 26 metros por tramo
        unit: 'Metros',
        unitPrice: 19800, // $19,800 COP por metro tirado y rotulado
        photo: 'assets/img/cable_fire.svg',
        notes: isInstalled ? 'Cable peinado en caja de paso, continuidad y aislamiento comprobados sin tierra.' : 'Tubería lista pero cable aún no tirado en ducto.'
      });
    }

    // Dispositivos según tipo de piso
    if (floorType === 'habitaciones') {
      // 8 Habitaciones en cada piso con detectores autónomos
      for (let r = 1; r <= 8; r++) {
        let isInstalled = is100Percent;
        if (!is100Percent) {
          if (f === 33 && (r === 6 || r === 7 || r === 8)) isInstalled = false;
          else if (f === 32 && (r === 7 || r === 8)) isInstalled = false;
          else if (f === 31 && r === 8) isInstalled = false;
          else isInstalled = true;
        }

        items.push({
          id: `DET-P${f}-${r}`,
          code: `DET-HAB-${f}0${r}`,
          type: 'detector-autonomo',
          name: `Detector de Humo Autónomo / Habitación ${f}0${r}`,
          model: 'Detector Fotoeléctrico Direccionable FSP-851',
          zone: `Interior Habitación ${f}0${r}`,
          status: isInstalled ? 'installed' : 'pending',
          installDate: isInstalled ? `2026-09-${05 + (r % 10)}` : null,
          technician: isInstalled ? 'Cuadrilla 3 - Dispositivos (A. Herrera)' : 'Pendiente Asignación',
          quantity: 1,
          unit: 'Unidad',
          unitPrice: 245000,
          photo: 'assets/img/smoke_detector.svg',
          notes: isInstalled ? 'Montado en caja octagonal sobre cielo falso acústico, base B210LP.' : 'Caja octagonal lista. Falta colocar base y cabeza de sensor.'
        });
      }

      // 2 Sirenas Estroboscópicas en Pasillo
      for (let s = 1; s <= 2; s++) {
        let isInstalled = is100Percent || (f <= 31);
        items.push({
          id: `SIR-P${f}-${s}`,
          code: `SIR-PAS-P${f}-0${s}`,
          type: 'sirena',
          name: `Sirena con Luz Estroboscópica Pasillo ${s}`,
          model: 'System Sensor P2RL SpectrAlert Advance',
          zone: `Pasillo Principal Sector ${s === 1 ? 'Norte' : 'Sur'}`,
          status: isInstalled ? 'installed' : 'pending',
          installDate: isInstalled ? `2026-09-02` : null,
          technician: isInstalled ? 'Cuadrilla 3 - Dispositivos' : 'Pendiente Asignación',
          quantity: 1,
          unit: 'Unidad',
          unitPrice: 280000,
          photo: 'assets/img/horn_strobe.svg',
          notes: isInstalled ? 'Configurada a 15/75 candelas según norma NFPA 72 en pasillo.' : 'Pendiente montaje de dispositivo.'
        });
      }

      // 2 Palancas / Estaciones Manuales de Emergencia en accesos
      for (let p = 1; p <= 2; p++) {
        let isInstalled = is100Percent || (f <= 32);
        items.push({
          id: `PAL-P${f}-${p}`,
          code: `EM-ESC-P${f}-0${p}`,
          type: 'palanca',
          name: `Estación Manual de Emergencia / Salida Escalera ${p}`,
          model: 'Notifier NBG-12LX Doble Acción Direccionable',
          zone: `Acceso Escalera de Emergencia ${p}`,
          status: isInstalled ? 'installed' : 'pending',
          installDate: isInstalled ? `2026-09-03` : null,
          technician: isInstalled ? 'Cuadrilla 3 - Dispositivos' : 'Pendiente Asignación',
          quantity: 1,
          unit: 'Unidad',
          unitPrice: 220000,
          photo: 'assets/img/pull_station.svg',
          notes: isInstalled ? 'Montada a 1.20m sobre nivel de piso terminado conforme a norma.' : 'Caja metálica instalada, pendiente colocación de palanca.'
        });
      }

    } else {
      // Oficinas o Parqueaderos (Pisos 0, 2-6)
      // Detectores en áreas abiertas
      for (let d = 1; d <= 6; d++) {
        items.push({
          id: `DET-P${f}-${d}`,
          code: `DET-AREA-P${f}-0${d}`,
          type: 'detector-doble',
          name: floorType === 'parqueaderos' ? `Detector Térmico / Humo Sótano ${d}` : `Detector Óptico Oficina P${f}-0${d}`,
          model: 'Notifier FST-851 / FSP-851 Direccionable',
          zone: floorType === 'parqueaderos' ? `Área Parqueadero Bahía ${d}` : `Zona de Trabajo Abierta P${f}`,
          status: 'installed',
          installDate: '2026-07-20',
          technician: 'Cuadrilla 3 - Dispositivos',
          quantity: 1,
          unit: 'Unidad',
          unitPrice: 260000,
          photo: 'assets/img/smoke_detector.svg',
          notes: 'Detector ensayado con aerosol de prueba y supervisado en lazo.'
        });
      }

      items.push({
        id: `SIR-P${f}-01`,
        code: `SIR-P${f}-01`,
        type: 'sirena',
        name: `Sirena-Estrobo Industrial P${f}`,
        model: 'System Sensor P2RL Alta Potencia',
        zone: `Acceso Principal P${f}`,
        status: 'installed',
        installDate: '2026-07-22',
        technician: 'Cuadrilla 3 - Dispositivos',
        quantity: 1,
        unit: 'Unidad',
        unitPrice: 280000,
        photo: 'assets/img/horn_strobe.svg',
        notes: 'Verificada intensidad lumínica y señal acústica 88dBA.'
      });

      items.push({
        id: `PAL-P${f}-01`,
        code: `EM-P${f}-01`,
        type: 'palanca',
        name: `Estación Manual Salida P${f}`,
        model: 'Notifier NBG-12LX',
        zone: `Puerta Evacuación P${f}`,
        status: 'installed',
        installDate: '2026-07-22',
        technician: 'Cuadrilla 3 - Dispositivos',
        quantity: 1,
        unit: 'Unidad',
        unitPrice: 220000,
        photo: 'assets/img/pull_station.svg',
        notes: 'Instalación certificada.'
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

// Cargar o inicializar la base de datos desde localStorage
function loadDatabase() {
  const stored = localStorage.getItem('gsit_database_v1');
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
  localStorage.setItem('gsit_database_v1', JSON.stringify(AppState.database));
}

// Cálculo de estadísticas globales y por piso
function calculateMetrics() {
  let totalItems = 0;
  let installedItems = 0;
  let totalPipeMeters = 0;
  let installedPipeMeters = 0;
  let totalCableMeters = 0;
  let installedCableMeters = 0;
  let totalDevices = 0;
  let installedDevices = 0;

  for (let f = 0; f <= 33; f++) {
    const floor = AppState.database.floors[f];
    if (!floor) continue;

    floor.items.forEach(item => {
      totalItems++;
      const isInst = item.status === 'installed';
      if (isInst) installedItems++;

      if (item.type === 'tuberia') {
        totalPipeMeters += item.quantity;
        if (isInst) installedPipeMeters += item.quantity;
      } else if (item.type === 'cableado') {
        totalCableMeters += item.quantity;
        if (isInst) installedCableMeters += item.quantity;
      } else {
        totalDevices += item.quantity;
        if (isInst) installedDevices += item.quantity;
      }
    });
  }

  const globalPercentage = ((installedItems / totalItems) * 100).toFixed(1);

  // Métricas del piso actual seleccionado
  const currentFloor = AppState.database.floors[AppState.selectedFloor];
  let floorTotal = 0;
  let floorInstalled = 0;
  if (currentFloor) {
    currentFloor.items.forEach(item => {
      floorTotal++;
      if (item.status === 'installed') floorInstalled++;
    });
  }
  const floorPercentage = floorTotal > 0 ? ((floorInstalled / floorTotal) * 100).toFixed(1) : 100;

  return {
    globalPercentage,
    totalItems,
    installedItems,
    totalPipeMeters: Math.round(totalPipeMeters),
    installedPipeMeters: Math.round(installedPipeMeters),
    totalCableMeters: Math.round(totalCableMeters),
    installedCableMeters: Math.round(installedCableMeters),
    totalDevices,
    installedDevices,
    floorPercentage,
    floorTotal,
    floorInstalled
  };
}

// Inicialización de la Interfaz
document.addEventListener('DOMContentLoaded', () => {
  loadDatabase();
  initRouting();
  initEventListeners();
  updateUI();
});

// Enrutador sencillo para vistas SPA
function initRouting() {
  // Comprobar si hay sesión guardada
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
    renderFloorBlueprint();
    renderFloorItemsList();
  }
}

// Configuración de escuchadores de eventos
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

  document.getElementById('btn-fill-demo-creds')?.addEventListener('click', () => {
    document.getElementById('login-username').value = 'admin';
    document.getElementById('login-password').value = 'admin';
    showToast('Credenciales admin / admin cargadas');
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
    AppState.zoomLevel = Math.min(AppState.zoomLevel + 0.15, 2.5);
    applyBlueprintTransform();
  });

  document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
    AppState.zoomLevel = Math.max(AppState.zoomLevel - 0.15, 0.6);
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

  // Arrastre (Pan) del Plano
  initBlueprintPan();
}

function handleLogin(e) {
  e.preventDefault();
  const u = document.getElementById('login-username').value.trim();
  const p = document.getElementById('login-password').value.trim();

  if (u === 'admin' && p === 'admin') {
    AppState.currentUser = 'admin';
    localStorage.setItem('gsit_auth_user', 'admin');
    closeLoginModal();
    showToast('Bienvenido, Administrador de Operaciones GSIT');
    showView('execution');
  } else {
    showToast('Credenciales incorrectas. Usa admin / admin');
    const box = document.getElementById('login-card-box');
    box?.classList.add('shake');
    setTimeout(() => box?.classList.remove('shake'), 400);
  }
}

function handleLogout() {
  localStorage.removeItem('gsit_auth_user');
  AppState.currentUser = null;
  showToast('Sesión cerrada');
  showView('landing');
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

  // Actualizar selector desplegable
  const dropdown = document.getElementById('floor-selector-dropdown');
  if (dropdown) dropdown.value = floorNum;

  // Actualizar chips de pisos
  document.querySelectorAll('.floor-chip').forEach(chip => {
    chip.classList.toggle('active', parseInt(chip.dataset.floor, 10) === floorNum);
  });

  updateUI();
  renderFloorBlueprint();
  renderFloorItemsList();
}

// Actualizar toda la interfaz de usuario
function updateUI() {
  const metrics = calculateMetrics();

  // Actualizar barras de porcentaje y textos globales
  document.querySelectorAll('.global-progress-value').forEach(el => {
    el.textContent = `${metrics.globalPercentage}%`;
  });
  document.querySelectorAll('.global-progress-fill').forEach(el => {
    el.style.width = `${metrics.globalPercentage}%`;
  });

  // Métricas del panel lateral
  const pipeEl = document.getElementById('metric-pipe-meters');
  if (pipeEl) pipeEl.textContent = `${metrics.installedPipeMeters.toLocaleString()} m`;

  const cableEl = document.getElementById('metric-cable-meters');
  if (cableEl) cableEl.textContent = `${metrics.installedCableMeters.toLocaleString()} m`;

  const devEl = document.getElementById('metric-devices-count');
  if (devEl) devEl.textContent = `${metrics.installedDevices} un`;

  // Datos del piso actual en cabecera de plano
  const currentFloor = AppState.database.floors[AppState.selectedFloor];
  const floorTitleEl = document.getElementById('blueprint-current-floor-title');
  if (floorTitleEl && currentFloor) {
    floorTitleEl.textContent = currentFloor.name;
  }

  const floorTagEl = document.getElementById('blueprint-floor-status-tag');
  if (floorTagEl) {
    floorTagEl.textContent = `${metrics.floorPercentage}% Ejecutado (${metrics.floorInstalled}/${metrics.floorTotal})`;
    if (metrics.floorPercentage >= 99) {
      floorTagEl.style.backgroundColor = '#ecfdf5';
      floorTagEl.style.color = '#059669';
    } else {
      floorTagEl.style.backgroundColor = '#fffbeb';
      floorTagEl.style.color = '#b45309';
    }
  }

  // Renderizar o refrescar selector de chips de pisos
  renderFloorChips();
}

// Renderizar la barra horizontal scroller de chips de pisos
function renderFloorChips() {
  const container = document.getElementById('floor-chips-scroller');
  if (!container || container.children.length > 0) return; // solo la primera vez o si está vacío

  container.innerHTML = '';
  // De piso 33 a piso 0 descendente (como una torre de edificios)
  for (let f = 33; f >= 0; f--) {
    const floor = AppState.database.floors[f];
    let installed = 0;
    floor.items.forEach(i => { if (i.status === 'installed') installed++; });
    const pct = Math.round((installed / floor.items.length) * 100);

    const btn = document.createElement('button');
    btn.className = `floor-chip ${f === AppState.selectedFloor ? 'active' : ''} ${f === 1 ? 'brain' : ''}`;
    btn.dataset.floor = f;
    btn.innerHTML = `<strong>P${f}</strong> <span style="font-size:0.68rem;opacity:0.85;">${pct}%</span>`;
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
// RENDERIZADO DEL PLANO ARQUITECTÓNICO INTERACTIVO (SVG DE ALTA PRECISIÓN)
// ==========================================================================
function renderFloorBlueprint() {
  const svg = document.getElementById('blueprint-main-svg');
  if (!svg) return;

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
        <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#10b981"/>
      </filter>
      <filter id="glowAmber" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#f59e0b"/>
      </filter>
    </defs>
    <rect width="1000" height="650" fill="#ffffff" rx="12"/>
    <rect width="1000" height="650" fill="url(#grid)" rx="12"/>
  `;

  if (floor.type === 'cerebro') {
    // ==========================================
    // PISO 1: CENTRO DE CONTROL / CEREBRO FACP
    // ==========================================
    svgContent += `
      <!-- Muros Perimetrales Piso 1 -->
      <rect x="50" y="50" width="900" height="550" fill="#f8fafc" stroke="#334155" stroke-width="5" rx="8"/>
      
      <!-- Cuarto Técnico de Control Contra Incendios FACP (Cerebro) -->
      <rect x="80" y="80" width="400" height="490" fill="#f1f5f9" stroke="#0077b6" stroke-width="3" stroke-dasharray="8 4" rx="6"/>
      <text x="280" y="115" font-family="'Outfit', sans-serif" font-size="16" font-weight="800" fill="#004b87" text-anchor="middle">SALA DE CONTROL PRINCIPAL - FACP CEREBRO GSIT</text>
      
      <!-- Zona de Oficinas Administrativas -->
      <rect x="510" y="80" width="410" height="490" fill="#ffffff" stroke="#94a3b8" stroke-width="2" rx="6"/>
      <text x="715" y="115" font-family="'Outfit', sans-serif" font-size="16" font-weight="800" fill="#475569" text-anchor="middle">ÁREA ADMINISTRATIVA Y MONITOREO</text>
      
      <!-- Riser Vertical Troncal (Hacia los 33 pisos) -->
      <rect x="440" y="270" width="100" height="120" fill="#0284c7" opacity="0.1" stroke="#0284c7" stroke-width="2" rx="4"/>
      <text x="490" y="325" font-family="'Outfit', sans-serif" font-size="11" font-weight="800" fill="#0369a1" text-anchor="middle">DUCTO VERTICAL</text>
      <text x="490" y="342" font-family="'Outfit', sans-serif" font-size="10" font-weight="600" fill="#0369a1" text-anchor="middle">RISER PISOS 0-33</text>
    `;

    // Dibujar Panel FACP Principal en Piso 1
    const facp = floor.items.find(i => i.type === 'facp');
    if (facp && AppState.filters.facp) {
      const isInst = facp.status === 'installed';
      const col = isInst ? '#10b981' : '#f59e0b';
      svgContent += `
        <!-- Gabinete FACP -->
        <g class="svg-interactive-item" onclick="window.onSvgItemClick('${facp.id}')">
          <rect x="180" y="220" width="180" height="200" rx="10" fill="#991b1b" stroke="${col}" stroke-width="4" filter="${isInst ? 'url(#glowGreen)' : 'url(#glowAmber)'}"/>
          <rect x="195" y="240" width="150" height="60" rx="4" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
          <text x="270" y="265" font-family="monospace" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">NOTIFIER NFS2-3030</text>
          <text x="270" y="285" font-family="monospace" font-size="10" fill="#bae6fd" text-anchor="middle">CEREBRO PISO 1 ACTIVO</text>
          <!-- Teclado de comando -->
          <rect x="210" y="320" width="120" height="40" rx="4" fill="#1e293b"/>
          <circle cx="230" cy="340" r="6" fill="#10b981"/>
          <circle cx="250" cy="340" r="6" fill="#ef4444"/>
          <circle cx="270" cy="340" r="6" fill="#f59e0b"/>
          <circle cx="290" cy="340" r="6" fill="#3b82f6"/>
          <!-- Rótulo de identificación -->
          <rect x="200" y="440" width="140" height="30" rx="6" fill="${col}"/>
          <text x="270" y="460" font-family="'Outfit', sans-serif" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">${facp.code}</text>
        </g>
      `;
    }

  } else if (floor.type === 'parqueaderos') {
    // ==========================================
    // PISO 0: SÓTANO / PARQUEADEROS
    // ==========================================
    svgContent += `
      <rect x="50" y="50" width="900" height="550" fill="#f8fafc" stroke="#475569" stroke-width="4" rx="8"/>
      <text x="500" y="90" font-family="'Outfit', sans-serif" font-size="18" font-weight="800" fill="#334155" text-anchor="middle">SÓTANO - BAHÍAS DE ESTACIONAMIENTO & CUARTO DE BOMBAS</text>
      <!-- Columnas estructurales -->
      ${[180, 360, 540, 720].map(x => `
        <rect x="${x}" y="200" width="30" height="30" fill="#64748b" rx="4"/>
        <rect x="${x}" y="420" width="30" height="30" fill="#64748b" rx="4"/>
      `).join('')}
    `;

  } else {
    // ==============================================================
    // PISOS 7 AL 33: HABITACIONES RESIDENCIALES (8 HABITACIONES POR PISO)
    // O PISOS 2-6 OFICINAS
    // ==============================================================
    svgContent += `
      <!-- Muros Perimetrales del Edificio -->
      <rect x="50" y="50" width="900" height="550" fill="#ffffff" stroke="#1e293b" stroke-width="4" rx="10"/>

      <!-- Pasillo Central Principal -->
      <rect x="60" y="270" width="880" height="110" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <text x="500" y="332" font-family="'Outfit', sans-serif" font-size="15" font-weight="800" fill="#94a3b8" letter-spacing="4" text-anchor="middle">PASILLO DE CIRCULACIÓN PRINCIPAL</text>

      <!-- Ducto Vertical Riser Eléctrico / Contra Incendio -->
      <rect x="470" y="280" width="60" height="90" rx="4" fill="#e0f2fe" stroke="#0077b6" stroke-width="2"/>
      <text x="500" y="325" font-family="monospace" font-size="9" font-weight="bold" fill="#0077b6" text-anchor="middle">RISER</text>
      <text x="500" y="340" font-family="monospace" font-size="8" fill="#0284c7" text-anchor="middle">P0-P33</text>

      <!-- Escaleras de Emergencia en los extremos -->
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
        <!-- Puerta con arco batiente -->
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

  // ==========================================================================
  // TRAZADO DE REDES: TUBERÍA CONDUIT EMT VS CABLEADO FPLR (2 ÍTEMS DISTINTOS)
  // ==========================================================================

  // Coordenadas fijas de los 6 tramos de distribución a lo largo del pasillo
  const pipeCoordinates = [
    { s: 1, x1: 110, y1: 310, x2: 240, y2: 310, branchX: 160, branchY: 160 },
    { s: 2, x1: 240, y1: 310, x2: 380, y2: 310, branchX: 380, branchY: 160 },
    { s: 3, x1: 380, y1: 310, x2: 500, y2: 310, branchX: 160, branchY: 490 },
    { s: 4, x1: 500, y1: 310, x2: 620, y2: 310, branchX: 380, branchY: 490 },
    { s: 5, x1: 620, y1: 310, x2: 760, y2: 310, branchX: 620, branchY: 160 },
    { s: 6, x1: 760, y1: 310, x2: 890, y2: 310, branchX: 840, branchY: 160 },
  ];

  // 1. CAPA DE TUBERÍA EMT (Línea Azul/Índigo Metálica Sólida)
  if (AppState.filters.tuberia) {
    pipeCoordinates.forEach(seg => {
      const item = floor.items.find(i => i.id === `TUB-P${AppState.selectedFloor}-S0${seg.s}`);
      if (!item) return;

      const isInst = item.status === 'installed';
      const col = isInst ? '#10b981' : '#f59e0b'; // Verde si instalado, Ámbar si pendiente

      svgContent += `
        <!-- Tubería Tramo ${seg.s} -->
        <g class="svg-interactive-item" onclick="window.onSvgItemClick('${item.id}')">
          <!-- Tramo principal en pasillo (offset y=310) -->
          <line x1="${seg.x1}" y1="${seg.y1}" x2="${seg.x2}" y2="${seg.y2}" 
                stroke="${col}" stroke-width="7" stroke-linecap="round"/>
          <line x1="${seg.x1}" y1="${seg.y1}" x2="${seg.x2}" y2="${seg.y2}" 
                stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
          
          <!-- Derivación de tubería hacia caja de paso -->
          <line x1="${seg.x1 + 30}" y1="${seg.y1}" x2="${seg.branchX}" y2="${seg.branchY}" 
                stroke="${col}" stroke-width="5" stroke-linecap="round"/>

          <!-- Cajas de paso cuadradas 4x4 / Condulets -->
          <rect x="${seg.x1 - 6}" y="${seg.y1 - 6}" width="12" height="12" rx="2" fill="${col}" stroke="#1e293b" stroke-width="1.5"/>
          <rect x="${seg.x2 - 6}" y="${seg.y2 - 6}" width="12" height="12" rx="2" fill="${col}" stroke="#1e293b" stroke-width="1.5"/>

          <!-- Etiqueta del tramo de tubería -->
          <rect x="${(seg.x1 + seg.x2) / 2 - 25}" y="${seg.y1 - 22}" width="50" height="14" rx="3" fill="#ffffff" stroke="${col}" stroke-width="1"/>
          <text x="${(seg.x1 + seg.x2) / 2}" y="${seg.y1 - 12}" font-family="monospace" font-size="8" font-weight="bold" fill="${col}" text-anchor="middle">TUB-S${seg.s}</text>
        </g>
      `;
    });
  }

  // 2. CAPA DE CABLEADO FPLR (Línea Roja Fuego Paralela con offset y=330)
  if (AppState.filters.cableado) {
    pipeCoordinates.forEach(seg => {
      const item = floor.items.find(i => i.id === `CAB-P${AppState.selectedFloor}-S0${seg.s}`);
      if (!item) return;

      const isInst = item.status === 'installed';
      const col = isInst ? '#10b981' : '#f59e0b';

      svgContent += `
        <!-- Cableado Tramo ${seg.s} -->
        <g class="svg-interactive-item" onclick="window.onSvgItemClick('${item.id}')">
          <!-- Línea de cable que corre en paralelo -->
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

  // ==========================================================================
  // CAPA DE EQUIPOS Y DISPOSITIVOS DE DETECCIÓN (NFPA SYMBOLOGY)
  // ==========================================================================

  // 3. Detectores Autónomos dentro de las habitaciones
  if (AppState.filters.detectores) {
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
      const col = isInst ? '#10b981' : '#f59e0b';

      svgContent += `
        <!-- Detector Habitación ${d.r} -->
        <g class="svg-interactive-item" onclick="window.onSvgItemClick('${item.id}')">
          <!-- Cobertura radial de detección -->
          <circle cx="${d.x}" cy="${d.y}" r="38" fill="${col}" opacity="0.12"/>
          <!-- Base del detector -->
          <circle cx="${d.x}" cy="${d.y}" r="18" fill="#ffffff" stroke="${col}" stroke-width="3" filter="${isInst ? 'url(#glowGreen)' : 'url(#glowAmber)'}"/>
          <!-- Cámara de humo central -->
          <circle cx="${d.x}" cy="${d.y}" r="8" fill="${col}"/>
          <text x="${d.x}" y="${d.y + 3}" font-family="'Outfit', sans-serif" font-size="8" font-weight="900" fill="#ffffff" text-anchor="middle">D</text>
          
          <!-- Rótulo del detector -->
          <rect x="${d.x - 38}" y="${d.y + 24}" width="76" height="15" rx="3" fill="#ffffff" stroke="${col}" stroke-width="1"/>
          <text x="${d.x}" y="${d.y + 35}" font-family="monospace" font-size="8" font-weight="bold" fill="#0f172a" text-anchor="middle">H-${AppState.selectedFloor}0${d.r}</text>
        </g>
      `;
    });
  }

  // 4. Sirenas Estroboscópicas en Pasillo
  if (AppState.filters.sirenas) {
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
          <!-- Triángulo / Símbolo de Sirena NFPA -->
          <polygon points="${s.x-14},${s.y+12} ${s.x+14},${s.y+12} ${s.x},${s.y-14}" fill="#ffffff" stroke="${col}" stroke-width="3" filter="${isInst ? 'url(#glowGreen)' : 'url(#glowAmber)'}"/>
          <circle cx="${s.x}" cy="${s.y+2}" r="5" fill="${col}"/>
          <!-- Rótulo -->
          <text x="${s.x}" y="${s.y - 18}" font-family="'Outfit', sans-serif" font-size="8.5" font-weight="800" fill="${col}" text-anchor="middle">SIRENA</text>
        </g>
      `;
    });
  }

  // 5. Palancas / Estaciones Manuales de Emergencia en accesos
  if (AppState.filters.palancas) {
    const pullCoords = [
      { p: 1, x: 105, y: 325 },
      { p: 2, x: 895, y: 325 }
    ];

    pullCoords.forEach(p => {
      const item = floor.items.find(i => i.id === `PAL-P${AppState.selectedFloor}-${p.p}`);
      if (!item) return;

      const isInst = item.status === 'installed';
      const col = isInst ? '#10b981' : '#f59e0b';

      svgContent += `
        <!-- Palanca Manual ${p.p} -->
        <g class="svg-interactive-item" onclick="window.onSvgItemClick('${item.id}')">
          <rect x="${p.x - 12}" y="${p.y - 12}" width="24" height="24" rx="4" fill="#ffffff" stroke="${col}" stroke-width="3" filter="${isInst ? 'url(#glowGreen)' : 'url(#glowAmber)'}"/>
          <rect x="${p.x - 7}" y="${p.y - 7}" width="14" height="14" rx="2" fill="${col}"/>
          <text x="${p.x}" y="${p.y + 4}" font-family="'Outfit', sans-serif" font-size="9" font-weight="900" fill="#ffffff" text-anchor="middle">M</text>
          <!-- Rótulo -->
          <text x="${p.x}" y="${p.y + 24}" font-family="'Outfit', sans-serif" font-size="8" font-weight="bold" fill="${col}" text-anchor="middle">PALANCA</text>
        </g>
      `;
    });
  }

  svg.innerHTML = svgContent;
  applyBlueprintTransform();
}

// Aplicar transformaciones de Zoom y Pan
function applyBlueprintTransform() {
  const svg = document.getElementById('blueprint-main-svg');
  if (svg) {
    svg.style.transform = `translate(${AppState.panX}px, ${AppState.panY}px) scale(${AppState.zoomLevel})`;
  }
}

// Arrastre interactivo del plano
function initBlueprintPan() {
  const container = document.getElementById('blueprint-canvas-container');
  if (!container) return;

  let isDragging = false;
  let startX = 0;
  let startY = 0;

  container.addEventListener('mousedown', (e) => {
    // Si hace clic en un elemento interactivo, no activar pan
    if (e.target.closest('.svg-interactive-item')) return;
    isDragging = true;
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
  });
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
// MODAL DE DETALLE Y REGISTRO DE INSTALACIÓN
// ==========================================================================
function openItemModal(item) {
  AppState.selectedItemForModal = item;

  document.getElementById('modal-item-code').textContent = item.code;
  document.getElementById('modal-item-name').textContent = item.name;
  document.getElementById('modal-item-type').textContent = item.type.toUpperCase();
  document.getElementById('modal-item-model').textContent = item.model;
  document.getElementById('modal-item-zone').textContent = item.zone;
  document.getElementById('modal-item-quantity').textContent = `${item.quantity} ${item.unit}`;

  // Estado
  const statusSelect = document.getElementById('modal-item-status');
  if (statusSelect) statusSelect.value = item.status;

  // Fecha de Instalación (si no tiene, colocar fecha de hoy)
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('modal-item-date');
  if (dateInput) dateInput.value = item.installDate || today;

  // Técnico
  const techInput = document.getElementById('modal-item-tech');
  if (techInput) techInput.value = item.technician || 'Cuadrilla de Instalación GSIT';

  // Notas
  const notesInput = document.getElementById('modal-item-notes');
  if (notesInput) notesInput.value = item.notes || '';

  // Foto de evidencia
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

  container.innerHTML = `
    <div class="photo-preview-card">
      <img src="${item.photo || 'assets/img/smoke_detector.svg'}" alt="Foto de Evidencia">
      <div class="photo-badge-label">Evidencia de Campo</div>
    </div>
  `;
}

function handleUserPhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    if (AppState.selectedItemForModal) {
      AppState.selectedItemForModal.photo = event.target.result;
      renderItemModalPhotos(AppState.selectedItemForModal);
      showToast('Foto cargada correctamente');
    }
  };
  reader.readAsDataURL(file);
}

function saveItemModalChanges() {
  const item = AppState.selectedItemForModal;
  if (!item) return;

  const newStatus = document.getElementById('modal-item-status').value;
  const newDate = document.getElementById('modal-item-date').value;
  const newTech = document.getElementById('modal-item-tech').value;
  const newNotes = document.getElementById('modal-item-notes').value;

  item.status = newStatus;
  item.installDate = newDate;
  item.technician = newTech;
  item.notes = newNotes;

  saveDatabase();
  closeItemModal();

  // Actualizar UI, Plano y Porcentajes en Vivo
  updateUI();
  renderFloorBlueprint();
  renderFloorItemsList();

  showToast(`Elemento ${item.code} actualizado a [${newStatus.toUpperCase()}]`);
}

// ==========================================================================
// MODAL Y REPORTE DE CORTE DE FACTURACIÓN
// ==========================================================================
function openBillingModal() {
  // Establecer fechas por defecto
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('billing-date-start').value = '2026-06-01';
  document.getElementById('billing-date-end').value = today;

  renderBillingReport();
  document.getElementById('modal-billing-cutoff')?.classList.add('active');
}

function closeBillingModal() {
  document.getElementById('modal-billing-cutoff')?.classList.remove('active');
}

function renderBillingReport() {
  const startDate = document.getElementById('billing-date-start').value;
  const endDate = document.getElementById('billing-date-end').value;
  const floorFilter = document.getElementById('billing-floor-scope').value; // 'all' o número

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
        // Comprobar filtro de fechas
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

  const ivaAmount = subtotalAmount * 0.19;
  const grandTotal = subtotalAmount + ivaAmount;

  // Actualizar tarjetas de resumen
  document.getElementById('billing-summary-pipe').textContent = `${Math.round(totalPipeMeters).toLocaleString()} m`;
  document.getElementById('billing-summary-cable').textContent = `${Math.round(totalCableMeters).toLocaleString()} m`;
  document.getElementById('billing-summary-devices').textContent = `${totalDevicesCount} un`;
  document.getElementById('billing-summary-total').textContent = `$ ${Math.round(grandTotal).toLocaleString('es-CO')}`;

  // Actualizar tabla detallada
  const tbody = document.getElementById('billing-table-body');
  if (tbody) {
    if (matchedItems.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:1.5rem;">No se encontraron ítems instalados en el rango de fechas seleccionado.</td></tr>`;
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
}

function exportBillingToCSV() {
  const startDate = document.getElementById('billing-date-start').value;
  const endDate = document.getElementById('billing-date-end').value;

  let csv = 'FECHA,CODIGO,DESCRIPCION,PISO,CANTIDAD,UNIDAD,PRECIO_UNITARIO_COP,SUBTOTAL_COP,ESTADO\n';

  for (let f = 0; f <= 33; f++) {
    const floor = AppState.database.floors[f];
    if (!floor) continue;

    floor.items.forEach(item => {
      if (item.status === 'installed' && item.installDate) {
        if (item.installDate >= startDate && item.installDate <= endDate) {
          const itemTotal = item.quantity * item.unitPrice;
          csv += `"${item.installDate}","${item.code}","${item.name}","Piso ${f}",${item.quantity},"${item.unit}",${item.unitPrice},${itemTotal},"Instalado Certificado"\n`;
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

  showToast('Archivo CSV descargado para facturación');
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
  }, 3200);
}
