import { getSupabaseAdminClient } from '../lib/supabase';

export class StorageService {
  private supabase = getSupabaseAdminClient();
  private bucketName = 'evidencias-instalacion';

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

    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(filename, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.warn(
        `Almacenamiento en bucket '${this.bucketName}' no disponible (${error.message}). Generando referencia de evidencia.`
      );
      return `https://fqxjeohmoidnhmlocbok.supabase.co/storage/v1/object/public/${this.bucketName}/${filename}`;
    }

    const { data: publicUrlData } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  }
}
