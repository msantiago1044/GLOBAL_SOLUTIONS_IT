import { validateServerEnv } from '../config/env';
import {
  InlineKeyboardMarkup,
  TelegramMessage,
  TelegramMessageSchema,
} from '../schemas/telegram.schema';

interface SendMessageOptions {
  reply_markup?: InlineKeyboardMarkup;
  parse_mode?: 'HTML' | 'Markdown';
}

interface TelegramApiResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
}

export class TelegramService {
  private botToken: string;
  private baseUrl: string;

  constructor(token?: string) {
    if (token) {
      this.botToken = token;
    } else {
      const env = validateServerEnv();
      if (!env.TELEGRAM_BOT_TOKEN) {
        throw new Error('TELEGRAM_BOT_TOKEN no está configurado en las variables de entorno.');
      }
      this.botToken = env.TELEGRAM_BOT_TOKEN;
    }
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  /**
   * Envía un mensaje de texto a un chat o usuario
   */
  async sendMessage(
    chatId: number,
    text: string,
    options?: SendMessageOptions
  ): Promise<TelegramMessage> {
    const payload = {
      chat_id: chatId,
      text,
      parse_mode: options?.parse_mode || 'HTML',
      reply_markup: options?.reply_markup,
    };

    const response = await fetch(`${this.baseUrl}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as TelegramApiResponse<TelegramMessage>;

    if (!data.ok || !data.result) {
      throw new Error(`Error en Telegram sendMessage: ${data.description || 'Desconocido'}`);
    }

    return TelegramMessageSchema.parse(data.result);
  }

  /**
   * Edita el texto y botones de un mensaje existente (para navegación ágil sin saturar el chat)
   */
  async editMessageText(
    chatId: number,
    messageId: number,
    text: string,
    options?: SendMessageOptions
  ): Promise<boolean> {
    const payload = {
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: options?.parse_mode || 'HTML',
      reply_markup: options?.reply_markup,
    };

    const response = await fetch(`${this.baseUrl}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as TelegramApiResponse<boolean | TelegramMessage>;

    if (!data.ok) {
      // Si el mensaje es exactamente idéntico, Telegram devuelve error menor que podemos ignorar
      if (data.description?.includes('message is not modified')) {
        return true;
      }
      console.error(`Error en editMessageText: ${data.description}`);
      return false;
    }

    return true;
  }

  /**
   * Responde a una pulsación de botón (callback_query) para quitar el spinner de carga en Telegram
   */
  async answerCallbackQuery(
    callbackQueryId: string,
    text?: string,
    showAlert: boolean = false
  ): Promise<boolean> {
    const payload = {
      callback_query_id: callbackQueryId,
      text,
      show_alert: showAlert,
    };

    const response = await fetch(`${this.baseUrl}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as TelegramApiResponse<boolean>;
    return Boolean(data.ok);
  }

  /**
   * Obtiene la ruta del archivo en los servidores de Telegram para descargarlo
   */
  async getFilePath(fileId: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/getFile?file_id=${fileId}`);
    const data = (await response.json()) as TelegramApiResponse<{ file_path: string }>;

    if (!data.ok || !data.result?.file_path) {
      throw new Error(`Error al obtener ruta del archivo: ${data.description || 'Sin respuesta'}`);
    }

    return data.result.file_path;
  }

  /**
   * Descarga los bytes de un archivo (como foto de evidencia)
   */
  async downloadFile(filePath: string): Promise<Buffer> {
    const fileUrl = `https://api.telegram.org/file/bot${this.botToken}/${filePath}`;
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(`Error al descargar archivo desde Telegram: HTTP ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * Configura la lista de comandos oficiales del bot
   */
  async setMyCommands(
    commands: Array<{ command: string; description: string }>
  ): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/setMyCommands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commands }),
    });

    const data = (await response.json()) as TelegramApiResponse<boolean>;
    return Boolean(data.ok);
  }
}
