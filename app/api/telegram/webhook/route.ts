import { NextRequest, NextResponse } from 'next/server';
import { TelegramHandlerService } from '@/src/services/telegram-handler.service';
import { validateServerEnv } from '@/src/config/env';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const env = validateServerEnv();

    // 1. Verificación de seguridad mediante Secret Token si está configurado
    const secretHeader = req.headers.get('x-telegram-bot-api-secret-token');
    if (env.TELEGRAM_WEBHOOK_SECRET && secretHeader !== env.TELEGRAM_WEBHOOK_SECRET) {
      console.warn('⚠️ Intento de acceso no autorizado al webhook de Telegram');
      return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 401 });
    }

    // 2. Parseo del cuerpo del mensaje
    const rawBody = await req.json();

    // 3. Procesamiento asíncrono seguro
    const handler = new TelegramHandlerService();
    await handler.handleUpdate(rawBody);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    console.error('Error al procesar webhook de Telegram:', message);
    // Respondemos 200 a Telegram para evitar reintentos continuos si es un error de formato
    return NextResponse.json({ ok: false, error: message }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    bot: '@global_solutions_it_bot',
    service: 'Global Solutions IT S.A.S. — Integración Telegram',
    timestamp: new Date().toISOString(),
  });
}
