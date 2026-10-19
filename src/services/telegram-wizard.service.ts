import { TelegramService } from './telegram.service';
import { TelegramSessionRepository } from './telegram-session.repository';
import { ProjectExecutionService } from './project-execution.service';
import { StorageService } from './storage.service';
import { InlineKeyboardMarkup, InlineKeyboardButton } from '../schemas/telegram.schema';
import { BotSession } from '../schemas/bot-session.schema';

export class TelegramWizardService {
  constructor(
    private telegram: TelegramService,
    private sessionRepo: TelegramSessionRepository,
    private projectExecution: ProjectExecutionService,
    private storage: StorageService
  ) {}

  /**
   * Paso 1: Muestra los proyectos en obra
   */
  async startProjectSelection(chatId: number, userId: number, username?: string, messageId?: number): Promise<void> {
    const projects = await this.projectExecution.getProjects();

    const buttons: InlineKeyboardButton[][] = projects.map((p) => [
      {
        text: `🏢 ${p.name.length > 30 ? p.name.substring(0, 28) + '...' : p.name}`,
        callback_data: `p:${p.id}`,
      },
    ]);

    buttons.push([{ text: '❌ Cancelar', callback_data: 'nav:cancel' }]);

    const keyboard: InlineKeyboardMarkup = { inline_keyboard: buttons };
    const text =
      `<b>🏢 PASO 1: SELECCIONA EL PROYECTO EN OBRA</b>\n\n` +
      `Selecciona el frente de trabajo activo donde te encuentras:`;

    await this.sessionRepo.saveSession({
      chatId,
      userId,
      username,
      step: 'SELECT_PROJECT',
      payload: {},
    });

    if (messageId) {
      await this.telegram.editMessageText(chatId, messageId, text, { reply_markup: keyboard });
    } else {
      await this.telegram.sendMessage(chatId, text, { reply_markup: keyboard });
    }
  }

  /**
   * Paso 2: Muestra los niveles/pisos con prioridad a los que están en ejecución
   */
  async handleProjectSelected(
    session: BotSession,
    projectId: string,
    messageId: number
  ): Promise<void> {
    const project = await this.projectExecution.getProject(projectId);
    const floors = await this.projectExecution.getFloors(projectId);

    if (!project || floors.length === 0) {
      await this.telegram.editMessageText(chatId(session), messageId, '⚠️ No se encontraron pisos para este proyecto.');
      return;
    }

    // Filtrar pisos en ejecución o con menos del 100% de avance
    const activeFloors = floors.filter(
      (f) => f.progressPercentage < 100 || f.floorType === 'ejecucion'
    );
    const floorsToShow = activeFloors.length > 0 ? activeFloors : floors.slice(-8);

    const buttons: InlineKeyboardButton[][] = [];

    const getFloorLabel = (f: typeof floorsToShow[0]) => {
      if (f.name && !f.name.startsWith('Zona / Nivel')) {
        const clean = f.name.replace(/\s*\([^)]*\)/g, '').trim();
        return clean.length > 18 ? clean.substring(0, 16) + '..' : clean;
      }
      return `Nivel ${f.floorNumber}`;
    };

    // Agrupar pisos de 2 en 2 para que sea cómodo al tacto
    for (let i = 0; i < floorsToShow.length; i += 2) {
      const row: InlineKeyboardButton[] = [];
      const f1 = floorsToShow[i];
      row.push({
        text: `📍 ${getFloorLabel(f1)} (${f1.progressPercentage}%)`,
        callback_data: `f:${f1.floorNumber}`,
      });

      if (i + 1 < floorsToShow.length) {
        const f2 = floorsToShow[i + 1];
        row.push({
          text: `📍 ${getFloorLabel(f2)} (${f2.progressPercentage}%)`,
          callback_data: `f:${f2.floorNumber}`,
        });
      }
      buttons.push(row);
    }

    buttons.push([
      { text: '🔙 Cambiar Proyecto', callback_data: 'nav:start' },
      { text: '❌ Cancelar', callback_data: 'nav:cancel' },
    ]);

    const text =
      `<b>📍 PASO 2: UBICACIÓN DEL EQUIPO</b>\n\n` +
      `<b>Proyecto:</b> ${project.name}\n` +
      `Selecciona el nivel o piso donde estás instalando:`;

    await this.sessionRepo.saveSession({
      ...session,
      step: 'SELECT_FLOOR',
      payload: {
        ...session.payload,
        projectId,
        projectName: project.name,
      },
    });

    await this.telegram.editMessageText(chatId(session), messageId, text, {
      reply_markup: { inline_keyboard: buttons },
    });
  }

  /**
   * Paso 3: Muestra filtros o la lista de equipos pendientes del piso
   */
  async handleFloorSelected(
    session: BotSession,
    floorNumber: number,
    messageId: number,
    categoryFilter?: string
  ): Promise<void> {
    const defaultProj = (await this.projectExecution.getProjects())[0]?.id || '';
    const projId = session.payload.projectId || defaultProj;

    // Si aún no se ha seleccionado categoría, presentar el menú de segmentación por tipo de equipo
    if (!categoryFilter) {
      const allPending = await this.projectExecution.getPendingItemsByFloor(projId, floorNumber);
      const buttons: InlineKeyboardButton[][] = [
        [
          { text: '🚨 Detectores de Humo', callback_data: 'cat:humo' },
          { text: '🛑 Estaciones Manuales', callback_data: 'cat:palanca' },
        ],
        [
          { text: '🔥 Detectores Térmicos', callback_data: 'cat:termico' },
          { text: '📢 Sirenas con Estrobo', callback_data: 'cat:sirena' },
        ],
        [
          { text: '💨 Detectores Monóxido CO', callback_data: 'cat:monoxido' },
          { text: '🔧 Tubería EMT', callback_data: 'cat:tuberia' },
        ],
        [
          { text: '🔴 Cableado FPLR', callback_data: 'cat:cableado' },
          { text: '📋 Ver Todo el Piso', callback_data: 'cat:all' },
        ],
        [
          { text: '🔙 Cambiar Piso', callback_data: `p:${projId}` },
          { text: '❌ Cancelar', callback_data: 'nav:cancel' },
        ],
      ];

      const text =
        `<b>🚨 PASO 3: SELECCIONA EL TIPO DE EQUIPO O BUSCA POR NOMBRE</b>\n\n` +
        `<b>Piso:</b> Nivel ${floorNumber} | <b>Total pendientes:</b> ${allPending.length}\n\n` +
        `• <b>Opción A (Por Tipo):</b> Toca el botón del tipo específico abajo.\n` +
        `• <b>Opción B (Búsqueda Libre):</b> O escribe aquí directamente el <b>recinto</b> (ej: <code>ASEO</code>, <code>CATERING</code>, <code>BODEGA</code>) o el <b>código</b> (ej: <code>F-01</code>, <code>S-15</code>, <code>TR-05</code>).`;

      await this.sessionRepo.saveSession({
        ...session,
        step: 'SELECT_ITEM',
        payload: {
          ...session.payload,
          floorNumber,
        },
      });

      await this.telegram.editMessageText(chatId(session), messageId, text, {
        reply_markup: { inline_keyboard: buttons },
      });
      return;
    }

    // Filtrar por la categoría seleccionada
    const pendingItems = await this.projectExecution.getPendingItemsByFloor(
      projId,
      floorNumber,
      categoryFilter
    );

    if (pendingItems.length === 0) {
      const keyboard: InlineKeyboardMarkup = {
        inline_keyboard: [
          [{ text: '🔄 Ver Otras Categorías', callback_data: 'cat:categories' }],
          [{ text: '🔙 Cambiar de Piso', callback_data: `p:${projId}` }],
          [{ text: '❌ Cancelar', callback_data: 'nav:cancel' }],
        ],
      };
      await this.telegram.editMessageText(
        chatId(session),
        messageId,
        `✅ <b>¡Todos los elementos de esta categoría están al día!</b>\nNo hay equipos pendientes en esta selección.`,
        { reply_markup: keyboard }
      );
      return;
    }

    const categoryLabels: Record<string, string> = {
      humo: 'Detectores de Humo (S)',
      palanca: 'Estaciones Manuales (F)',
      termico: 'Detectores Térmicos (H)',
      sirena: 'Sirenas con Estrobo (PE)',
      monoxido: 'Detectores Monóxido (CO)',
      tuberia: 'Tramos Tubería EMT',
      cableado: 'Tramos Cableado FPLR',
      all: 'Todos los Componentes',
    };

    const catTitle = categoryLabels[categoryFilter] || categoryFilter;
    const buttons: InlineKeyboardButton[][] = [];

    // Mostrar hasta 10 ítems de esta categoría
    for (const item of pendingItems.slice(0, 10)) {
      let icon = '🚨';
      if (item.type === 'palanca') icon = '🛑';
      else if (item.type === 'sirena') icon = '📢';
      else if (item.type === 'tuberia') icon = '🔧';
      else if (item.type === 'cableado') icon = '🔴';
      else if (item.name.toLowerCase().includes('térmico')) icon = '🔥';
      else if (item.type === 'detector-doble') icon = '💨';

      const roomPart = item.name.includes('-')
        ? item.name.split('-').slice(1).join('-').trim()
        : item.zone;
      const label = `${icon} ${item.code} — ${roomPart.length > 20 ? roomPart.substring(0, 18) + '..' : roomPart}`;
      buttons.push([
        {
          text: label,
          callback_data: `i:${item.id}`,
        },
      ]);
    }

    buttons.push([
      { text: '🔄 Cambiar Categoría', callback_data: 'cat:categories' },
      { text: '🔙 Cambiar Piso', callback_data: `p:${projId}` },
    ]);
    buttons.push([{ text: '❌ Cancelar', callback_data: 'nav:cancel' }]);

    const text =
      `<b>🚨 ${catTitle.toUpperCase()} PENDIENTES</b>\n\n` +
      `<b>Piso:</b> Nivel ${floorNumber} | <b>Disponibles:</b> ${pendingItems.length}\n` +
      `Toca el equipo que estás instalando (o escribe su nombre/código en el chat):`;

    await this.sessionRepo.saveSession({
      ...session,
      step: 'SELECT_ITEM',
      payload: {
        ...session.payload,
        floorNumber,
        category: categoryFilter,
      },
    });

    await this.telegram.editMessageText(chatId(session), messageId, text, {
      reply_markup: { inline_keyboard: buttons },
    });
  }

  /**
   * Búsqueda libre de equipos por recinto o código (Fusión Método 1 y 2)
   */
  async handleItemSearch(session: BotSession, queryText: string): Promise<void> {
    const floorNumber = session.payload.floorNumber ?? 0;
    const defaultProj = (await this.projectExecution.getProjects())[0]?.id || '';
    const projId = session.payload.projectId || defaultProj;

    const results = await this.projectExecution.searchPendingItemsByFloor(
      projId,
      floorNumber,
      queryText
    );

    if (results.length === 0) {
      await this.telegram.sendMessage(
        chatId(session),
        `⚠️ No se encontraron equipos pendientes en Nivel ${floorNumber} con el término <b>"${queryText}"</b>.\n\n` +
          `Prueba escribiendo otra palabra (ej: <i>CATERING</i>, <i>ASEO</i>, <i>F-01</i>, <i>S-02</i>) o toca una categoría abajo:`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🚨 Humo', callback_data: 'cat:humo' },
                { text: '🛑 Manuales', callback_data: 'cat:palanca' },
              ],
              [
                { text: '🔧 Tubería EMT', callback_data: 'cat:tuberia' },
                { text: '🔴 Cableado FPLR', callback_data: 'cat:cableado' },
              ],
              [{ text: '🔄 Ver Categorías', callback_data: 'cat:categories' }],
            ],
          },
        }
      );
      return;
    }

    if (results.length === 1) {
      const sentMsg = await this.telegram.sendMessage(chatId(session), '⏳ Abriendo ficha técnica...');
      await this.handleItemSelected(session, results[0].id, sentMsg.message_id);
      return;
    }

    const buttons: InlineKeyboardButton[][] = results.slice(0, 8).map((item) => {
      let icon = '🚨';
      if (item.type === 'palanca') icon = '🛑';
      else if (item.type === 'sirena') icon = '📢';
      else if (item.type === 'tuberia') icon = '🔧';
      else if (item.type === 'cableado') icon = '🔴';
      else if (item.name.toLowerCase().includes('térmico')) icon = '🔥';
      else if (item.type === 'detector-doble') icon = '💨';

      const roomPart = item.name.includes('-')
        ? item.name.split('-').slice(1).join('-').trim()
        : item.zone;
      const label = `${icon} ${item.code} — ${roomPart}`;
      return [
        {
          text: label.length > 34 ? label.substring(0, 32) + '..' : label,
          callback_data: `i:${item.id}`,
        },
      ];
    });

    buttons.push([
      { text: '🔄 Ver Categorías', callback_data: 'cat:categories' },
      { text: '❌ Cancelar', callback_data: 'nav:cancel' },
    ]);

    await this.telegram.sendMessage(
      chatId(session),
      `🔍 <b>Resultados para "${queryText}" en Nivel ${floorNumber} (${results.length} encontrados):</b>\n` +
        `Toca el equipo que estás instalando:`,
      { reply_markup: { inline_keyboard: buttons } }
    );
  }

  /**
   * Paso 4: Ficha técnica del equipo y selección de estado
   */
  async handleItemSelected(
    session: BotSession,
    itemId: string,
    messageId: number
  ): Promise<void> {
    const item = await this.projectExecution.getItemByCodeOrId(itemId);

    if (!item) {
      await this.telegram.editMessageText(
        chatId(session),
        messageId,
        '⚠️ Elemento no encontrado en la base de datos.'
      );
      return;
    }

    const typeLabel =
      item.type === 'tuberia'
        ? 'Tubería Conduit EMT 3/4"'
        : item.type === 'cableado'
        ? 'Cable FPLR Contra Incendio'
        : 'Dispositivo / Sensor NFPA 72';

    const text =
      `<b>📋 PASO 4: FICHA TÉCNICA Y REGISTRO</b>\n\n` +
      `• <b>Código:</b> <code>${item.code}</code>\n` +
      `• <b>Componente:</b> ${item.name}\n` +
      `• <b>Tipo:</b> ${typeLabel}\n` +
      `• <b>Modelo:</b> ${item.model}\n` +
      `• <b>Ubicación/Zona:</b> ${item.zone}\n` +
      `• <b>Metrado/Cantidad:</b> ${item.quantity} ${item.unit}\n\n` +
      `¿Qué acción deseas registrar para este elemento?`;

    const buttons: InlineKeyboardButton[][] = [
      [{ text: '✅ Marcar como Instalado & Verificado', callback_data: 'act:installed' }],
      [{ text: '⚠️ Reportar con Observación / Novedad', callback_data: 'act:inspected' }],
      [
        { text: '🔙 Seleccionar Otro Equipo', callback_data: `f:${session.payload.floorNumber || 33}` },
        { text: '❌ Cancelar', callback_data: 'nav:cancel' },
      ],
    ];

    await this.sessionRepo.saveSession({
      ...session,
      step: 'SELECT_STATUS',
      payload: {
        ...session.payload,
        itemId: item.id,
        itemCode: item.code,
        itemName: item.name,
      },
    });

    await this.telegram.editMessageText(chatId(session), messageId, text, {
      reply_markup: { inline_keyboard: buttons },
    });
  }

  /**
   * Paso 4.1: Asignación de Cuadrilla
   */
  async handleStatusSelected(
    session: BotSession,
    targetStatus: 'installed' | 'inspected',
    messageId: number
  ): Promise<void> {
    const buttons: InlineKeyboardButton[][] = [
      [{ text: '👷‍♂️ Cuadrilla Alfa — Redes & Tubería', callback_data: 'tm:alfa' }],
      [{ text: '👷‍♂️ Cuadrilla Beta — Dispositivos & Central', callback_data: 'tm:beta' }],
      [{ text: '👤 Ingeniero Residente / Supervisor', callback_data: 'tm:residente' }],
      [{ text: '❌ Cancelar', callback_data: 'nav:cancel' }],
    ];

    const text =
      `<b>👷‍♂️ SELECCIONA LA CUADRILLA RESPONSABLE</b>\n\n` +
      `Elemento: <code>${session.payload.itemCode}</code>\n` +
      `Indica quién ejecutó el montaje:`;

    await this.sessionRepo.saveSession({
      ...session,
      step: 'SELECT_TEAM',
      payload: {
        ...session.payload,
        targetStatus,
      },
    });

    await this.telegram.editMessageText(chatId(session), messageId, text, {
      reply_markup: { inline_keyboard: buttons },
    });
  }

  /**
   * Paso 4.2: Solicitud de Foto de Evidencia y Observaciones
   */
  async handleTeamSelected(
    session: BotSession,
    teamCode: string,
    messageId: number
  ): Promise<void> {
    const teamName =
      teamCode === 'alfa'
        ? 'Cuadrilla Alfa'
        : teamCode === 'beta'
        ? 'Cuadrilla Beta'
        : 'Ing. Residente';

    const buttons: InlineKeyboardButton[][] = [
      [{ text: '📝 Escribir Observación Técnica', callback_data: 'act:prompt_notes' }],
      [{ text: '⏭️ Omitir Foto y Observaciones', callback_data: 'act:skip_photo' }],
      [{ text: '❌ Cancelar Registro', callback_data: 'nav:cancel' }],
    ];

    const text =
      `<b>📸 ADJUNTA EVIDENCIA FOTOGRÁFICA</b>\n\n` +
      `Elemento: <code>${session.payload.itemCode}</code>\n` +
      `Responsable: ${teamName}\n\n` +
      `👉 <b>Toma una foto con la cámara de tu celular y envíala a este chat</b> para adjuntarla al acta de obra (puedes escribir tus observaciones en el texto de la foto).\n\n` +
      `<i>O pulsa "Escribir Observación Técnica" para detallar el montaje sin foto.</i>`;

    await this.sessionRepo.saveSession({
      ...session,
      step: 'AWAITING_PHOTO',
      payload: {
        ...session.payload,
        installerTeam: teamName,
      },
    });

    await this.telegram.editMessageText(chatId(session), messageId, text, {
      reply_markup: { inline_keyboard: buttons },
    });
  }

  /**
   * Solicita observaciones técnicas por escrito al instalador
   */
  async promptNotes(session: BotSession, messageId?: number): Promise<void> {
    const text =
      `<b>📝 PASO: OBSERVACIONES TÉCNICAS DE CAMPO</b>\n\n` +
      `Elemento: <code>${session.payload.itemCode || 'Equipo'}</code>\n\n` +
      `👉 <b>Escribe en este chat tus observaciones sobre la instalación:</b>\n` +
      `<i>(Ej: soporte antisísmico instalado, cable fijado con abrazaderas, conexiones verificadas)</i>`;

    const buttons: InlineKeyboardButton[][] = [
      [{ text: '⏭️ Omitir Observaciones', callback_data: 'act:skip_notes' }],
      [{ text: '❌ Cancelar', callback_data: 'nav:cancel' }],
    ];

    await this.sessionRepo.saveSession({
      ...session,
      step: 'AWAITING_NOTES',
    });

    if (messageId) {
      await this.telegram.editMessageText(chatId(session), messageId, text, {
        reply_markup: { inline_keyboard: buttons },
      });
    } else {
      await this.telegram.sendMessage(chatId(session), text, {
        reply_markup: { inline_keyboard: buttons },
      });
    }
  }

  /**
   * Procesa texto de observaciones recibido del instalador
   */
  async handleNotesReceived(session: BotSession, notesText: string): Promise<void> {
    const updatedSession: BotSession = {
      ...session,
      payload: {
        ...session.payload,
        notes: notesText,
      },
    };
    await this.finalizeInstallation(updatedSession, session.payload.photoUrl);
  }

  /**
   * Paso 5: Guarda la instalación y muestra el resumen con nuevo porcentaje de avance
   */
  async finalizeInstallation(
    session: BotSession,
    photoUrl?: string,
    messageId?: number
  ): Promise<void> {
    const { itemId, installerTeam, targetStatus, projectId, floorNumber, notes } = session.payload;

    if (!itemId) {
      await this.telegram.sendMessage(chatId(session), '⚠️ Error: No hay elemento seleccionado.');
      return;
    }

    const userNotes = notes?.trim();
    const finalNotes =
      userNotes && userNotes.length > 0
        ? userNotes
        : `Registrado vía Telegram Bot (@${session.username || 'usuario'})`;

    // 1. Guardar en Supabase
    const result = await this.projectExecution.registerInstallation(itemId, {
      status: targetStatus || 'installed',
      team: installerTeam || 'Técnico Instalador',
      photoUrl,
      notes: finalNotes,
      capturedBy: installerTeam || 'Técnico Telegram',
    });

    // 2. Limpiar sesión
    await this.sessionRepo.clearSession(chatId(session));

    // 3. Formatear confirmación
    const text =
      `<b>🎉 ¡INSTALACIÓN REGISTRADA EXITOSAMENTE!</b>\n\n` +
      `• <b>Elemento:</b> <code>${result.updatedItem.code}</code>\n` +
      `• <b>Descripción:</b> ${result.updatedItem.name}\n` +
      `• <b>Ubicación:</b> ${result.updatedItem.zone}\n` +
      `• <b>Responsable:</b> ${result.updatedItem.installerTeam}\n` +
      `• <b>Evidencia:</b> ${photoUrl ? '📸 Foto cargada y vinculada' : 'Sin foto adjunta'}\n` +
      (userNotes ? `• <b>Observaciones:</b> <i>${userNotes}</i>\n\n` : `\n`) +
      `<b>📈 NUEVO AVANCE DE OBRA CALCULADO:</b>\n` +
      `• <b>Nivel ${floorNumber ?? 'Actual'}:</b> ${result.floorProgress}%\n` +
      `• <b>Avance Global del Proyecto:</b> ${result.globalProgress}%\n\n` +
      `<i>ℹ️ Al recargar la plataforma en el computador ya verás el equipo en verde y los porcentajes actualizados.</i>`;

    const buttons: InlineKeyboardButton[][] = [
      [
        {
          text: `➕ Registrar Otro Equipo en Nivel ${floorNumber ?? ''}`,
          callback_data: `f:${floorNumber ?? 1}`,
        },
      ],
      [{ text: '🏢 Cambiar de Piso / Proyecto', callback_data: `p:${projectId || (await this.projectExecution.getProjects())[0]?.id || ''}` }],
      [{ text: '🏁 Menú Principal', callback_data: 'nav:menu' }],
    ];

    const keyboard: InlineKeyboardMarkup = { inline_keyboard: buttons };

    if (messageId) {
      await this.telegram.editMessageText(chatId(session), messageId, text, { reply_markup: keyboard });
    } else {
      await this.telegram.sendMessage(chatId(session), text, { reply_markup: keyboard });
    }
  }

  /**
   * Procesa una fotografía enviada por el técnico mientras estaba en AWAITING_PHOTO
   */
  async handleIncomingPhoto(
    session: BotSession,
    fileId: string,
    caption?: string
  ): Promise<void> {
    await this.telegram.sendMessage(chatId(session), '⏳ Procesando y almacenando fotografía de evidencia...');

    const updatedPayload = { ...session.payload };
    if (caption && caption.trim().length > 0) {
      updatedPayload.notes = caption.trim();
    }

    const updatedSession: BotSession = {
      ...session,
      payload: updatedPayload,
    };

    try {
      const filePath = await this.telegram.getFilePath(fileId);
      const fileBuffer = await this.telegram.downloadFile(filePath);

      const defaultProj = (await this.projectExecution.getProjects())[0]?.id || '';
      const projId = session.payload.projectId || defaultProj;
      const itemId = session.payload.itemId || 'item';

      const photoUrl = await this.storage.uploadPhoto(projId, itemId, fileBuffer, 'image/jpeg');

      await this.finalizeInstallation(updatedSession, photoUrl);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Error al procesar foto de Telegram:', msg);
      await this.telegram.sendMessage(
        chatId(session),
        `⚠️ Hubo un detalle al procesar la foto (${msg}), guardando registro sin fotografía...`
      );
      await this.finalizeInstallation(updatedSession);
    }
  }
}

function chatId(session: BotSession): number {
  return session.chatId;
}
