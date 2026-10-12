import { getSupabaseAdminClient } from '../lib/supabase';

export class StorageService {
  private supabase = getSupabaseAdminClient();
  private primaryBucket = 'evidencias-instalacion';
  private fallbackBucket = 'evidencias-obra';

  /**
   * Sube una fotografía de evidencia tomada en campo a Supabase Storage
   * Retorna la URL pública del archivo
   */
  async uploadPhoto(
    projectId: string,
    itemId: string,
    fileBuffer: Buffer,
    contentType: string = 'image/jpeg'
  ): Promise<string> {
    const sanitizedItemId = itemId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${projectId}/${sanitizedItemId}_${Date.now()}.jpg`;

    // 1. Intentar subir al bucket principal
    const { data, error } = await this.supabase.storage
      .from(this.primaryBucket)
      .upload(filename, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (!error && data) {
      const { data: publicUrlData } = this.supabase.storage
        .from(this.primaryBucket)
        .getPublicUrl(data.path);
      return publicUrlData.publicUrl;
    }

    console.warn(
      `Fallo en bucket '${this.primaryBucket}' (${error?.message}). Intentando fallback a '${this.fallbackBucket}'...`
    );

    // 2. Intentar subir al bucket de respaldo
    const { data: fallbackData, error: fallbackError } = await this.supabase.storage
      .from(this.fallbackBucket)
      .upload(filename, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (!fallbackError && fallbackData) {
      const { data: fallbackUrlData } = this.supabase.storage
        .from(this.fallbackBucket)
        .getPublicUrl(fallbackData.path);
      return fallbackUrlData.publicUrl;
    }

    throw new Error(
      `No fue posible almacenar la fotografía en Supabase Storage: ${error?.message || fallbackError?.message}`
    );
  }
}
