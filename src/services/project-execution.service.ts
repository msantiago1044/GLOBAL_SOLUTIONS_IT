import { getSupabaseAdminClient } from '../lib/supabase';
import { Database } from '../types/database.types';
import { FloorItem, FloorItemSchema } from '../schemas/floor-item.schema';
import { Project, ProjectSchema } from '../schemas/project.schema';

type FloorItemUpdate = Database['public']['Tables']['floor_items']['Update'];

export interface FloorSummary {
  id: string;
  projectId: string;
  floorNumber: number;
  name: string;
  floorType: string;
  progressPercentage: number;
}

export interface ProjectStats {
  project: Project;
  floorsCount: number;
  activeFloors: FloorSummary[];
  totalItems: number;
  installedItems: number;
  pendingItems: number;
  tuberiaMetrosTotal: number;
  tuberiaMetrosInstalled: number;
  cableMetrosTotal: number;
  cableMetrosInstalled: number;
  sensoresTotal: number;
  sensoresInstalled: number;
}

export class ProjectExecutionService {
  private supabase = getSupabaseAdminClient();

  /**
   * Obtiene todos los proyectos registrados
   */
  async getProjects(): Promise<Project[]> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .neq('id', 'torre-titanium')
      .order('name');

    if (error || !data) {
      console.error('Error al consultar proyectos:', error?.message);
      return [];
    }

    return data.map((raw) =>
      ProjectSchema.parse({
        id: raw.id,
        name: raw.name,
        client: raw.client,
        address: raw.address,
        contractor: raw.contractor,
        interventoria: raw.interventoria,
        systemType: raw.system_type,
        totalFloors: raw.total_floors,
        globalProgress: Number(raw.global_progress),
        schemaStatus: raw.schema_status || 'locked',
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
      })
    );
  }

  /**
   * Obtiene un proyecto por su ID
   */
  async getProject(projectId: string): Promise<Project | null> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .maybeSingle();

    if (error || !data) return null;

    return ProjectSchema.parse({
      id: data.id,
      name: data.name,
      client: data.client,
      address: data.address,
      contractor: data.contractor,
      interventoria: data.interventoria,
      systemType: data.system_type,
      totalFloors: data.total_floors,
      globalProgress: Number(data.global_progress),
      schemaStatus: data.schema_status || 'locked',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  }

  /**
   * Obtiene los pisos de un proyecto
   */
  async getFloors(projectId: string): Promise<FloorSummary[]> {
    const { data, error } = await this.supabase
      .from('floors')
      .select('*')
      .eq('project_id', projectId)
      .order('floor_number');

    if (error || !data) return [];

    return data.map((raw) => ({
      id: raw.id,
      projectId: raw.project_id,
      floorNumber: raw.floor_number,
      name: raw.name,
      floorType: raw.floor_type,
      progressPercentage: Number(raw.progress_percentage),
    }));
  }

  /**
   * Obtiene los ítems pendientes de un piso específico
   */
  async getPendingItemsByFloor(
    projectId: string,
    floorNumber: number,
    categoryFilter?: string
  ): Promise<FloorItem[]> {
    // 1. Obtener piso
    const { data: floor } = await this.supabase
      .from('floors')
      .select('id')
      .eq('project_id', projectId)
      .eq('floor_number', floorNumber)
      .maybeSingle();

    if (!floor) return [];

    // 2. Consultar elementos en estado 'pending'
    let query = this.supabase
      .from('floor_items')
      .select('*')
      .eq('floor_id', floor.id)
      .eq('status', 'pending');

    if (categoryFilter && categoryFilter !== 'all') {
      if (categoryFilter === 'tuberia') {
        query = query.eq('type', 'tuberia');
      } else if (categoryFilter === 'cableado') {
        query = query.eq('type', 'cableado');
      } else if (categoryFilter === 'humo') {
        query = query.eq('type', 'detector-autonomo').ilike('name', '%Humo%');
      } else if (categoryFilter === 'termico') {
        query = query.eq('type', 'detector-autonomo').ilike('name', '%Térmico%');
      } else if (categoryFilter === 'monoxido') {
        query = query.eq('type', 'detector-doble');
      } else if (categoryFilter === 'palanca' || categoryFilter === 'manual') {
        query = query.eq('type', 'palanca');
      } else if (categoryFilter === 'sirena' || categoryFilter === 'estrobo') {
        query = query.eq('type', 'sirena');
      } else if (categoryFilter === 'facp' || categoryFilter === 'panel') {
        query = query.in('type', ['facp', 'cuadro-bomba']);
      } else if (categoryFilter === 'detectores') {
        query = query.in('type', ['detector-autonomo', 'detector-doble']);
      } else if (categoryFilter === 'sirenas') {
        query = query.in('type', ['sirena', 'palanca', 'facp', 'cuadro-bomba']);
      }
    }

    const { data: items, error } = await query.order('code');

    if (error || !items) return [];

    return items.map((raw) =>
      FloorItemSchema.parse({
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
      })
    );
  }

  /**
   * Busca ítems pendientes de un piso mediante término libre (código, nombre o recinto)
   */
  async searchPendingItemsByFloor(
    projectId: string,
    floorNumber: number,
    searchTerm: string
  ): Promise<FloorItem[]> {
    const { data: floor } = await this.supabase
      .from('floors')
      .select('id')
      .eq('project_id', projectId)
      .eq('floor_number', floorNumber)
      .maybeSingle();

    if (!floor) return [];

    const cleanTerm = searchTerm.trim();
    const { data: items, error } = await this.supabase
      .from('floor_items')
      .select('*')
      .eq('floor_id', floor.id)
      .eq('status', 'pending')
      .or(
        `code.ilike.%${cleanTerm}%,name.ilike.%${cleanTerm}%,model.ilike.%${cleanTerm}%,notes.ilike.%${cleanTerm}%`
      )
      .order('code')
      .limit(12);

    if (error || !items) return [];

    return items.map((raw) =>
      FloorItemSchema.parse({
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
      })
    );
  }

  /**
   * Busca un ítem por código o ID
   */
  async getItemByCodeOrId(codeOrId: string): Promise<FloorItem | null> {
    const clean = codeOrId.trim();
    const { data, error } = await this.supabase
      .from('floor_items')
      .select('*')
      .or(`id.eq.${clean},code.ilike.${clean}`)
      .maybeSingle();

    if (error || !data) return null;

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
   * Registra la instalación y evidencia de un equipo en Supabase
   */
  async registerInstallation(
    itemId: string,
    params: {
      status: 'installed' | 'inspected';
      team?: string;
      notes?: string;
      photoUrl?: string;
      capturedBy?: string;
    }
  ): Promise<{ updatedItem: FloorItem; floorProgress: number; globalProgress: number }> {
    const updatePayload: FloorItemUpdate = {
      status: params.status,
      installed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (params.team) updatePayload.installer_team = params.team;
    if (params.notes) updatePayload.notes = params.notes;
    if (params.photoUrl) updatePayload.photo_url = params.photoUrl;

    // 1. Actualizar floor_items
    const { data: updatedItemRaw, error: updateError } = await this.supabase
      .from('floor_items')
      .update(updatePayload)
      .eq('id', itemId)
      .select()
      .single();

    if (updateError || !updatedItemRaw) {
      throw new Error(`Error al actualizar elemento ${itemId}: ${updateError?.message}`);
    }

    const updatedItem = FloorItemSchema.parse({
      id: updatedItemRaw.id,
      floorId: updatedItemRaw.floor_id,
      projectId: updatedItemRaw.project_id,
      code: updatedItemRaw.code,
      type: updatedItemRaw.type,
      name: updatedItemRaw.name,
      model: updatedItemRaw.model,
      zone: updatedItemRaw.zone,
      status: updatedItemRaw.status,
      quantity: Number(updatedItemRaw.quantity),
      unit: updatedItemRaw.unit,
      unitPrice: Number(updatedItemRaw.unit_price),
      photoUrl: updatedItemRaw.photo_url,
      notes: updatedItemRaw.notes,
      installedAt: updatedItemRaw.installed_at,
      installerTeam: updatedItemRaw.installer_team,
    });

    // 2. Si hay foto de evidencia, insertar en installation_evidences
    if (params.photoUrl) {
      await this.supabase.from('installation_evidences').insert({
        item_id: itemId,
        photo_url: params.photoUrl,
        captured_by: params.capturedBy || params.team || 'Técnico Telegram',
        observations: params.notes || 'Instalación reportada vía Telegram Bot',
      });
    }

    // 3. Consultar nuevo avance del piso y del proyecto
    const { data: floorData } = updatedItem.floorId
      ? await this.supabase
          .from('floors')
          .select('progress_percentage')
          .eq('id', updatedItem.floorId)
          .single()
      : { data: null };

    const { data: projData } = await this.supabase
      .from('projects')
      .select('global_progress')
      .eq('id', updatedItem.projectId)
      .single();

    return {
      updatedItem,
      floorProgress: Number(floorData?.progress_percentage ?? 0),
      globalProgress: Number(projData?.global_progress ?? 0),
    };
  }

  /**
   * Obtiene estadísticas de avance y desglose técnico para un proyecto
   */
  async getProjectStats(projectId: string): Promise<ProjectStats | null> {
    const project = await this.getProject(projectId);
    if (!project) return null;

    const floors = await this.getFloors(projectId);

    const { data: items } = await this.supabase
      .from('floor_items')
      .select('*')
      .eq('project_id', projectId);

    const rawItems = items || [];
    let tuberiaMetrosTotal = 0;
    let tuberiaMetrosInstalled = 0;
    let cableMetrosTotal = 0;
    let cableMetrosInstalled = 0;
    let sensoresTotal = 0;
    let sensoresInstalled = 0;

    let installedCount = 0;
    let pendingCount = 0;

    for (const item of rawItems) {
      const qty = Number(item.quantity) || 1;
      const isInstalled = item.status === 'installed' || item.status === 'inspected';

      if (isInstalled) installedCount++;
      else pendingCount++;

      if (item.type === 'tuberia') {
        tuberiaMetrosTotal += qty;
        if (isInstalled) tuberiaMetrosInstalled += qty;
      } else if (item.type === 'cableado') {
        cableMetrosTotal += qty;
        if (isInstalled) cableMetrosInstalled += qty;
      } else {
        sensoresTotal += qty;
        if (isInstalled) sensoresInstalled += qty;
      }
    }

    // Pisos en ejecución (menos de 100% o designados como 'ejecucion')
    const activeFloors = floors.filter(
      (f) => f.progressPercentage < 100 || f.floorType === 'ejecucion'
    );

    return {
      project,
      floorsCount: floors.length,
      activeFloors,
      totalItems: rawItems.length,
      installedItems: installedCount,
      pendingItems: pendingCount,
      tuberiaMetrosTotal: Math.round(tuberiaMetrosTotal * 10) / 10,
      tuberiaMetrosInstalled: Math.round(tuberiaMetrosInstalled * 10) / 10,
      cableMetrosTotal: Math.round(cableMetrosTotal * 10) / 10,
      cableMetrosInstalled: Math.round(cableMetrosInstalled * 10) / 10,
      sensoresTotal,
      sensoresInstalled,
    };
  }
}
