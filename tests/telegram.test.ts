import { describe, it, expect } from 'vitest';
import {
  TelegramUpdateSchema,
  TelegramMessageSchema,
  TelegramCallbackQuerySchema,
} from '../src/schemas/telegram.schema';
import {
  BotSessionSchema,
  BotStepSchema,
} from '../src/schemas/bot-session.schema';

describe('Validación de Esquemas Zod para Telegram Bot', () => {
  it('debe parsear correctamente un mensaje de comando de texto', () => {
    const rawMessage = {
      message_id: 101,
      from: {
        id: 12345678,
        is_bot: false,
        first_name: 'Carlos',
        username: 'carlos_residente',
      },
      chat: {
        id: 12345678,
        type: 'private',
        first_name: 'Carlos',
      },
      date: 1710000000,
      text: '/avance 33',
    };

    const parsed = TelegramMessageSchema.safeParse(rawMessage);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.text).toBe('/avance 33');
      expect(parsed.data.chat.id).toBe(12345678);
    }
  });

  it('debe parsear un mensaje con fotografía de evidencia', () => {
    const rawPhotoMessage = {
      message_id: 102,
      from: {
        id: 12345678,
        is_bot: false,
        first_name: 'Carlos',
      },
      chat: {
        id: 12345678,
        type: 'private',
      },
      date: 1710000010,
      photo: [
        { file_id: 'thumb_123', file_unique_id: 'u1', width: 100, height: 100 },
        { file_id: 'full_123', file_unique_id: 'u2', width: 1280, height: 720, file_size: 154000 },
      ],
      caption: 'Evidencia instalación DET-HAB-3306',
    };

    const parsed = TelegramMessageSchema.safeParse(rawPhotoMessage);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.photo).toHaveLength(2);
      expect(parsed.data.photo?.[1].file_id).toBe('full_123');
    }
  });

  it('debe parsear un evento de botón (callback_query)', () => {
    const rawCallback = {
      id: 'cb_query_999',
      from: {
        id: 12345678,
        first_name: 'Carlos',
      },
      message: {
        message_id: 50,
        chat: { id: 12345678, type: 'private' },
        date: 1710000000,
        text: 'Selecciona el equipo:',
      },
      data: 'i:DET-HAB-3306',
    };

    const parsed = TelegramCallbackQuerySchema.safeParse(rawCallback);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.data).toBe('i:DET-HAB-3306');
    }
  });

  it('debe validar y enrutar un Update completo de Telegram', () => {
    const update = {
      update_id: 987654,
      callback_query: {
        id: 'cb_query_999',
        from: { id: 12345678, first_name: 'Carlos' },
        data: 'act:installed',
      },
    };

    const parsed = TelegramUpdateSchema.safeParse(update);
    expect(parsed.success).toBe(true);
  });
});

describe('Validación de Máquina de Estados de Sesión (BotSession)', () => {
  it('debe validar una sesión en paso SELECT_ITEM con metadatos completos', () => {
    const sessionData = {
      chatId: 12345678,
      userId: 12345678,
      username: 'carlos_ing',
      step: 'SELECT_ITEM',
      payload: {
        projectId: 'estadio-metropolitano',
        projectName: 'Estadio Metropolitano Roberto Meléndez',
        floorNumber: 1,
      },
    };

    const parsed = BotSessionSchema.safeParse(sessionData);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.step).toBe('SELECT_ITEM');
      expect(parsed.data.payload.floorNumber).toBe(1);
    }
  });

  it('debe validar todos los pasos autorizados del wizard', () => {
    const validSteps = [
      'IDLE',
      'SELECT_PROJECT',
      'SELECT_FLOOR',
      'SELECT_CATEGORY',
      'SELECT_ITEM',
      'SELECT_STATUS',
      'SELECT_TEAM',
      'AWAITING_PHOTO',
      'AWAITING_NOTES',
    ];

    validSteps.forEach((step) => {
      expect(BotStepSchema.safeParse(step).success).toBe(true);
    });

    expect(BotStepSchema.safeParse('PASO_INVENTADO').success).toBe(false);
  });
});
