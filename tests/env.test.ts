import { describe, it, expect } from 'vitest';
import { clientEnvSchema, serverEnvSchema } from '../src/config/env';

describe('Validación de Variables de Entorno (Zod)', () => {
  it('debe validar exitosamente variables válidas de cliente', () => {
    const validClient = {
      NEXT_PUBLIC_SUPABASE_URL: 'https://example-test.supabase.co',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test_mock_key_12345',
    };

    const parsed = clientEnvSchema.safeParse(validClient);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.NEXT_PUBLIC_SUPABASE_URL).toBe(validClient.NEXT_PUBLIC_SUPABASE_URL);
    }
  });

  it('debe rechazar una URL inválida de Supabase', () => {
    const invalidClient = {
      NEXT_PUBLIC_SUPABASE_URL: 'not-a-url',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'valid-key-length-123',
    };

    const parsed = clientEnvSchema.safeParse(invalidClient);
    expect(parsed.success).toBe(false);
  });

  it('debe validar variables completas de servidor con claves de prueba simuladas', () => {
    const validServer = {
      NEXT_PUBLIC_SUPABASE_URL: 'https://example-test.supabase.co',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test_mock_key_12345',
      SUPABASE_SECRET_KEY: 'mock_server_secret_key_for_unit_tests_only',
      SUPABASE_JWKS_URL: 'https://example-test.supabase.co/auth/v1/.well-known/jwks.json',
    };

    const parsed = serverEnvSchema.safeParse(validServer);
    expect(parsed.success).toBe(true);
  });

  it('debe fallar si falta SUPABASE_SECRET_KEY en el entorno de servidor', () => {
    const missingSecret = {
      NEXT_PUBLIC_SUPABASE_URL: 'https://example-test.supabase.co',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test_mock_key_12345',
    };

    const parsed = serverEnvSchema.safeParse(missingSecret);
    expect(parsed.success).toBe(false);
  });
});
