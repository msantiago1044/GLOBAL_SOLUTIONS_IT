-- ==========================================================================
-- GLOBAL SOLUTIONS IT S.A.S. - TABLA DE SESIONES TELEGRAM (WIZARD DE OBRA)
-- ==========================================================================

CREATE TABLE IF NOT EXISTS public.telegram_sessions (
    chat_id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    username TEXT,
    step TEXT NOT NULL DEFAULT 'IDLE',
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.telegram_sessions ENABLE ROW LEVEL SECURITY;

-- Política para permitir acceso administrativo al backend (service_role)
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'telegram_sessions' 
        AND policyname = 'Permitir acceso a service_role en telegram_sessions'
    ) THEN
        CREATE POLICY "Permitir acceso a service_role en telegram_sessions"
            ON public.telegram_sessions FOR ALL
            USING (auth.role() = 'service_role')
            WITH CHECK (auth.role() = 'service_role');
    END IF;
END $$;
