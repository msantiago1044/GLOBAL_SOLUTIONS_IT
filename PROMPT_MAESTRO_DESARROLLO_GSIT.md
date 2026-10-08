# PROMPT MAESTRO DE INGENIERÍA: PLATAFORMA DE OPERACIONES & EJECUCIÓN DE OBRAS
## GLOBAL SOLUTIONS IT S.A.S. — SISTEMAS DE PROTECCIÓN CONTRA INCENDIOS

> **Instrucciones para el usuario**: Copia y utiliza este prompt completo en cualquier modelo de IA o entrégalo a tu equipo de desarrollo para generar, extender o desplegar la solución empresarial con total fidelidad técnica.

---

```markdown
Actúa como un Arquitecto de Software Full-Stack Senior y Diseñador UX/UI Especializado en Plataformas de Ingeniería y Construcción (AEC). Tu misión es desarrollar una plataforma web integral para "Global Solutions IT", una compañía líder en el diseño, suministro e instalación de sistemas de redes de detección y alarma contra incendios conforme a la norma NFPA 72.

La plataforma tiene como propósito digitalizar y controlar la ejecución operativa de obra en tiempo real mediante planos técnicos interactivos, trazabilidad milimétrica de materiales (diferenciando tubería conduit de cableado contra incendio), captura de evidencias fotográficas in situ y automatización de cortes de facturación para contratistas e interventoría.

---

### 1. DIRECTRICES DE DISEÑO VISUAL (UI / UX)
- **Tema y Paleta**: Exclusivamente TEMA CLARO (Light Theme), limpio, sofisticado y de alto contraste, diseñado para ingenieros residentes, supervisores y gerentes de proyecto.
- **Colores Corporativos**:
  - Azul Institucional Primario: `#004b87` y `#0077b6` (basados en la identidad visual de Global Solutions IT).
  - Cian Acento: `#00b4d8` y `#e0f2fe` para elementos activos, píldoras y selecciones.
  - Verde Esmeralda (Instalado / Aprobado): `#10b981` con fondos `#ecfdf5`.
  - Ámbar Cálido (Pendiente de Montaje): `#f59e0b` con fondos `#fffbeb`.
  - Superficies y Fondos: Blanco puro `#ffffff` y gris hielo `#f8fafc`.
  - Tubería EMT Conduit: Azul índigo técnico `#2563eb`.
  - Cableado FPLR Contra Incendio: Rojo fuego `#dc2626`.
- **Tipografía**: Fuentes modernas sin serifa como 'Outfit' e 'Inter' de Google Fonts.
- **Identidad de Marca**: Incluir el logotipo oficial en el header, pantalla de login, actas impresas y un favicon representativo en la pestaña del navegador (`<link rel="icon">`).

---

### 2. ARQUITECTURA DE MÓDULOS Y FLUJO DE USUARIO

#### MÓDULO 1: PANEL INICIAL INSTITUCIONAL (LANDING PAGE)
- Encabezado con logo, nombre de la empresa, indicador de estado de obra en tiempo real y botón de acceso.
- Sección Hero con título de alto impacto: "Control de Ejecución de Obras, Redes de Tubería y Cableado en Tiempo Real".
- Contadores métricos de impacto: Número de pisos en seguimiento, porcentaje global de avance, metros lineales de tubería instalados y digitalización de cortes de cobro.
- Tarjetas de valor: Planos técnicos interactivos, diferenciación de tubería vs cable, auditoría fotográfica in situ y liquidación de facturación sin demoras.
- Botones de acción directa: "Explorar Demo Torre Titanium" e "Iniciar Sesión Operativa".

#### MÓDULO 2: AUTENTICACIÓN Y SEGURIDAD
- Modal/Vista de inicio de sesión sobrio y seguro.
- Credenciales por defecto para el entorno demo:
  - **Usuario**: `admin`
  - **Contraseña**: `admin`
- Botón de autocompletado rápido ("Autocompletar Credenciales") para facilitar pruebas y presentaciones comerciales.
- Validación de formulario con feedback visual (vibración ante error y toast de éxito).
- Persistencia de sesión en almacenamiento local (`localStorage`) con perfil de usuario y opción de cerrar sesión.

#### MÓDULO 3: PORTAFOLIO DE PROYECTOS EN EJECUCIÓN
- Grid de tarjetas de proyectos con metadatos: Cliente, tipo de edificación, sistema instalado (ej. Notifier NFS2-3030), total de niveles y barra de avance porcentual.
- Proyecto principal destacado para la demo:
  - **Nombre**: Torre Grand Titanium (33 Pisos + Sótano / 34 niveles en total).
  - **Estado**: 90.4% de ejecución global completado.
  - **Cliente**: Constructora Bolívar / Inversiones Colpatria.

#### MÓDULO 4: ESTUDIO DE EJECUCIÓN DE OBRA (VISTA DIVIDIDA / SPLIT VIEW)

##### A. Panel Lateral Izquierdo (390px fijo):
1. **Ficha del Proyecto**: Nombre, cliente, tipo de sistema NFPA 72 y barra de progreso global (90.4%).
2. **Métricas Rápidas Acumuladas**:
   - Metros de Tubería Conduit EMT instalados vs total proyectado.
   - Metros de Cable FPLR tendido vs total proyectado.
   - Cantidad de equipos y sensores certificados.
3. **Selector Jerárquico de Pisos (Nivel 0 al 33)**:
   - Desplegable y barra horizontal de chips con avance de cada nivel:
     - **Piso 0**: Sótano / Parqueaderos y cuarto de bombas contra incendio (100% OK).
     - **Piso 1**: **CEREBRO DE LA OPERACIÓN** — Sala de Control Principal FACP, central Notifier, baterías 24V y ducto vertical riser troncal (100% OK).
     - **Pisos 2 al 6**: Oficinas corporativas y áreas comunes (100% OK).
     - **Pisos 7 al 29**: Niveles residenciales con 8 habitaciones y pasillos principales (100% OK).
     - **Pisos 30 al 33**: Niveles activos en ejecución (Piso 33 al 78%, Piso 32 al 82%, Piso 31 al 86%, Piso 30 al 89%) con elementos pendientes para interactuar y registrar en vivo.
4. **Filtros de Capas Visibles en el Plano**:
   - [x] Tubería Conduit EMT 3/4" (tramos rígidos de nodo a nodo).
   - [x] Cableado FPLR Contra Incendio (lazo SLC que corre por tubería).
   - [x] Detectores (Autónomos de habitación y dobles/ópticos).
   - [x] Sirenas Estroboscópicas.
   - [x] Palancas / Estaciones Manuales.
   - [x] Central FACP / Cerebro de Operaciones.
5. **Lista Dinámica de Elementos del Piso Seleccionado**:
   - Tarjetas por ítem con código, descripción y etiqueta de estado (`Instalado` en verde o `Pendiente` en ámbar). Clic abre la ficha técnica.
6. **Botón Destacado de Acceso a Facturación**:
   - "Generar Corte de Facturación de Obra".

##### B. Área Central/Derecha: Plano Arquitectónico Interactivo (SVG Dinámico):
1. **Herramientas de Visualización**:
   - Zoom In (+), Zoom Out (-), Reset View (100%), arrastre panorámico libre (Pan) con ratón.
   - Título dinámico del piso con etiqueta de avance (ej. "Piso 33 - Ático / Penthouse — 78% Ejecutado").
   - Leyenda técnica flotante con código de colores claros y simbología NFPA 72.
2. **Representación Gráfica Vectorial**:
   - Paredes perimetrales, cuartos técnicos, escaleras de evacuación y ducto riser vertical.
   - En pisos residenciales (7 al 33): 8 habitaciones privadas numeradas con sus detectores autónomos en el interior de cada una, y pasillo central con tuberías, cables, sirenas y palancas.
   - En Piso 1 (Cerebro): Sala de control detallada con el gabinete FACP Notifier, pantalla LCD de estado, teclado y acometida troncal.
3. **Diferenciación Clave de Redes**:
   - **Tubería Conduit EMT 3/4"**: Trazado azul/verde sólido con cajas de paso 4x4 condulet en derivaciones.
   - **Cableado FPLR Contra Incendio**: Línea roja paralela que interconecta equipos.
   - Ambos son ítems clicables e independientes, con metrado y códigos individuales (`TUB-P33-S01` vs `CAB-P33-S01`).

#### MÓDULO 5: FICHA TÉCNICA Y REGISTRO DE INSTALACIÓN (MODAL INTERACTIVO)
Al hacer clic en cualquier elemento del plano o de la lista lateral:
- Datos del elemento: Código único, tipo de componente, modelo del fabricante, ubicación física y metrado/unidad.
- Selector de estado: `Pendiente de Instalación`, `Instalado & Verificado`, `En Inspección / Observado`.
- Fecha de instalación (por defecto fecha actual).
- Cuadrilla o técnico instalador responsable.
- **Registro de Evidencia Fotográfica**:
  - Previsualización de imágenes de evidencia técnica precargadas (tubería EMT acoplada, detector montado en cielo raso, lazo SLC peinado, etc.).
  - Selector de archivo para que el usuario pueda adjuntar fotos reales desde su equipo o cámara.
- Campo de observaciones técnicas y control de calidad.
- Botón "Guardar y Actualizar Avance":
  - Actualiza el estado en la base de datos local.
  - Cambia instantáneamente el color del elemento en el plano SVG (de ámbar a verde).
  - Recalcula el porcentaje de avance del piso y el porcentaje global del edificio (ej. de 90.4% a 90.6%).
  - Muestra notificación toast de confirmación.

#### MÓDULO 6: CORTE DE FACTURACIÓN Y LIQUIDACIÓN POR FECHAS
Herramienta financiera para cobro a clientes o contratistas:
- **Filtros de Liquidación**:
  - Fecha Inicial y Fecha Final del período a cobrar.
  - Alcance de pisos: Todos los pisos o un piso específico.
- **Tarjetas de Resumen Cuantitativo y Monetario**:
  - Total Metros Lineales de Tubería EMT instalados en el período.
  - Total Metros Lineales de Cable FPLR tendido en el período.
  - Total Dispositivos y Equipos certificados en el período.
  - Valor Total Facturable Liquidado (en pesos colombianos / moneda local, incluyendo IVA del 19%).
- **Tabla Detallada de Ítems Ejecutados**:
  - Fecha de instalación, código de ítem, descripción técnica, piso/zona, cantidad/metros, precio unitario y subtotal.
- **Acciones de Exportación**:
  - **Botón "Descargar Excel / CSV"**: Genera y descarga un archivo `.csv` estructurado listo para abrir en Microsoft Excel o software contable.
  - **Botón "Imprimir Acta Formal"**: Abre el diálogo nativo de impresión con estilos CSS `@media print` optimizados, membrete oficial de Global Solutions IT y campos para firmas de Interventoría y Residente de Obra.

---

### 3. MODELO DE DATOS (ESTRUCTURA JSON RECOMENDADA)
```json
{
  "project": {
    "id": "torre-titanium",
    "name": "Torre Grand Titanium - 33 Pisos",
    "client": "Constructora Bolívar / Inversiones Colpatria",
    "systemType": "Sistema Direccionable NFPA 72 - Notifier ONYX NFS2-3030",
    "totalFloors": 34,
    "status": "En Ejecución"
  },
  "floors": {
    "33": {
      "floorNumber": 33,
      "name": "Piso 33 - Ático / Penthouse",
      "type": "habitaciones",
      "items": [
        {
          "id": "TUB-P33-S04",
          "code": "TUB-P33-S04",
          "type": "tuberia",
          "name": "Tubería Conduit EMT 3/4\" Tramo 4",
          "model": "Tubo EMT Galvanizado UL 797",
          "zone": "Pasillo Distribución Zona 4",
          "status": "pending",
          "quantity": 18.5,
          "unit": "Metros",
          "unitPrice": 28500,
          "photo": "assets/img/pipe_emt.svg",
          "notes": "Pendiente fijación de abrazaderas"
        },
        {
          "id": "CAB-P33-S04",
          "code": "CAB-P33-SLC-04",
          "type": "cableado",
          "name": "Cable Blindado FPLR 2x16 AWG Tramo 4",
          "model": "Cable Contra Incendio FPLR Rojo UL 1424",
          "zone": "Pasillo Distribución Tramo 4",
          "status": "pending",
          "quantity": 26.0,
          "unit": "Metros",
          "unitPrice": 19800,
          "photo": "assets/img/cable_fire.svg",
          "notes": "Pendiente tirado de cable en ducto"
        },
        {
          "id": "DET-P33-6",
          "code": "DET-HAB-3306",
          "type": "detector-autonomo",
          "name": "Detector de Humo Autónomo / Habitación 3306",
          "model": "Detector Fotoeléctrico Direccionable FSP-851",
          "zone": "Interior Habitación 3306",
          "status": "pending",
          "quantity": 1,
          "unit": "Unidad",
          "unitPrice": 245000,
          "photo": "assets/img/smoke_detector.svg",
          "notes": "Caja octagonal lista para montaje"
        }
      ]
    }
  }
}
```

---

### 4. CRITERIOS DE ACEPTACIÓN
1. La aplicación debe ser 100% interactiva en navegador moderno, responsive y sin dependencias de frameworks pesados si se desea portabilidad estática (o compatible con React/Next.js/Vite para producción).
2. El porcentaje de avance del piso y el porcentaje global del edificio deben recalcularse dinámicamente cada vez que un elemento se marque como instalado o pendiente.
3. El plano debe soportar zoom fluido y paneo sin deformar las coordenadas de los equipos o tramos de tubería.
4. Las fotos adjuntadas por el usuario deben guardarse en memoria/localStorage con previsualización inmediata.
5. El filtro de corte de facturación por fechas debe sumar con exactitud los metros de tubería, cable y unidades instaladas dentro del rango temporal seleccionado y generar el archivo CSV descargable.
```
