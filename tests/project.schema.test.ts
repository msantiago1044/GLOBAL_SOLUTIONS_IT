import { describe, it, expect } from 'vitest';
import {
  ProjectSchema,
  CreateProjectPayloadSchema,
  SchemaStatusSchema,
} from '../src/schemas/project.schema';

describe('Validación de Proyectos y Esquema Técnico NFPA 72', () => {
  it('debe validar un proyecto en blanco editable (Estadio Metropolitano)', () => {
    const estadio = {
      id: 'estadio-metropolitano',
      name: 'Estadio Metropolitano Roberto Meléndez',
      client: 'Alcaldía Distrital de Barranquilla',
      address: 'Calle 45 # 1-100, Barranquilla',
      contractor: 'Global Solutions IT S.A.S.',
      interventoria: 'Interventoría Deportiva',
      systemType: 'Sistema de Notificación Masiva NFPA 72',
      totalFloors: 6,
      globalProgress: 0,
      schemaStatus: 'editable',
    };

    const result = ProjectSchema.safeParse(estadio);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.schemaStatus).toBe('editable');
      expect(result.data.totalFloors).toBe(6);
    }
  });

  it('debe validar un proyecto con esquema bloqueado (Torre Titanium)', () => {
    const titanium = {
      id: 'torre-titanium',
      name: 'Torre Grand Titanium',
      client: 'Constructora Bolívar',
      address: 'Cra 15 # 98-42, Bogotá D.C.',
      systemType: 'Notifier NFS2-3030',
      totalFloors: 34,
      globalProgress: 90.4,
      schemaStatus: 'locked',
    };

    const result = ProjectSchema.safeParse(titanium);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.schemaStatus).toBe('locked');
    }
  });

  it('debe rechazar estados de esquema inválidos', () => {
    const statusResult = SchemaStatusSchema.safeParse('unlocked_invalid');
    expect(statusResult.success).toBe(false);
  });

  it('debe validar payload de creación de nuevo proyecto', () => {
    const payload = {
      name: 'Centro Comercial Gran Plaza',
      client: 'Inversiones Comerciales S.A.S.',
      city: 'Medellín, Antioquia',
      floorsCount: 4,
      system: 'Red de Detección Direccionable NFPA 72',
    };

    const result = CreateProjectPayloadSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });
});
