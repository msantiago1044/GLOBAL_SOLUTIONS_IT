import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { validateClientEnv, validateServerEnv } from '../config/env';

import { Database } from '../types/database.types';

let clientInstance: SupabaseClient<Database> | null = null;

/**
 * Cliente de Supabase para Frontend / Cliente
 * Utiliza exclusivamente NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (clientInstance) {
    return clientInstance;
  }

  const env = validateClientEnv();
  clientInstance = createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    }
  );

  return clientInstance;
}

/**
 * Cliente de Supabase con permisos administrativos (Solo para uso en Servidor / Edge Functions)
 * NUNCA importar ni ejecutar esta función en el cliente del navegador.
 */
export function getSupabaseAdminClient(): SupabaseClient<Database> {
  const env = validateServerEnv();
  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SECRET_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
