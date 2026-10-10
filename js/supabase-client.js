/**
 * GLOBAL SOLUTIONS IT S.A.S. - MÓDULO CLIENTE SUPABASE (SD-FLUX)
 * Sincronización en la Nube y Soporte Realtime para la Plataforma de Ejecución de Obras
 */

(function () {
  const SUPABASE_CONFIG = {
    url: 'https://fqxjeohmoidnhmlocbok.supabase.co',
    anonKey: 'sb_publishable_MQxOQdx4__EfYuh99C-nqg_ZP5YmcS7'
  };

  let supabaseClient = null;
  let isConnected = false;

  function initClient() {
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
      try {
        supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        isConnected = true;
        console.log('✅ [Supabase] Cliente inicializado correctamente.');
      } catch (err) {
        console.warn('⚠️ [Supabase] Error al inicializar cliente:', err);
        isConnected = false;
      }
    } else {
      console.info('ℹ️ [Supabase] SDK no disponible en ventana global, modo offline activo.');
    }
  }

  /**
   * Sincroniza un elemento de piso modificado hacia Supabase
   */
  async function syncItemUpdate(item) {
    if (!supabaseClient || !isConnected) return null;

    try {
      const payload = {
        status: item.status,
        installed_at: item.installDate || null,
        installer_team: item.technician || null,
        notes: item.notes || null,
        photo_url: item.photo || null,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabaseClient
        .from('floor_items')
        .update(payload)
        .eq('id', item.id)
        .select();

      if (error) {
        console.warn(`[Supabase Sync Error] Elemento ${item.id}:`, error.message);
        return null;
      }

      console.log(`☁️ [Supabase Sync OK] Elemento ${item.id} sincronizado.`);
      return data;
    } catch (err) {
      console.warn('[Supabase Sync Exception]:', err);
      return null;
    }
  }

  /**
   * Sincroniza y descarga datos remotos al iniciar si existen en Supabase
   */
  async function fetchRemoteFloorItems(projectId = 'torre-titanium', floorNumber = 33) {
    if (!supabaseClient || !isConnected) return null;

    try {
      const { data: floor, error: floorErr } = await supabaseClient
        .from('floors')
        .select('id')
        .eq('project_id', projectId)
        .eq('floor_number', floorNumber)
        .single();

      if (floorErr || !floor) return null;

      const { data: items, error: itemsErr } = await supabaseClient
        .from('floor_items')
        .select('*')
        .eq('floor_id', floor.id);

      if (itemsErr) return null;
      return items;
    } catch (e) {
      console.warn('[Supabase Fetch Error]:', e);
      return null;
    }
  }

  /**
   * Suscripción en tiempo real a cambios de estado
   */
  function subscribeToProjectChanges(projectId, onRemoteUpdate) {
    if (!supabaseClient || !isConnected) return null;

    try {
      const channel = supabaseClient
        .channel(`public-items-${projectId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'floor_items',
            filter: `project_id=eq.${projectId}`
          },
          (payload) => {
            console.log('⚡ [Supabase Realtime] Cambio recibido:', payload.new);
            if (typeof onRemoteUpdate === 'function') {
              onRemoteUpdate(payload.new);
            }
          }
        )
        .subscribe();

      return () => {
        supabaseClient.removeChannel(channel);
      };
    } catch (e) {
      console.warn('[Supabase Realtime Subscribe Error]:', e);
      return null;
    }
  }

  /**
   * Inserta un nuevo elemento en el esquema técnico en Supabase
   */
  async function insertFloorItem(item, projectId, floorNumber) {
    if (!supabaseClient || !isConnected) return null;

    try {
      let floorId = null;
      const { data: floor } = await supabaseClient
        .from('floors')
        .select('id')
        .eq('project_id', projectId)
        .eq('floor_number', floorNumber)
        .single();

      if (floor) {
        floorId = floor.id;
      }

      const payload = {
        id: item.id,
        floor_id: floorId,
        project_id: projectId,
        code: item.code,
        type: item.type,
        name: item.name,
        model: item.model || 'Estándar NFPA 72',
        zone: item.zone || 'Zona General',
        status: item.status || 'pending',
        quantity: item.quantity || 1,
        unit: item.unit || 'Unidad',
        unit_price: item.unitPrice || 0,
        photo_url: item.photo || null,
        notes: item.notes || null,
        installed_at: item.installDate || null,
        installer_team: item.technician || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabaseClient
        .from('floor_items')
        .upsert(payload)
        .select();

      if (error) {
        console.warn(`[Supabase insertFloorItem Error]:`, error.message);
        return null;
      }

      console.log(`☁️ [Supabase Insert OK] Elemento ${item.code} registrado.`);
      return data;
    } catch (err) {
      console.warn('[Supabase Insert Exception]:', err);
      return null;
    }
  }

  /**
   * Elimina un elemento del esquema técnico en Supabase
   */
  async function deleteFloorItem(itemId) {
    if (!supabaseClient || !isConnected) return null;

    try {
      const { data, error } = await supabaseClient
        .from('floor_items')
        .delete()
        .eq('id', itemId)
        .select();

      if (error) {
        console.warn(`[Supabase deleteFloorItem Error]:`, error.message);
        return null;
      }

      console.log(`☁️ [Supabase Delete OK] Elemento ${itemId} eliminado.`);
      return data;
    } catch (err) {
      console.warn('[Supabase Delete Exception]:', err);
      return null;
    }
  }

  /**
   * Bloquea definitivamente el esquema de un proyecto en Supabase
   */
  async function lockProject(projectId) {
    if (!supabaseClient || !isConnected) return null;

    try {
      const { data, error } = await supabaseClient
        .from('projects')
        .update({
          schema_status: 'locked',
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .select();

      if (error) {
        console.warn(`[Supabase lockProject Error]:`, error.message);
        return null;
      }

      console.log(`🔒 [Supabase Lock OK] Proyecto ${projectId} congelado en modo oficial.`);
      return data;
    } catch (err) {
      console.warn('[Supabase Lock Exception]:', err);
      return null;
    }
  }

  /**
   * Registra un nuevo proyecto y sus zonas en Supabase
   */
  async function createProject(projectData, zones = []) {
    if (!supabaseClient || !isConnected) return null;

    try {
      const { data: proj, error: projErr } = await supabaseClient
        .from('projects')
        .upsert({
          id: projectData.id,
          name: projectData.name,
          client: projectData.client,
          address: projectData.address || '',
          contractor: projectData.contractor || 'Global Solutions IT S.A.S.',
          interventoria: projectData.interventoria || 'Interventoría Oficial',
          system_type: projectData.systemType || 'Sistema NFPA 72',
          total_floors: projectData.totalFloors || zones.length,
          global_progress: 0,
          schema_status: 'editable',
          updated_at: new Date().toISOString()
        })
        .select();

      if (projErr) {
        console.warn('[Supabase createProject Error]:', projErr.message);
      }

      for (const z of zones) {
        await supabaseClient
          .from('floors')
          .upsert({
            project_id: projectData.id,
            floor_number: z.floorNumber,
            name: z.name,
            floor_type: z.type || 'oficinas',
            progress_percentage: 0
          });
      }

      return proj;
    } catch (err) {
      console.warn('[Supabase createProject Exception]:', err);
      return null;
    }
  }

  window.GSITSupabase = {
    init: initClient,
    syncItem: syncItemUpdate,
    insertFloorItem: insertFloorItem,
    deleteFloorItem: deleteFloorItem,
    lockProject: lockProject,
    createProject: createProject,
    fetchFloorItems: fetchRemoteFloorItems,
    subscribe: subscribeToProjectChanges,
    isReady: () => isConnected && supabaseClient !== null
  };

  // Inicializar al cargar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClient);
  } else {
    initClient();
  }
})();
