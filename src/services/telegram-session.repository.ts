import { getSupabaseAdminClient } from '../lib/supabase';
import {
  BotSession,
  BotSessionSchema,
  SessionPayload,
} from '../schemas/bot-session.schema';

export class TelegramSessionRepository {
  private supabase = getSupabaseAdminClient();

  /**
   * Obtiene la sesión actual de un chat en Telegram
   */
  async getSession(chatId: number): Promise<BotSession | null> {
    const { data, error } = await this.supabase
      .from('telegram_sessions')
      .select('*')
      .eq('chat_id', chatId)
      .maybeSingle();

    if (error) {
      console.error(`Error al consultar sesión de chat ${chatId}:`, error.message);
      return null;
    }

    if (!data) return null;

    const parsed = BotSessionSchema.safeParse({
      chatId: Number(data.chat_id),
      userId: Number(data.user_id),
      username: data.username,
      step: data.step,
      payload: (data.payload as SessionPayload) || {},
      updatedAt: data.updated_at,
    });

    if (!parsed.success) {
      console.warn(`Sesión inválida para chat ${chatId}, reiniciando:`, parsed.error.format());
      await this.clearSession(chatId);
      return null;
    }

    return parsed.data;
  }

  /**
   * Guarda o actualiza la sesión en Supabase
   */
  async saveSession(session: BotSession): Promise<void> {
    const validated = BotSessionSchema.parse(session);

    const { error } = await this.supabase.from('telegram_sessions').upsert({
      chat_id: validated.chatId,
      user_id: validated.userId,
      username: validated.username ?? null,
      step: validated.step,
      payload: validated.payload,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      throw new Error(`Error al persistir sesión de chat ${validated.chatId}: ${error.message}`);
    }
  }

  /**
   * Limpia o reinicia la sesión a estado IDLE
   */
  async clearSession(chatId: number): Promise<void> {
    const { error } = await this.supabase
      .from('telegram_sessions')
      .delete()
      .eq('chat_id', chatId);

    if (error) {
      console.error(`Error al eliminar sesión de chat ${chatId}:`, error.message);
    }
  }
}
