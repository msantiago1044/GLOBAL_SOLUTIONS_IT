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
      if (session && (session.step === 'AWAITING_PHOTO' || session.step === 'AWAITING_NOTES')) {
        const highestResPhoto = message.photo[message.photo.length - 1];
        await this.wizard.handleIncomingPhoto(session, highestResPhoto.file_id, message.caption);
        return;
      }
    }

    // 1.1 Si el usuario está en el paso interactivo (observaciones o búsqueda libre de equipos)
    if (text && !text.startsWith('/')) {
      const session = await this.sessionRepo.getSession(chatId);
      if (session && session.step === 'AWAITING_NOTES') {
        await this.wizard.handleNotesReceived(session, text);
        return;
      }
      if (session && session.step === 'SELECT_ITEM') {
        await this.wizard.handleItemSearch(session, text);
        return;
      }
    }

    // 2. Procesar Comandos de Texto
    if (text.startsWith('/start') || text.startsWith('/menu')) {
      await this.sendMainMenu(chatId, message.from?.first_name || 'Ingeniero');
      return;
    }

    if (text.startsWith('/avance')) {
      await this.sendSelectProjectForAvance(chatId);
      return;
    }

    if (text.startsWith('/pendientes')) {
      await this.sendSelectProjectForPendientes(chatId);
      return;
    }

    if (text.startsWith('/item')) {
      const parts = text.split(' ');
      const itemCode = parts[1];
      if (!itemCode) {
        await this.telegram.sendMessage(
          chatId,
          '⚠️ Debes especificar el código del ítem. Ejemplo: <code>/item TUB-RIS-01</code>'
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
      await this.wizard.startProjectSelection(chatId, userId, username);
      return;
    }

    if (text.startsWith('/cancelar')) {
      await this.sessionRepo.clearSession(chatId);
      await this.telegram.sendMessage(chatId, '✅ Operación cancelada. Escribe /menu para volver.');
      return;
    }

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

    await this.telegram.answerCallbackQuery(cb.id);

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

    // --- ENRUTAMIENTO DE ACCIONES ---

    // 1. Menú Principal y Navegación General
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

    // 2. Consulta de Avance con Selección de Proyecto
    if (data === 'nav:avance') {
      await this.sendSelectProjectForAvance(chatId, messageId);
      return;
    }

    if (data.startsWith('av_p:')) {
      const projId = data.substring(5);
      await this.sendAvanceReport(chatId, projId, undefined, messageId);
      return;
    }

    if (data.startsWith('av_f:')) {
      const [, projId, floorStr] = data.split(':');
      const floorNum = parseInt(floorStr, 10);
      await this.sendAvanceReport(chatId, projId, floorNum, messageId);
      return;
    }

    // 3. Consulta de Pendientes con Selección de Proyecto y Piso
    if (data === 'nav:pendientes') {
      await this.sendSelectProjectForPendientes(chatId, messageId);
      return;
    }

    if (data.startsWith('pen_p:')) {
      const projId = data.substring(6);
      await this.sendSelectFloorForPendientes(chatId, projId, messageId);
      return;
    }

    if (data.startsWith('pen_f:')) {
      const [, projId, floorStr] = data.split(':');
      const floorNum = parseInt(floorStr, 10);
      await this.sendPendingItemsReport(chatId, projId, floorNum, messageId);
      return;
    }

    // 4. Wizard de Instalación Paso a Paso
    if (data.startsWith('p:')) {
      const projId = data.substring(2);
      await this.wizard.handleProjectSelected(session, projId, messageId);
      return;
    }

    if (data.startsWith('f:')) {
      const floorNum = parseInt(data.substring(2), 10);
      await this.wizard.handleFloorSelected(session, floorNum, messageId);
      return;
    }

    if (data.startsWith('cat:')) {
      const category = data.substring(4);
      const floorNum = session.payload.floorNumber ?? 0;
      await this.wizard.handleFloorSelected(
        session,
        floorNum,
        messageId,
        category === 'categories' ? undefined : category
      );
      return;
    }

    if (data.startsWith('i:')) {
      const itemId = data.substring(2);
      await this.wizard.handleItemSelected(session, itemId, messageId);
      return;
    }

    if (data.startsWith('act:')) {
      const act = data.substring(4);
      if (act === 'installed' || act === 'inspected') {
        await this.wizard.handleStatusSelected(session, act, messageId);
        return;
      }
      if (act === 'prompt_notes') {
        await this.wizard.promptNotes(session, messageId);
        return;
      }
      if (act === 'skip_notes') {
        await this.wizard.finalizeInstallation(session, session.payload.photoUrl, messageId);
        return;
      }
      if (act === 'skip_photo') {
        await this.wizard.finalizeInstallation(session, undefined, messageId);
        return;
      }
    }

    if (data.startsWith('tm:')) {
      const teamCode = data.substring(3);
      await this.wizard.handleTeamSelected(session, teamCode, messageId);
      return;
    }
  }

  /**
   * Menú Principal con Botones
   */
  private async sendMainMenu(chatId: number, userName: string, messageId?: number): Promise<void> {
    const text =
      `<b>🛡️ GLOBAL SOLUTIONS IT S.A.S. — CONTROL DE OBRA NFPA 72</b>\n\n` +
      `Bienvenido, <b>${userName}</b>.\n` +
      `Selecciona la acción que deseas realizar en obra:`;

    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          { text: '📊 Consultar Avance', callback_data: 'nav:avance' },
          { text: '📋 Ver Ítems Pendientes', callback_data: 'nav:pendientes' },
        ],
        [
          { text: '🛠️ Registrar Instalación', callback_data: 'nav:start' },
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
   * Pantalla para preguntar de qué proyecto se desea consultar el avance
   */
  private async sendSelectProjectForAvance(chatId: number, messageId?: number): Promise<void> {
    const projects = await this.projectExecution.getProjects();

    const buttons: InlineKeyboardButton[][] = projects.map((p) => [
      {
        text: `🏢 ${p.name}`,
        callback_data: `av_p:${p.id}`,
      },
    ]);

    buttons.push([{ text: '🔙 Menú Principal', callback_data: 'nav:menu' }]);

    const text =
      `<b>📊 CONSULTAR AVANCE DE OBRA</b>\n\n` +
      `Tienes <b>${projects.length}</b> proyectos registrados.\n` +
      `¿De qué proyecto deseas ver el avance?`;

    if (messageId) {
      await this.telegram.editMessageText(chatId, messageId, text, {
        reply_markup: { inline_keyboard: buttons },
      });
    } else {
      await this.telegram.sendMessage(chatId, text, {
        reply_markup: { inline_keyboard: buttons },
      });
    }
  }

  /**
   * Genera el informe de avance global o por nivel para el proyecto seleccionado
   */
  private async sendAvanceReport(
    chatId: number,
    projectId: string,
    floorNumber?: number,
    messageId?: number
  ): Promise<void> {
    const stats = await this.projectExecution.getProjectStats(projectId);
    if (!stats) {
      const errorText = '⚠️ No fue posible consultar las estadísticas del proyecto.';
      if (messageId) await this.telegram.editMessageText(chatId, messageId, errorText);
      else await this.telegram.sendMessage(chatId, errorText);
      return;
    }

    let text = '';
    const buttons: InlineKeyboardButton[][] = [];

    if (floorNumber !== undefined) {
      const floors = await this.projectExecution.getFloors(projectId);
      const targetFloor = floors.find((f) => f.floorNumber === floorNumber);
      const pendingItems = await this.projectExecution.getPendingItemsByFloor(projectId, floorNumber);

      const progress = targetFloor?.progressPercentage ?? 0;
      const bar = createProgressBar(progress);

      text =
        `<b>📊 AVANCE NIVEL ${floorNumber} — ${stats.project.name.toUpperCase()}</b>\n\n` +
        `Avance del Nivel: <b>${progress}%</b>\n` +
        `<code>${bar}</code>\n\n` +
        `• <b>Equipos pendientes:</b> ${pendingItems.length}\n`;

      if (pendingItems.length > 0) {
        text += `\n<b>Pendientes en este nivel:</b>\n`;
        for (const it of pendingItems.slice(0, 5)) {
          text += `• <code>${it.code}</code>: ${it.name} (${it.zone})\n`;
        }
      }

      buttons.push([
        { text: `🛠️ Instalar en Nivel ${floorNumber}`, callback_data: `f:${floorNumber}` },
      ]);
      buttons.push([{ text: '🔙 Ver Todo el Proyecto', callback_data: `av_p:${projectId}` }]);
    } else {
      const globalProgress = stats.project.globalProgress;
      const bar = createProgressBar(globalProgress);

      const tubPercent =
        stats.tuberiaMetrosTotal > 0
          ? Math.round((stats.tuberiaMetrosInstalled / stats.tuberiaMetrosTotal) * 100)
          : 0;
      const cablePercent =
        stats.cableMetrosTotal > 0
          ? Math.round((stats.cableMetrosInstalled / stats.cableMetrosTotal) * 100)
          : 0;

      text =
        `<b>📊 AVANCE GLOBAL — ${stats.project.name.toUpperCase()}</b>\n\n` +
        `• <b>Cliente:</b> ${stats.project.client}\n` +
        `• <b>Sistema:</b> ${stats.project.systemType}\n\n` +
        `Avance Consolidado: <b>${globalProgress}%</b>\n` +
        `<code>${bar}</code>\n\n` +
        `<b>Desglose Técnico:</b>\n` +
        `• <b>Tubería Conduit EMT:</b> ${stats.tuberiaMetrosInstalled}m / ${stats.tuberiaMetrosTotal}m (${tubPercent}%)\n` +
        `• <b>Cableado FPLR SLC:</b> ${stats.cableMetrosInstalled}m / ${stats.cableMetrosTotal}m (${cablePercent}%)\n` +
        `• <b>Dispositivos/Sensores:</b> ${stats.sensoresInstalled} / ${stats.sensoresTotal} instalados\n\n` +
        `<b>Zonas / Pisos (${stats.floorsCount} en total):</b>\n`;

      const floorsToShow = stats.activeFloors.length > 0 ? stats.activeFloors.slice(0, 6) : [];
      for (const f of floorsToShow) {
        text += `• ${f.name}: <b>${f.progressPercentage}%</b>\n`;
      }

      const floorButtons: InlineKeyboardButton[] = floorsToShow.slice(0, 4).map((f) => ({
        text: `📍 Nivel ${f.floorNumber}`,
        callback_data: `av_f:${projectId}:${f.floorNumber}`,
      }));
      if (floorButtons.length > 0) buttons.push(floorButtons);

      buttons.push([
        { text: '🛠️ Registrar Instalación en este Proyecto', callback_data: `p:${projectId}` },
      ]);
      buttons.push([{ text: '🏢 Cambiar de Proyecto', callback_data: 'nav:avance' }]);
    }

    buttons.push([{ text: '🏁 Menú Principal', callback_data: 'nav:menu' }]);

    if (messageId) {
      await this.telegram.editMessageText(chatId, messageId, text, {
        reply_markup: { inline_keyboard: buttons },
      });
    } else {
      await this.telegram.sendMessage(chatId, text, {
        reply_markup: { inline_keyboard: buttons },
      });
    }
  }

  /**
   * Selector de proyecto para consultar pendientes
   */
  private async sendSelectProjectForPendientes(chatId: number, messageId?: number): Promise<void> {
    const projects = await this.projectExecution.getProjects();

    const buttons: InlineKeyboardButton[][] = projects.map((p) => [
      {
        text: `🏢 ${p.name}`,
        callback_data: `pen_p:${p.id}`,
      },
    ]);

    buttons.push([{ text: '🔙 Menú Principal', callback_data: 'nav:menu' }]);

    const text =
      `<b>📋 VER ÍTEMS PENDIENTES</b>\n\n` +
      `Selecciona el proyecto que deseas inspeccionar:`;

    if (messageId) {
      await this.telegram.editMessageText(chatId, messageId, text, {
        reply_markup: { inline_keyboard: buttons },
      });
    } else {
      await this.telegram.sendMessage(chatId, text, {
        reply_markup: { inline_keyboard: buttons },
      });
    }
  }

  /**
   * Selector de piso/zona para ver pendientes
   */
  private async sendSelectFloorForPendientes(
    chatId: number,
    projectId: string,
    messageId: number
  ): Promise<void> {
    const project = await this.projectExecution.getProject(projectId);
    const floors = await this.projectExecution.getFloors(projectId);

    const buttons: InlineKeyboardButton[][] = [];
    for (let i = 0; i < floors.length; i += 2) {
      const row: InlineKeyboardButton[] = [];
      const f1 = floors[i];
      row.push({
        text: `📍 ${f1.name.length > 20 ? f1.name.substring(0, 18) + '..' : f1.name}`,
        callback_data: `pen_f:${projectId}:${f1.floorNumber}`,
      });
      if (i + 1 < floors.length) {
        const f2 = floors[i + 1];
        row.push({
          text: `📍 ${f2.name.length > 20 ? f2.name.substring(0, 18) + '..' : f2.name}`,
          callback_data: `pen_f:${projectId}:${f2.floorNumber}`,
        });
      }
      buttons.push(row);
    }

    buttons.push([
      { text: '🏢 Cambiar Proyecto', callback_data: 'nav:pendientes' },
      { text: '🏁 Menú Principal', callback_data: 'nav:menu' },
    ]);

    const text =
      `<b>📋 PENDIENTES — ${project?.name.toUpperCase()}</b>\n\n` +
      `Selecciona la zona o piso a consultar:`;

    await this.telegram.editMessageText(chatId, messageId, text, {
      reply_markup: { inline_keyboard: buttons },
    });
  }

  /**
   * Muestra la lista de elementos pendientes de un piso con botones para instalarlos
   */
  private async sendPendingItemsReport(
    chatId: number,
    projectId: string,
    floorNumber: number,
    messageId: number
  ): Promise<void> {
    const items = await this.projectExecution.getPendingItemsByFloor(projectId, floorNumber);

    let text = `<b>📋 ELEMENTOS PENDIENTES — NIVEL ${floorNumber}</b>\n\n`;
    const buttons: InlineKeyboardButton[][] = [];

    if (items.length === 0) {
      text += `✅ ¡Todos los elementos de este nivel están completamente instalados!\n`;
    } else {
      text += `Se encontraron <b>${items.length}</b> elementos por instalar.\nToca cualquiera para registrar su montaje:\n\n`;
      for (const it of items.slice(0, 6)) {
        buttons.push([
          {
            text: `🛠️ ${it.code} — ${it.name.length > 25 ? it.name.substring(0, 23) + '..' : it.name}`,
            callback_data: `i:${it.id}`,
          },
        ]);
      }
    }

    buttons.push([
      { text: '📍 Cambiar de Zona / Piso', callback_data: `pen_p:${projectId}` },
      { text: '🏁 Menú Principal', callback_data: 'nav:menu' },
    ]);

    await this.telegram.editMessageText(chatId, messageId, text, {
      reply_markup: { inline_keyboard: buttons },
    });
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
