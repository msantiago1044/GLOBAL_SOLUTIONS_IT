import { describe, it, expect } from 'vitest';
import {
  FloorItemSchema,
  UpdateItemStatusSchema,
} from '../src/schemas/floor-item.schema';

describe('Validación de Esquemas de Elementos de Red (NFPA 72)', () => {
  it('debe validar un elemento de tubería conduit correctamente', () => {
    const validPipe = {
      id: 'TUB-P33-S01',
      projectId: 'torre-titanium',
      code: 'TUB-P33-S01',
      type: 'tuberia',
      name: 'Tubería Conduit EMT 3/4" Tramo 1',
      model: 'Tubo EMT Galvanizado UL 797',
      zone: 'Pasillo Distribución Zona 1',
      status: 'installed',
      quantity: 18.5,
      unit: 'Metros',
      unitPrice: 28500,
      notes: 'Instalada y certificada',
    };

    const parsed = FloorItemSchema.safeParse(validPipe);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.type).toBe('tuberia');
      expect(parsed.data.quantity).toBe(18.5);
    }
  });

  it('debe rechazar un tipo de componente no contemplado por la norma', () => {
    const invalidType = {
      id: 'INVALID-01',
      projectId: 'torre-titanium',
      code: 'INV-01',
      type: 'tipo-inexistente',
      name: 'Elemento Desconocido',
      model: 'Test',
      zone: 'Zona 1',
      status: 'pending',
      quantity: 1,
      unit: 'Unidad',
      unitPrice: 100,
    };

    const parsed = FloorItemSchema.safeParse(invalidType);
    expect(parsed.success).toBe(false);
  });

  it('debe validar payloads de actualización de estado in situ', () => {
    const updatePayload = {
      status: 'installed',
      notes: 'Verificada continuidad con multímetro',
      installedAt: '2026-10-10',
      installerTeam: 'Cuadrilla 2 - GSIT',
    };

    const parsed = UpdateItemStatusSchema.safeParse(updatePayload);
    expect(parsed.success).toBe(true);
  });
});
