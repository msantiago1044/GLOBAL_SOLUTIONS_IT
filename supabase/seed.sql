-- ==========================================================================
-- GLOBAL SOLUTIONS IT S.A.S. - SEED INICIAL: ESTADIO METROPOLITANO
-- ==========================================================================

-- 1. Inserción del Proyecto Principal
INSERT INTO public.projects (
    id, name, client, address, contractor, interventoria, system_type, total_floors, global_progress
) VALUES (
    'estadio-metropolitano',
    'Estadio Metropolitano Roberto Meléndez',
    'Alcaldía Distrital / Secretaría de Deportes',
    'Calle 45 Murillo, Barranquilla, Atlántico',
    'Global Solutions IT S.A.S. (NIT 901.458.921-3)',
    'Interventoría Técnica Caribe S.A.',
    'Detección Temprana & Tubería Conduit EMT — NFPA 72 Clase B',
    4,
    0.00
) ON CONFLICT (id) DO UPDATE SET
    global_progress = EXCLUDED.global_progress,
    updated_at = NOW();

-- 2. Inserción de Zonas / Niveles
INSERT INTO public.floors (project_id, floor_number, name, floor_type, progress_percentage)
VALUES 
    ('estadio-metropolitano', 0, 'Nivel de Cancha (-3.80 m)', 'sotano', 0.00),
    ('estadio-metropolitano', 1, 'Nivel 1 (+42.08 m)', 'cerebro', 0.00),
    ('estadio-metropolitano', 2, 'Mezanine (+45.57 m)', 'oficinas', 0.00),
    ('estadio-metropolitano', 3, 'Nivel 3 (+52.45 m)', 'ejecucion', 0.00)
ON CONFLICT (project_id, floor_number) DO UPDATE SET
    name = EXCLUDED.name,
    floor_type = EXCLUDED.floor_type,
    progress_percentage = EXCLUDED.progress_percentage,
    updated_at = NOW();

-- 3. Inserción de Elementos Clave del Nivel 1 (Central FACP)
DO $$
DECLARE
    v_floor_1_id UUID;
BEGIN
    SELECT id INTO v_floor_1_id FROM public.floors WHERE project_id = 'estadio-metropolitano' AND floor_number = 1;

    -- Tramos de Tubería Conduit EMT
    INSERT INTO public.floor_items (id, floor_id, project_id, code, type, name, model, zone, status, quantity, unit, unit_price, notes)
    VALUES 
        ('TUB-EST-N1-01', v_floor_1_id, 'estadio-metropolitano', 'TUB-EST-N1-01', 'tuberia', 'Tubería Conduit EMT 3/4" Anillo Principal', 'Tubo EMT Galvanizado UL 797', 'Nivel 1 (+42.08 m)', 'pending', 45.0, 'Metros', 28500, 'Pendiente trazado'),
        ('CAB-EST-N1-01', v_floor_1_id, 'estadio-metropolitano', 'CAB-EST-N1-01', 'cableado', 'Cable Blindado FPLR 2x16 AWG Lazo 1', 'Cable FPLR Rojo UL 1424', 'Nivel 1 (+42.08 m)', 'pending', 60.0, 'Metros', 19800, 'Pendiente enhebrado'),
        ('FACP-EST-01', v_floor_1_id, 'estadio-metropolitano', 'FACP-EST-01', 'facp', 'Panel Principal FACP Notifier', 'Notifier NFS2-3030', 'Nivel 1 (+42.08 m)', 'pending', 1, 'Unidad', 28500000, 'Gabinete ubicado')
    ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;
END $$;
