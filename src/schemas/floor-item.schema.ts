import { z } from 'zod';

export const ItemTypeSchema = z.enum([
  'tuberia',
  'cableado',
  'detector-autonomo',
  'detector-doble',
  'sirena',
  'palanca',
  'facp',
  'cuadro-bomba',
]);

export const ItemStatusSchema = z.enum(['pending', 'installed', 'inspected']);

export const FloorTypeSchema = z.enum([
  'sotano',
  'cerebro',
  'oficinas',
  'habitaciones',
  'ejecucion',
]);

/**
 * Esquema Zod para un elemento técnico individual (Floor Item)
 */
export const FloorItemSchema = z.object({
  id: z.string().min(2, 'ID de elemento requerido'),
  floorId: z.string().uuid().optional(),
  projectId: z.string().min(1, 'ID de proyecto requerido'),
  code: z.string().min(2, 'Código de elemento requerido'),
  type: ItemTypeSchema,
  name: z.string().min(2, 'Nombre técnico requerido'),
  model: z.string(),
  zone: z.string(),
  status: ItemStatusSchema.default('pending'),
  quantity: z.number().positive('La cantidad debe ser mayor a 0'),
  unit: z.string().default('Unidad'),
  unitPrice: z.number().nonnegative('El precio unitario no puede ser negativo'),
  photoUrl: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  installedAt: z.string().nullable().optional(),
  installerTeam: z.string().nullable().optional(),
});

/**
 * Esquema para actualización de estado desde la ficha técnica (modal in-situ)
 */
export const UpdateItemStatusSchema = z.object({
  status: ItemStatusSchema,
  notes: z.string().max(1000).optional(),
  installedAt: z.string().optional(),
  installerTeam: z.string().max(100).optional(),
  photoUrl: z.string().url().or(z.literal('')).optional(),
});

/**
 * Esquema para registro de evidencias fotográficas
 */
export const InstallationEvidenceSchema = z.object({
  itemId: z.string().min(1),
  photoUrl: z.string().url('URL de fotografía inválida'),
  capturedBy: z.string().min(2, 'Nombre de responsable requerido'),
  observations: z.string().max(1000).optional(),
});

export type FloorItem = z.infer<typeof FloorItemSchema>;
export type UpdateItemStatusPayload = z.infer<typeof UpdateItemStatusSchema>;
export type InstallationEvidence = z.infer<typeof InstallationEvidenceSchema>;
