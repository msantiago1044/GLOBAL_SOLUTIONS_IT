import { z } from 'zod';

export const SchemaStatusSchema = z.enum(['editable', 'locked']);

export const ProjectSchema = z.object({
  id: z.string().min(2, 'ID de proyecto requerido'),
  name: z.string().min(3, 'Nombre de proyecto requerido'),
  client: z.string().min(2, 'Cliente o entidad requerida'),
  address: z.string().min(2, 'Dirección o ubicación requerida'),
  contractor: z.string().default('Global Solutions IT S.A.S.'),
  interventoria: z.string().default('Interventoría Oficial'),
  systemType: z.string().min(3, 'Tipo de sistema NFPA 72 requerido'),
  totalFloors: z.number().int().positive('Número de zonas o niveles debe ser entero positivo'),
  globalProgress: z.number().min(0).max(100).default(0),
  schemaStatus: SchemaStatusSchema.default('editable'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const CreateProjectPayloadSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  client: z.string().min(2, 'El cliente es requerido'),
  city: z.string().min(2, 'La ciudad o ubicación es requerida'),
  floorsCount: z.number().int().min(1).max(100),
  system: z.string().min(3, 'Especificación de sistema requerida'),
});

export type SchemaStatus = z.infer<typeof SchemaStatusSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type CreateProjectPayload = z.infer<typeof CreateProjectPayloadSchema>;
