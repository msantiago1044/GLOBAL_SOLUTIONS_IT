import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getSession,
  isAuthenticated,
  isAdmin,
  loginAsAdmin,
  logout,
} from '../src/lib/auth';

describe('Control de Acceso y Sesión de Usuario (GSIT Auth)', () => {
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};

    const localStorageMock = {
      getItem: (key: string) => mockStorage[key] ?? null,
      setItem: (key: string, value: string) => {
        mockStorage[key] = value;
      },
      removeItem: (key: string) => {
        delete mockStorage[key];
      },
      clear: () => {
        mockStorage = {};
      },
    };

    const windowMock = {
      localStorage: localStorageMock,
      dispatchEvent: () => true,
    };

    // Assign window and localStorage to global scope
    (globalThis as unknown as { window: unknown }).window = windowMock;
    (globalThis as unknown as { localStorage: unknown }).localStorage = localStorageMock;

    logout();
  });

  afterEach(() => {
    delete (globalThis as { window?: unknown }).window;
    delete (globalThis as { localStorage?: unknown }).localStorage;
  });

  it('debe iniciar sin sesión activa por defecto', () => {
    expect(getSession()).toBeNull();
    expect(isAuthenticated()).toBe(false);
    expect(isAdmin()).toBe(false);
  });

  it('debe registrar y validar sesión de administrador correctamente', () => {
    const session = loginAsAdmin('admin_marcelo');
    expect(session.role).toBe('admin');
    expect(session.username).toBe('admin_marcelo');

    expect(isAuthenticated()).toBe(true);
    expect(isAdmin()).toBe(true);
    expect(getSession()?.username).toBe('admin_marcelo');
  });

  it('debe limpiar la sesión tras invocar logout', () => {
    loginAsAdmin('admin');
    expect(isAuthenticated()).toBe(true);

    logout();
    expect(isAuthenticated()).toBe(false);
    expect(isAdmin()).toBe(false);
    expect(getSession()).toBeNull();
  });
});
