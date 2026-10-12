import { z } from 'zod';

export const BotStepSchema = z.enum([
  'IDLE',
  'SELECT_PROJECT',
  'SELECT_FLOOR',
  'SELECT_CATEGORY',
  'SELECT_ITEM',
  'SELECT_STATUS',
  'SELECT_TEAM',
  'AWAITING_PHOTO',
  'AWAITING_NOTES',
]);

export const SessionPayloadSchema = z.object({
  projectId: z.string().optional(),
  projectName: z.string().optional(),
  floorNumber: z.number().optional(),
  floorName: z.string().optional(),
  category: z.string().optional(),
  itemId: z.string().optional(),
  itemCode: z.string().optional(),
  itemName: z.string().optional(),
  targetStatus: z.enum(['installed', 'inspected']).optional(),
  installerTeam: z.string().optional(),
  photoUrl: z.string().optional(),
  notes: z.string().optional(),
});

export const BotSessionSchema = z.object({
  chatId: z.number(),
  userId: z.number(),
  username: z.string().nullable().optional(),
  step: BotStepSchema,
  payload: SessionPayloadSchema,
  updatedAt: z.string().optional(),
});

export type BotStep = z.infer<typeof BotStepSchema>;
export type SessionPayload = z.infer<typeof SessionPayloadSchema>;
export type BotSession = z.infer<typeof BotSessionSchema>;
