import { z } from 'zod';

/**
 * Esquema de validación para variables de entorno públicas (cliente)
 */
export const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url('NEXT_PUBLIC_SUPABASE_URL debe ser una URL válida de Supabase'),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(10, 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY debe ser una clave válida'),
});

/**
 * Esquema de validación para variables de entorno privadas (servidor)
 */
export const serverEnvSchema = clientEnvSchema.extend({
  SUPABASE_SECRET_KEY: z
    .string()
    .min(10, 'SUPABASE_SECRET_KEY es requerida para el backend/servidor'),
  SUPABASE_JWKS_URL: z
    .string()
    .url('SUPABASE_JWKS_URL debe ser una URL válida')
    .optional(),
  DATABASE_URL: z
    .string()
    .url('DATABASE_URL debe ser una URL de conexión válida')
    .optional(),
  TELEGRAM_BOT_TOKEN: z
    .string()
    .min(10, 'TELEGRAM_BOT_TOKEN es requerido para el bot de Telegram')
    .optional(),
  TELEGRAM_WEBHOOK_SECRET: z
    .string()
    .min(8, 'TELEGRAM_WEBHOOK_SECRET es requerido para validar el webhook')
    .optional(),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Validador estricto para entorno del cliente
 */
export function validateClientEnv(): ClientEnv {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.SUPABASE_PUBLISHABLE_KEY,
  };

  const result = clientEnvSchema.safeParse(env);
  if (!result.success) {
    console.error('❌ Variables de entorno cliente inválidas:', result.error.format());
    throw new Error('Error al validar las variables de entorno de Supabase (Cliente)');
  }

  return result.data;
}

/**
 * Validador estricto para entorno del servidor
 */
export function validateServerEnv(): ServerEnv {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    SUPABASE_JWKS_URL: process.env.SUPABASE_JWKS_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_WEBHOOK_SECRET: process.env.TELEGRAM_WEBHOOK_SECRET,
  };

  const result = serverEnvSchema.safeParse(env);
  if (!result.success) {
    console.error('❌ Variables de entorno servidor inválidas:', result.error.format());
    throw new Error('Error al validar las variables de entorno de Supabase (Servidor)');
  }

  return result.data;
}
