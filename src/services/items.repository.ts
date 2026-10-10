import { getSupabaseClient } from '../lib/supabase';
import {
  FloorItem,
  FloorItemSchema,
  UpdateItemStatusPayload,
  UpdateItemStatusSchema,
} from '../schemas/floor-item.schema';

export class ItemsRepository {
  private supabase = getSupabaseClient();

  /**
   * Obtiene todos los elementos de un piso específico validados con Zod
   */
  async getItemsByFloor(projectId: string, floorNumber: number): Promise<FloorItem[]> {
    // 1. Obtener ID del piso
    const { data: floor, error: floorError } = await this.supabase
      .from('floors')
      .select('id')
      .eq('project_id', projectId)
      .eq('floor_number', floorNumber)
      .single();

    if (floorError || !floor) {
      console.warn(`Piso ${floorNumber} no encontrado en Supabase:`, floorError?.message);
      return [];
    }

    // 2. Obtener elementos asociados
    const { data: items, error: itemsError } = await this.supabase
      .from('floor_items')
      .select('*')
      .eq('floor_id', floor.id);

    if (itemsError || !items) {
      throw new Error(`Error al consultar elementos del piso: ${itemsError?.message}`);
    }

    // 3. Validación y mapeo estricto con Zod
    return items.map((raw) => {
      const parsed = FloorItemSchema.safeParse({
        id: raw.id,
        floorId: raw.floor_id,
        projectId: raw.project_id,
        code: raw.code,
        type: raw.type,
        name: raw.name,
        model: raw.model,
        zone: raw.zone,
        status: raw.status,
        quantity: Number(raw.quantity),
        unit: raw.unit,
        unitPrice: Number(raw.unit_price),
        photoUrl: raw.photo_url,
        notes: raw.notes,
        installedAt: raw.installed_at,
        installerTeam: raw.installer_team,
      });

      if (!parsed.success) {
        console.error(`Elemento ${raw.id} no cumple esquema Zod:`, parsed.error.format());
        throw new Error(`Error de validación Zod en elemento ${raw.id}`);
      }

      return parsed.data;
    });
  }

  /**
   * Actualiza el estado y metadatos de un elemento en Supabase con validación Zod previa
   */
  async updateItemStatus(
    itemId: string,
    payload: UpdateItemStatusPayload
  ): Promise<FloorItem> {
    // 1. Validar payload de entrada con Zod
    const validatedPayload = UpdateItemStatusSchema.parse(payload);

    // 2. Ejecutar actualización en Supabase
    const updateData: Record<string, string | null | undefined> = {
      status: validatedPayload.status,
      updated_at: new Date().toISOString(),
    };

    if (validatedPayload.notes !== undefined) updateData.notes = validatedPayload.notes;
    if (validatedPayload.installedAt !== undefined) updateData.installed_at = validatedPayload.installedAt;
    if (validatedPayload.installerTeam !== undefined) updateData.installer_team = validatedPayload.installerTeam;
    if (validatedPayload.photoUrl !== undefined) updateData.photo_url = validatedPayload.photoUrl;

    const { data, error } = await this.supabase
      .from('floor_items')
      .update(updateData)
      .eq('id', itemId)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Error al actualizar elemento ${itemId} en Supabase: ${error?.message}`);
    }

    // 3. Validar respuesta con Zod
    return FloorItemSchema.parse({
      id: data.id,
      floorId: data.floor_id,
      projectId: data.project_id,
      code: data.code,
      type: data.type,
      name: data.name,
      model: data.model,
      zone: data.zone,
      status: data.status,
      quantity: Number(data.quantity),
      unit: data.unit,
      unitPrice: Number(data.unit_price),
      photoUrl: data.photo_url,
      notes: data.notes,
      installedAt: data.installed_at,
      installerTeam: data.installer_team,
    });
  }

  /**
   * Suscripción en tiempo real (Supabase Realtime) a cambios de estado en floor_items
   */
  subscribeToChanges(
    projectId: string,
    onChange: (updatedItem: FloorItem) => void
  ): () => void {
    const channel = this.supabase
      .channel(`realtime-floor-items-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'floor_items',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          const raw = payload.new as Record<string, unknown>;
          const parsed = FloorItemSchema.safeParse({
            id: raw.id,
            floorId: raw.floor_id,
            projectId: raw.project_id,
            code: raw.code,
            type: raw.type,
            name: raw.name,
            model: raw.model,
            zone: raw.zone,
            status: raw.status,
            quantity: Number(raw.quantity),
            unit: raw.unit,
            unitPrice: Number(raw.unit_price),
            photoUrl: raw.photo_url,
            notes: raw.notes,
            installedAt: raw.installed_at,
            installerTeam: raw.installer_team,
          });

          if (parsed.success) {
            onChange(parsed.data);
          }
        }
      )
      .subscribe();

    return () => {
      this.supabase.removeChannel(channel);
    };
  }
}
