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

  window.GSITSupabase = {
    init: initClient,
    syncItem: syncItemUpdate,
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
