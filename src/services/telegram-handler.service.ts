import { TelegramService } from './telegram.service';
import { TelegramSessionRepository } from './telegram-session.repository';
import { ProjectExecutionService } from './project-execution.service';
import { TelegramWizardService } from './telegram-wizard.service';
import { StorageService } from './storage.service';
import {
  TelegramUpdate,
  TelegramUpdateSchema,
  InlineKeyboardMarkup,
  InlineKeyboardButton,
} from '../schemas/telegram.schema';

export class TelegramHandlerService {
  private telegram: TelegramService;
  private sessionRepo: TelegramSessionRepository;
  private projectExecution: ProjectExecutionService;
  private storage: StorageService;
  private wizard: TelegramWizardService;

  constructor() {
    this.telegram = new TelegramService();
    this.sessionRepo = new TelegramSessionRepository();
    this.projectExecution = new ProjectExecutionService();
    this.storage = new StorageService();
    this.wizard = new TelegramWizardService(
      this.telegram,
      this.sessionRepo,
      this.projectExecution,
      this.storage
    );
  }

  /**
   * Procesa cualquier actualización entrante del webhook de Telegram
   */
  async handleUpdate(rawUpdate: unknown): Promise<void> {
    const parsedUpdate = TelegramUpdateSchema.safeParse(rawUpdate);
    if (!parsedUpdate.success) {
      console.warn('Update de Telegram con formato no reconocido:', parsedUpdate.error.format());
      return;
    }

    const update: TelegramUpdate = parsedUpdate.data;

    // 1. Manejo de Callback Queries (Clics en botones)
    if (update.callback_query) {
      await this.handleCallbackQuery(update.callback_query);
      return;
    }

    // 2. Manejo de Mensajes de Texto o Fotos
    if (update.message) {
      await this.handleMessage(update.message);
      return;
    }
  }

  /**
   * Manejador de mensajes de texto y fotos
   */
  private async handleMessage(message: NonNullable<TelegramUpdate['message']>): Promise<void> {
    const chatId = message.chat.id;
    const userId = message.from?.id ?? chatId;
    const username = message.from?.username;
    const text = (message.text || '').trim();

    // 1. Verificar si el usuario está enviando una foto de evidencia
    if (message.photo && message.photo.length > 0) {
      const session = await this.sessionRepo.getSession(chatId);
      if (session && session.step === 'AWAITING_PHOTO') {
        // Tomar la foto de mayor resolución (último elemento del arreglo)
        const highestResPhoto = message.photo[message.photo.length - 1];
        await this.wizard.handleIncomingPhoto(session, highestResPhoto.file_id);
        return;
      }
    }

    // 2. Procesar Comandos de Texto
    if (text.startsWith('/start') || text.startsWith('/menu')) {
      await this.sendMainMenu(chatId, message.from?.first_name || 'Ingeniero');
      return;
    }

    if (text.startsWith('/avance')) {
      const parts = text.split(' ');
      const floorNum = parts[1] ? parseInt(parts[1], 10) : undefined;
      await this.sendAvanceReport(chatId, isNaN(floorNum ?? NaN) ? undefined : floorNum);
      return;
    }

    if (text.startsWith('/pendientes')) {
      const parts = text.split(' ');
      const floorNum = parts[1] ? parseInt(parts[1], 10) : 33;
      await this.sendPendingItemsReport(chatId, isNaN(floorNum) ? 33 : floorNum);
      return;
    }

    if (text.startsWith('/item')) {
      const parts = text.split(' ');
      const itemCode = parts[1];
      if (!itemCode) {
        await this.telegram.sendMessage(
          chatId,
          '⚠️ Debes especificar el código del ítem. Ejemplo: <code>/item TUB-P33-S04</code>'
        );
        return;
      }
      await this.sendItemDetail(chatId, itemCode);
      return;
    }

    if (text.startsWith('/instalar')) {
      const parts = text.split(' ');
      const itemCode = parts[1];
      if (itemCode) {
        // Salto directo a la ficha del ítem especificado
        const item = await this.projectExecution.getItemByCodeOrId(itemCode);
        if (item) {
          const sentMsg = await this.telegram.sendMessage(chatId, '⏳ Cargando ficha técnica...');
          await this.wizard.handleItemSelected(
            { chatId, userId, username, step: 'SELECT_ITEM', payload: { projectId: item.projectId } },
            item.id,
            sentMsg.message_id
          );
          return;
        }
      }
      // Si no especificó código, iniciar el wizard interactivo
      await this.wizard.startProjectSelection(chatId, userId, username);
      return;
    }

    if (text.startsWith('/cancelar')) {
      await this.sessionRepo.clearSession(chatId);
      await this.telegram.sendMessage(chatId, '✅ Operación cancelada. Escribe /menu para volver.');
      return;
    }

    // Si escribe texto no reconocido, sugerir menú principal
    await this.telegram.sendMessage(
      chatId,
      `Hola ${message.from?.first_name || ''}, usa los botones del menú o escribe <b>/menu</b> para operar el sistema.`
    );
  }

  /**
   * Manejador de eventos de botones (Callback Query)
   */
  private async handleCallbackQuery(
    cb: NonNullable<TelegramUpdate['callback_query']>
  ): Promise<void> {
    const data = cb.data || '';
    const chatId = cb.message?.chat.id;
    const messageId = cb.message?.message_id;
    const userId = cb.from.id;
    const username = cb.from.username;

    if (!chatId || !messageId) {
      await this.telegram.answerCallbackQuery(cb.id);
      return;
    }

    // Responder de inmediato a Telegram para quitar el spinner
    await this.telegram.answerCallbackQuery(cb.id);

    // Obtener sesión activa o crear una en blanco
    let session = await this.sessionRepo.getSession(chatId);
    if (!session) {
      session = {
        chatId,
        userId,
        username,
        step: 'IDLE',
        payload: {},
      };
    }

    // --- ENRUTAMIENTO DE ACCIONES POR PREFIJO ---

    // 1. Navegación Principal
    if (data === 'nav:menu') {
      await this.sessionRepo.clearSession(chatId);
      await this.sendMainMenu(chatId, cb.from.first_name, messageId);
      return;
    }

    if (data === 'nav:cancel') {
      await this.sessionRepo.clearSession(chatId);
      await this.telegram.editMessageText(chatId, messageId, '❌ Operación cancelada. Escribe /menu para volver.');
      return;
    }

    if (data === 'nav:start') {
      await this.wizard.startProjectSelection(chatId, userId, username, messageId);
      return;
    }

    if (data === 'nav:avance') {
      await this.sendAvanceReport(chatId, undefined, messageId);
      return;
    }

    if (data === 'nav:pendientes') {
      await this.sendPendingItemsReport(chatId, 33, messageId);
      return;
    }

    // 2. Wizard Paso 1 -> Proyecto seleccionado
    if (data.startsWith('p:')) {
      const projId = data.substring(2);
      await this.wizard.handleProjectSelected(session, projId, messageId);
      return;
    }

    // 3. Wizard Paso 2 -> Piso seleccionado
    if (data.startsWith('f:')) {
      const floorNum = parseInt(data.substring(2), 10);
      await this.wizard.handleFloorSelected(session, floorNum, messageId);
      return;
    }

    // 4. Wizard Filtro de Categoría
    if (data.startsWith('cat:')) {
      const category = data.substring(4);
      const floorNum = session.payload.floorNumber || 33;
      await this.wizard.handleFloorSelected(
        session,
        floorNum,
        messageId,
        category === 'all' ? undefined : category
      );
      return;
    }

    // 5. Wizard Paso 3 -> Ítem seleccionado
    if (data.startsWith('i:')) {
      const itemId = data.substring(2);
      await this.wizard.handleItemSelected(session, itemId, messageId);
      return;
    }

    // 6. Wizard Paso 4 -> Estado seleccionado
    if (data.startsWith('act:')) {
      const act = data.substring(4);
      if (act === 'installed' || act === 'inspected') {
        await this.wizard.handleStatusSelected(session, act, messageId);
        return;
      }
      if (act === 'skip_photo') {
        await this.wizard.finalizeInstallation(session, undefined, messageId);
        return;
      }
    }

    // 7. Wizard Paso 4.1 -> Cuadrilla seleccionada
    if (data.startsWith('tm:')) {
      const teamCode = data.substring(3);
      await this.wizard.handleTeamSelected(session, teamCode, messageId);
      return;
    }
  }

  /**
   * Envía o edita el Menú Principal con Botones
   */
  private async sendMainMenu(chatId: number, userName: string, messageId?: number): Promise<void> {
    const text =
      `<b>🛡️ GLOBAL SOLUTIONS IT S.A.S. — CONTROL DE OBRA NFPA 72</b>\n\n` +
      `Bienvenido, <b>${userName}</b>.\n` +
      `Selecciona la acción que deseas realizar en terreno:`;

    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          { text: '🛠️ Registrar Instalación', callback_data: 'nav:start' },
          { text: '📊 Consultar Avance', callback_data: 'nav:avance' },
        ],
        [
          { text: '📋 Ver Ítems Pendientes', callback_data: 'nav:pendientes' },
        ],
      ],
    };

    if (messageId) {
      await this.telegram.editMessageText(chatId, messageId, text, { reply_markup: keyboard });
    } else {
      await this.telegram.sendMessage(chatId, text, { reply_markup: keyboard });
    }
  }

  /**
   * Genera el informe de avance global o por piso
   */
  private async sendAvanceReport(
    chatId: number,
    floorNumber?: number,
    messageId?: number
  ): Promise<void> {
    const stats = await this.projectExecution.getProjectStats('torre-titanium');
    if (!stats) {
      const errorText = '⚠️ No fue posible consultar las estadísticas de la obra.';
      if (messageId) await this.telegram.editMessageText(chatId, messageId, errorText);
      else await this.telegram.sendMessage(chatId, errorText);
      return;
    }

    let text = '';
    const buttons: InlineKeyboardButton[][] = [];

    if (floorNumber !== undefined) {
      // Reporte de piso específico
      const floors = await this.projectExecution.getFloors('torre-titanium');
      const targetFloor = floors.find((f) => f.floorNumber === floorNumber);
      const pendingItems = await this.projectExecution.getPendingItemsByFloor('torre-titanium', floorNumber);

      const progress = targetFloor?.progressPercentage ?? 0;
      const bar = createProgressBar(progress);

      text =
        `<b>📊 AVANCE NIVEL ${floorNumber} — TORRE GRAND TITANIUM</b>\n\n` +
        `Avance: <b>${progress}%</b>\n` +
        `<code>${bar}</code>\n\n` +
        `• <b>Equipos pendientes:</b> ${pendingItems.length}\n`;

      if (pendingItems.length > 0) {
        text += `\n<b>Pendientes en este piso:</b>\n`;
        for (const it of pendingItems.slice(0, 5)) {
          text += `• <code>${it.code}</code>: ${it.name} (${it.zone})\n`;
        }
      }

      buttons.push([
        { text: `🛠️ Instalar en Nivel ${floorNumber}`, callback_data: `f:${floorNumber}` },
      ]);
      buttons.push([{ text: '🔙 Ver Avance Global', callback_data: 'nav:avance' }]);
    } else {
      // Reporte Global
      const globalProgress = stats.project.globalProgress;
      const bar = createProgressBar(globalProgress);

      const tubPercent = stats.tuberiaMetrosTotal > 0
        ? Math.round((stats.tuberiaMetrosInstalled / stats.tuberiaMetrosTotal) * 100)
        : 100;
      const cablePercent = stats.cableMetrosTotal > 0
        ? Math.round((stats.cableMetrosInstalled / stats.cableMetrosTotal) * 100)
        : 100;

      text =
        `<b>📊 AVANCE GLOBAL — ${stats.project.name.toUpperCase()}</b>\n\n` +
        `Avance Consolidado: <b>${globalProgress}%</b>\n` +
        `<code>${bar}</code>\n\n` +
        `<b>Desglose Técnico:</b>\n` +
        `• <b>Tubería Conduit EMT:</b> ${stats.tuberiaMetrosInstalled}m / ${stats.tuberiaMetrosTotal}m (${tubPercent}%)\n` +
        `• <b>Cableado FPLR SLC:</b> ${stats.cableMetrosInstalled}m / ${stats.cableMetrosTotal}m (${cablePercent}%)\n` +
        `• <b>Dispositivos/Sensores:</b> ${stats.sensoresInstalled} / ${stats.sensoresTotal} instalados\n\n` +
        `<b>Niveles Activos en Ejecución:</b>\n`;

      for (const f of stats.activeFloors.slice(0, 4)) {
        text += `• Nivel ${f.floorNumber}: ${f.progressPercentage}% (${f.name})\n`;
      }

      // Botones para pisos activos
      const floorButtons: InlineKeyboardButton[] = stats.activeFloors.slice(0, 4).map((f) => ({
        text: `📍 Nivel ${f.floorNumber}`,
        callback_data: `f:${f.floorNumber}`,
      }));
      buttons.push(floorButtons);
      buttons.push([{ text: '🛠️ Iniciar Instalación', callback_data: 'nav:start' }]);
    }

    buttons.push([{ text: '🏁 Menú Principal', callback_data: 'nav:menu' }]);

    const keyboard: InlineKeyboardMarkup = { inline_keyboard: buttons };

    if (messageId) {
      await this.telegram.editMessageText(chatId, messageId, text, { reply_markup: keyboard });
    } else {
      await this.telegram.sendMessage(chatId, text, { reply_markup: keyboard });
    }
  }

  /**
   * Lista los ítems pendientes de un piso con botones directos para instalar
   */
  private async sendPendingItemsReport(
    chatId: number,
    floorNumber: number,
    messageId?: number
  ): Promise<void> {
    const items = await this.projectExecution.getPendingItemsByFloor('torre-titanium', floorNumber);

    let text = `<b>📋 ELEMENTOS PENDIENTES — NIVEL ${floorNumber}</b>\n\n`;
    const buttons: InlineKeyboardButton[][] = [];

    if (items.length === 0) {
      text += `✅ ¡Todos los elementos de este nivel están completamente instalados!\n`;
    } else {
      text += `Se encontraron <b>${items.length}</b> elementos por instalar.\nToca cualquiera para registrar su montaje:\n\n`;
      for (const it of items.slice(0, 6)) {
        buttons.push([
          {
            text: `🛠️ ${it.code} — ${it.name}`,
            callback_data: `i:${it.id}`,
          },
        ]);
      }
    }

    buttons.push([
      { text: '📍 Cambiar a Piso 32', callback_data: `f:32` },
      { text: '📍 Cambiar a Piso 31', callback_data: `f:31` },
    ]);
    buttons.push([{ text: '🏁 Menú Principal', callback_data: 'nav:menu' }]);

    const keyboard: InlineKeyboardMarkup = { inline_keyboard: buttons };

    if (messageId) {
      await this.telegram.editMessageText(chatId, messageId, text, { reply_markup: keyboard });
    } else {
      await this.telegram.sendMessage(chatId, text, { reply_markup: keyboard });
    }
  }

  /**
   * Muestra la ficha de un ítem por código
   */
  private async sendItemDetail(chatId: number, itemCode: string): Promise<void> {
    const item = await this.projectExecution.getItemByCodeOrId(itemCode);
    if (!item) {
      await this.telegram.sendMessage(
        chatId,
        `⚠️ Elemento <code>${itemCode}</code> no encontrado en la base de datos.`
      );
      return;
    }

    const text =
      `<b>🔍 FICHA TÉCNICA DEL ELEMENTO</b>\n\n` +
      `• <b>Código:</b> <code>${item.code}</code>\n` +
      `• <b>Nombre:</b> ${item.name}\n` +
      `• <b>Modelo:</b> ${item.model}\n` +
      `• <b>Zona:</b> ${item.zone}\n` +
      `• <b>Estado actual:</b> ${item.status === 'installed' ? '✅ Instalado' : '⏳ Pendiente'}\n` +
      `• <b>Cantidad:</b> ${item.quantity} ${item.unit}\n` +
      (item.installerTeam ? `• <b>Cuadrilla:</b> ${item.installerTeam}\n` : '') +
      (item.photoUrl ? `• <b>Foto:</b> <a href="${item.photoUrl}">Ver Evidencia</a>\n` : '');

    const buttons: InlineKeyboardButton[][] = [];
    if (item.status === 'pending') {
      buttons.push([{ text: '🛠️ Registrar Instalación Ahora', callback_data: `i:${item.id}` }]);
    }
    buttons.push([{ text: '🏁 Menú Principal', callback_data: 'nav:menu' }]);

    await this.telegram.sendMessage(chatId, text, {
      reply_markup: { inline_keyboard: buttons },
    });
  }
}

function createProgressBar(percent: number): string {
  const totalBars = 10;
  const filledBars = Math.min(totalBars, Math.max(0, Math.round((percent / 100) * totalBars)));
  const emptyBars = totalBars - filledBars;
  return '█'.repeat(filledBars) + '░'.repeat(emptyBars);
}
