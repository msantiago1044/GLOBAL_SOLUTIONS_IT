import { z } from 'zod';

export const TelegramUserSchema = z.object({
  id: z.number(),
  is_bot: z.boolean().optional(),
  first_name: z.string(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  language_code: z.string().optional(),
});

export const TelegramChatSchema = z.object({
  id: z.number(),
  type: z.string(),
  title: z.string().optional(),
  username: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

export const TelegramPhotoSizeSchema = z.object({
  file_id: z.string(),
  file_unique_id: z.string(),
  width: z.number(),
  height: z.number(),
  file_size: z.number().optional(),
});

export const TelegramMessageSchema = z.object({
  message_id: z.number(),
  from: TelegramUserSchema.optional(),
  chat: TelegramChatSchema,
  date: z.number(),
  text: z.string().optional(),
  photo: z.array(TelegramPhotoSizeSchema).optional(),
  caption: z.string().optional(),
});

export const TelegramCallbackQuerySchema = z.object({
  id: z.string(),
  from: TelegramUserSchema,
  message: TelegramMessageSchema.optional(),
  inline_message_id: z.string().optional(),
  chat_instance: z.string().optional(),
  data: z.string().optional(),
});

export const TelegramUpdateSchema = z.object({
  update_id: z.number(),
  message: TelegramMessageSchema.optional(),
  edited_message: TelegramMessageSchema.optional(),
  callback_query: TelegramCallbackQuerySchema.optional(),
});

export const InlineKeyboardButtonSchema = z.object({
  text: z.string(),
  callback_data: z.string().optional(),
  url: z.string().optional(),
});

export const InlineKeyboardMarkupSchema = z.object({
  inline_keyboard: z.array(z.array(InlineKeyboardButtonSchema)),
});

export type TelegramUser = z.infer<typeof TelegramUserSchema>;
export type TelegramChat = z.infer<typeof TelegramChatSchema>;
export type TelegramPhotoSize = z.infer<typeof TelegramPhotoSizeSchema>;
export type TelegramMessage = z.infer<typeof TelegramMessageSchema>;
export type TelegramCallbackQuery = z.infer<typeof TelegramCallbackQuerySchema>;
export type TelegramUpdate = z.infer<typeof TelegramUpdateSchema>;
export type InlineKeyboardButton = z.infer<typeof InlineKeyboardButtonSchema>;
export type InlineKeyboardMarkup = z.infer<typeof InlineKeyboardMarkupSchema>;
