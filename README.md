# Global Solutions IT — Plataforma de Gestión y Ejecución de Obras

Plataforma web para la supervisión y control operativo de sistemas de redes de detección y alarma contra incendios (NFPA 72) desarrollada para **Global Solutions IT**.

![Global Solutions IT Logo](public/logo.png)

## 🚀 Características Principales

1. **Panel Inicial Institucional**: Presentación corporativa con indicadores de obra en tiempo real.
2. **Control de Acceso y Roles de Seguridad**:
   - **Consulta Pública (Solo Lectura)**: Acceso libre para supervisores, clientes e interventoría para inspeccionar los 34 pisos, planos técnicos, especificaciones y actas de facturación sin alterar registros.
   - **Administrador de Obra**: Autenticación para ingenieros autorizados con permisos exclusivos de edición de estados, fechas, cuadrillas y adjunto de evidencias fotográficas.
3. **Portafolio de Proyectos**:
   - **Torre Grand Titanium (33 Pisos)**: Proyecto en ejecución activa con un avance global certificado del **90.4%**.
   - **Estadio Metropolitano Roberto Meléndez**: Infraestructura deportiva en fase de diseño con esquema interactivo editable.
4. **Estudio Técnico por Pisos (0 al 33)**:
   - **Piso 0**: Sótano y parqueaderos (100% OK).
   - **Piso 1**: **CEREBRO DE LA OPERACIÓN** con Central FACP Notifier NFS2-3030, baterías y riser vertical.
   - **Pisos 2 al 6**: Oficinas corporativas (100% OK).
   - **Pisos 7 al 29**: Habitaciones residenciales (100% OK).
   - **Pisos 30 al 33**: En ejecución activa (78% a 89%) con elementos pendientes para interactuar.
5. **Diferenciación Técnica de Redes**:
   - **Tubería Conduit EMT 3/4"**: Trazado y metrado independiente.
   - **Cableado FPLR Contra Incendio**: Rutas y metrado independiente de lazo SLC.
6. **Ficha Técnica & Registro In Situ con Fotos**:
   - Cambio de estado en vivo (`Pendiente` ↔ `Instalado`).
   - Adjunto de evidencia fotográfica.
   - Recálculo en tiempo real del avance del piso y del edificio.
7. **Corte de Facturación con Filtro de Fechas**:
   - Filtro por rango de fechas (Desde - Hasta) y alcance de pisos.
   - Liquidación de metros de tubería, cable y equipos.
   - Descarga directa a **Excel / CSV**.
   - Impresión de acta formal con membrete.

---

## 💻 Arquitectura y Despliegue en Vercel

Este proyecto está construido sobre **Next.js 14 (App Router)** con **TypeScript**, **Tailwind CSS** y **Zod**:
1. Conecta este repositorio en [Vercel](https://vercel.com).
2. Framework Preset: **Next.js** (detectado automáticamente).
3. Root Directory: `./`
4. Despliegue automático con Server Actions, Client Components y CDN optimizado.
