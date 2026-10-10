-- ==========================================================================
-- GLOBAL SOLUTIONS IT S.A.S. - PLATAFORMA DE GESTIÓN Y EJECUCIÓN DE OBRAS
-- Schema Inicial de Base de Datos (NFPA 72 - Redes Contra Incendios)
-- ==========================================================================

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla de Proyectos
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    client TEXT NOT NULL,
    address TEXT NOT NULL,
    contractor TEXT NOT NULL,
    interventoria TEXT NOT NULL,
    system_type TEXT NOT NULL,
    total_floors INTEGER NOT NULL DEFAULT 34,
    global_progress NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabla de Pisos / Niveles
CREATE TABLE IF NOT EXISTS public.floors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    floor_number INTEGER NOT NULL,
    name TEXT NOT NULL,
    floor_type TEXT NOT NULL, -- 'sotano', 'cerebro', 'oficinas', 'habitaciones', 'ejecucion'
    progress_percentage NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_floor_project_number UNIQUE(project_id, floor_number)
);

-- 3. Tipos Enumerados para Elementos
DO $$ BEGIN
    CREATE TYPE item_type_enum AS ENUM (
        'tuberia',
        'cableado',
        'detector-autonomo',
        'detector-doble',
        'sirena',
        'palanca',
        'facp',
        'cuadro-bomba'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE item_status_enum AS ENUM (
        'pending',
        'installed',
        'inspected'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 4. Tabla de Elementos Técnicos de Red
CREATE TABLE IF NOT EXISTS public.floor_items (
    id TEXT PRIMARY KEY, -- ej: 'TUB-P33-S01', 'CAB-P33-S01', 'DET-HAB-3301'
    floor_id UUID NOT NULL REFERENCES public.floors(id) ON DELETE CASCADE,
    project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    type item_type_enum NOT NULL,
    name TEXT NOT NULL,
    model TEXT NOT NULL,
    zone TEXT NOT NULL,
    status item_status_enum NOT NULL DEFAULT 'pending',
    quantity NUMERIC(10,2) NOT NULL DEFAULT 1.0,
    unit TEXT NOT NULL DEFAULT 'Unidad', -- 'Metros', 'Unidad'
    unit_price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    photo_url TEXT,
    notes TEXT,
    installed_at DATE,
    installer_team TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Tabla de Evidencias Fotográficas
CREATE TABLE IF NOT EXISTS public.installation_evidences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id TEXT NOT NULL REFERENCES public.floor_items(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    captured_by TEXT NOT NULL,
    captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    observations TEXT
);

-- Índices de Rendimiento
CREATE INDEX IF NOT EXISTS idx_floor_items_floor_id ON public.floor_items(floor_id);
CREATE INDEX IF NOT EXISTS idx_floor_items_project_id ON public.floor_items(project_id);
CREATE INDEX IF NOT EXISTS idx_floor_items_status ON public.floor_items(status);
CREATE INDEX IF NOT EXISTS idx_floors_project_number ON public.floors(project_id, floor_number);

-- ==========================================================================
-- POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
-- ==========================================================================

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.floors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.floor_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installation_evidences ENABLE ROW LEVEL SECURITY;

-- 1. Lectura Pública para Auditoría y Visualización (Interventoría y Clientes)
CREATE POLICY "Permitir lectura publica a projects" 
    ON public.projects FOR SELECT USING (true);

CREATE POLICY "Permitir lectura publica a floors" 
    ON public.floors FOR SELECT USING (true);

CREATE POLICY "Permitir lectura publica a floor_items" 
    ON public.floor_items FOR SELECT USING (true);

CREATE POLICY "Permitir lectura publica a installation_evidences" 
    ON public.installation_evidences FOR SELECT USING (true);

-- 2. Modificaciones restringidas a usuarios autenticados / clave de servicio
CREATE POLICY "Permitir escritura autenticada a projects" 
    ON public.projects FOR ALL 
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Permitir escritura autenticada a floors" 
    ON public.floors FOR ALL 
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Permitir escritura autenticada a floor_items" 
    ON public.floor_items FOR ALL 
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Permitir escritura autenticada a installation_evidences" 
    ON public.installation_evidences FOR ALL 
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ==========================================================================
-- TRIGGER: Recálculo automático de avance de piso y proyecto
-- ==========================================================================

CREATE OR REPLACE FUNCTION public.recompute_floor_and_project_progress()
RETURNS TRIGGER AS $$
DECLARE
    v_floor_id UUID;
    v_project_id TEXT;
    v_floor_progress NUMERIC(5,2);
    v_project_progress NUMERIC(5,2);
BEGIN
    v_floor_id := COALESCE(NEW.floor_id, OLD.floor_id);
    v_project_id := COALESCE(NEW.project_id, OLD.project_id);

    -- 1. Calcular avance del piso específico
    SELECT COALESCE(
        ROUND(
            (COUNT(*) FILTER (WHERE status = 'installed' OR status = 'inspected')::NUMERIC / NULLIF(COUNT(*), 0)::NUMERIC) * 100, 
            2
        ), 
        0.00
    )
    INTO v_floor_progress
    FROM public.floor_items
    WHERE floor_id = v_floor_id;

    UPDATE public.floors
    SET progress_percentage = v_floor_progress,
        updated_at = NOW()
    WHERE id = v_floor_id;

    -- 2. Calcular avance global del proyecto
    SELECT COALESCE(
        ROUND(
            (COUNT(*) FILTER (WHERE status = 'installed' OR status = 'inspected')::NUMERIC / NULLIF(COUNT(*), 0)::NUMERIC) * 100, 
            2
        ), 
        0.00
    )
    INTO v_project_progress
    FROM public.floor_items
    WHERE project_id = v_project_id;

    UPDATE public.projects
    SET global_progress = v_project_progress,
        updated_at = NOW()
    WHERE id = v_project_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_recompute_progress ON public.floor_items;
CREATE TRIGGER trg_recompute_progress
AFTER INSERT OR UPDATE OF status, floor_id, project_id OR DELETE ON public.floor_items
FOR EACH ROW
EXECUTE FUNCTION public.recompute_floor_and_project_progress();
