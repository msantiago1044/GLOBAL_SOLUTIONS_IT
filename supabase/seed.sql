-- ==========================================================================
-- GLOBAL SOLUTIONS IT S.A.S. - SEED INICIAL: TORRE GRAND TITANIUM
-- ==========================================================================

-- 1. Inserción del Proyecto Principal
INSERT INTO public.projects (
    id, name, client, address, contractor, interventoria, system_type, total_floors, global_progress
) VALUES (
    'torre-titanium',
    'Torre Grand Titanium - 33 Pisos',
    'Constructora Bolívar & Inversiones Colpatria',
    'Cra 15 # 98-42, Chicó Norte, Bogotá D.C.',
    'Global Solutions IT S.A.S. (NIT 901.458.921-3)',
    'Consorcio Interventorías Civiles & Eléctricas S.A.S.',
    'Sistema Direccionable Inteligente NFPA 72 — Notifier ONYX NFS2-3030',
    34,
    90.40
) ON CONFLICT (id) DO UPDATE SET
    global_progress = EXCLUDED.global_progress,
    updated_at = NOW();

-- 2. Inserción de los 34 Pisos (0 al 33)
DO $$
DECLARE
    i INTEGER;
    v_floor_type TEXT;
    v_floor_name TEXT;
    v_progress NUMERIC(5,2);
BEGIN
    FOR i IN 0..33 LOOP
        IF i = 0 THEN
            v_floor_type := 'sotano';
            v_floor_name := 'Piso 0 - Sótano / Parqueaderos y Bombas';
            v_progress := 100.00;
        ELSIF i = 1 THEN
            v_floor_type := 'cerebro';
            v_floor_name := 'Piso 1 - Sala de Control Principal FACP';
            v_progress := 100.00;
        ELSIF i BETWEEN 2 AND 6 THEN
            v_floor_type := 'oficinas';
            v_floor_name := 'Piso ' || i || ' - Oficinas Corporativas';
            v_progress := 100.00;
        ELSIF i BETWEEN 7 AND 29 THEN
            v_floor_type := 'habitaciones';
            v_floor_name := 'Piso ' || i || ' - Niveles Residenciales';
            v_progress := 100.00;
        ELSIF i = 30 THEN
            v_floor_type := 'ejecucion';
            v_floor_name := 'Piso 30 - Nivel Residencial Superior';
            v_progress := 89.00;
        ELSIF i = 31 THEN
            v_floor_type := 'ejecucion';
            v_floor_name := 'Piso 31 - Nivel Residencial Superior';
            v_progress := 86.00;
        ELSIF i = 32 THEN
            v_floor_type := 'ejecucion';
            v_floor_name := 'Piso 32 - Nivel Residencial Superior';
            v_progress := 82.00;
        ELSE -- Piso 33
            v_floor_type := 'ejecucion';
            v_floor_name := 'Piso 33 - Ático / Penthouse';
            v_progress := 78.00;
        END IF;

        INSERT INTO public.floors (project_id, floor_number, name, floor_type, progress_percentage)
        VALUES ('torre-titanium', i, v_floor_name, v_floor_type, v_progress)
        ON CONFLICT (project_id, floor_number) DO UPDATE SET
            name = EXCLUDED.name,
            floor_type = EXCLUDED.floor_type,
            progress_percentage = EXCLUDED.progress_percentage,
            updated_at = NOW();
    END LOOP;
END $$;

-- 3. Inserción de Elementos Clave del Piso 33 (Nivel Activo en Ejecución)
DO $$
DECLARE
    v_floor_33_id UUID;
BEGIN
    SELECT id INTO v_floor_33_id FROM public.floors WHERE project_id = 'torre-titanium' AND floor_number = 33;

    -- Tramos de Tubería Conduit EMT 3/4"
    INSERT INTO public.floor_items (id, floor_id, project_id, code, type, name, model, zone, status, quantity, unit, unit_price, notes)
    VALUES 
        ('TUB-P33-S01', v_floor_33_id, 'torre-titanium', 'TUB-P33-S01', 'tuberia', 'Tubería Conduit EMT 3/4" Tramo 1', 'Tubo EMT Galvanizado UL 797', 'Pasillo Distribución Zona 1', 'installed', 18.5, 'Metros', 28500, 'Instalada y certificada'),
        ('TUB-P33-S02', v_floor_33_id, 'torre-titanium', 'TUB-P33-S02', 'tuberia', 'Tubería Conduit EMT 3/4" Tramo 2', 'Tubo EMT Galvanizado UL 797', 'Pasillo Distribución Zona 2', 'installed', 16.0, 'Metros', 28500, 'Instalada con uniones selladas'),
        ('TUB-P33-S03', v_floor_33_id, 'torre-titanium', 'TUB-P33-S03', 'tuberia', 'Tubería Conduit EMT 3/4" Tramo 3', 'Tubo EMT Galvanizado UL 797', 'Pasillo Distribución Zona 3', 'installed', 17.5, 'Metros', 28500, 'Fijación con abrazaderas tipo uña'),
        ('TUB-P33-S04', v_floor_33_id, 'torre-titanium', 'TUB-P33-S04', 'tuberia', 'Tubería Conduit EMT 3/4" Tramo 4', 'Tubo EMT Galvanizado UL 797', 'Pasillo Distribución Zona 4', 'pending', 18.5, 'Metros', 28500, 'Pendiente acople final')
    ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;

    -- Tramos de Cableado FPLR Contra Incendio
    INSERT INTO public.floor_items (id, floor_id, project_id, code, type, name, model, zone, status, quantity, unit, unit_price, notes)
    VALUES 
        ('CAB-P33-S01', v_floor_33_id, 'torre-titanium', 'CAB-P33-SLC-01', 'cableado', 'Cable Blindado FPLR 2x16 AWG Tramo 1', 'Cable Contra Incendio FPLR Rojo UL 1424', 'Pasillo Distribución Tramo 1', 'installed', 24.0, 'Metros', 19800, 'Lazo SLC enhebrado'),
        ('CAB-P33-S02', v_floor_33_id, 'torre-titanium', 'CAB-P33-SLC-02', 'cableado', 'Cable Blindado FPLR 2x16 AWG Tramo 2', 'Cable Contra Incendio FPLR Rojo UL 1424', 'Pasillo Distribución Tramo 2', 'installed', 22.0, 'Metros', 19800, 'Conexión verificada'),
        ('CAB-P33-S03', v_floor_33_id, 'torre-titanium', 'CAB-P33-SLC-03', 'cableado', 'Cable Blindado FPLR 2x16 AWG Tramo 3', 'Cable Contra Incendio FPLR Rojo UL 1424', 'Pasillo Distribución Tramo 3', 'installed', 23.5, 'Metros', 19800, 'Conducción sin empalmes'),
        ('CAB-P33-S04', v_floor_33_id, 'torre-titanium', 'CAB-P33-SLC-04', 'cableado', 'Cable Blindado FPLR 2x16 AWG Tramo 4', 'Cable Contra Incendio FPLR Rojo UL 1424', 'Pasillo Distribución Tramo 4', 'pending', 26.0, 'Metros', 19800, 'Pendiente peinado de lazo')
    ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;

    -- Detectores de Humo y Equipos
    INSERT INTO public.floor_items (id, floor_id, project_id, code, type, name, model, zone, status, quantity, unit, unit_price, notes)
    VALUES 
        ('DET-HAB-3301', v_floor_33_id, 'torre-titanium', 'DET-HAB-3301', 'detector-autonomo', 'Detector Autónomo Hab. 3301', 'FSP-851 Notifier', 'Habitación 3301', 'installed', 1, 'Unidad', 245000, 'Probado con humo sintético'),
        ('DET-HAB-3302', v_floor_33_id, 'torre-titanium', 'DET-HAB-3302', 'detector-autonomo', 'Detector Autónomo Hab. 3302', 'FSP-851 Notifier', 'Habitación 3302', 'installed', 1, 'Unidad', 245000, 'Programado direccionable'),
        ('DET-HAB-3303', v_floor_33_id, 'torre-titanium', 'DET-HAB-3303', 'detector-autonomo', 'Detector Autónomo Hab. 3303', 'FSP-851 Notifier', 'Habitación 3303', 'installed', 1, 'Unidad', 245000, 'Aprobado'),
        ('DET-HAB-3304', v_floor_33_id, 'torre-titanium', 'DET-HAB-3304', 'detector-autonomo', 'Detector Autónomo Hab. 3304', 'FSP-851 Notifier', 'Habitación 3304', 'installed', 1, 'Unidad', 245000, 'Aprobado'),
        ('DET-HAB-3305', v_floor_33_id, 'torre-titanium', 'DET-HAB-3305', 'detector-autonomo', 'Detector Autónomo Hab. 3305', 'FSP-851 Notifier', 'Habitación 3305', 'installed', 1, 'Unidad', 245000, 'Aprobado'),
        ('DET-HAB-3306', v_floor_33_id, 'torre-titanium', 'DET-HAB-3306', 'detector-autonomo', 'Detector Autónomo Hab. 3306', 'FSP-851 Notifier', 'Habitación 3306', 'pending', 1, 'Unidad', 245000, 'Caja lista para montaje'),
        ('DET-HAB-3307', v_floor_33_id, 'torre-titanium', 'DET-HAB-3307', 'detector-autonomo', 'Detector Autónomo Hab. 3307', 'FSP-851 Notifier', 'Habitación 3307', 'pending', 1, 'Unidad', 245000, 'Pendiente cielo raso'),
        ('DET-HAB-3308', v_floor_33_id, 'torre-titanium', 'DET-HAB-3308', 'detector-autonomo', 'Detector Autónomo Hab. 3308', 'FSP-851 Notifier', 'Habitación 3308', 'pending', 1, 'Unidad', 245000, 'Pendiente cielo raso'),
        ('SIR-P33-01', v_floor_33_id, 'torre-titanium', 'SIR-P33-01', 'sirena', 'Sirena Estroboscópica P33', 'System Sensor P2RL', 'Pasillo Central', 'installed', 1, 'Unidad', 315000, 'Prueba de decibeles conforme NFPA 72'),
        ('PAL-P33-01', v_floor_33_id, 'torre-titanium', 'PAL-P33-01', 'palanca', 'Estación Manual Doble Acción P33', 'NBG-12LX Notifier', 'Acceso Escalera Emergencia', 'installed', 1, 'Unidad', 280000, 'Altura a 1.20m normativo')
    ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;
END $$;
