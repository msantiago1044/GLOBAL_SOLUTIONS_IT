export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ItemType =
  | 'tuberia'
  | 'cableado'
  | 'detector-autonomo'
  | 'detector-doble'
  | 'sirena'
  | 'palanca'
  | 'facp'
  | 'cuadro-bomba';

export type ItemStatus = 'pending' | 'installed' | 'inspected';

export type FloorType =
  | 'sotano'
  | 'cerebro'
  | 'oficinas'
  | 'habitaciones'
  | 'ejecucion';

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          name: string;
          client: string;
          address: string;
          contractor: string;
          interventoria: string;
          system_type: string;
          total_floors: number;
          global_progress: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          client: string;
          address: string;
          contractor: string;
          interventoria: string;
          system_type: string;
          total_floors?: number;
          global_progress?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          client?: string;
          address?: string;
          contractor?: string;
          interventoria?: string;
          system_type?: string;
          total_floors?: number;
          global_progress?: number;
          updated_at?: string;
        };
      };
      floors: {
        Row: {
          id: string;
          project_id: string;
          floor_number: number;
          name: string;
          floor_type: FloorType;
          progress_percentage: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          floor_number: number;
          name: string;
          floor_type: FloorType;
          progress_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          floor_number?: number;
          name?: string;
          floor_type?: FloorType;
          progress_percentage?: number;
          updated_at?: string;
        };
      };
      floor_items: {
        Row: {
          id: string;
          floor_id: string;
          project_id: string;
          code: string;
          type: ItemType;
          name: string;
          model: string;
          zone: string;
          status: ItemStatus;
          quantity: number;
          unit: string;
          unit_price: number;
          photo_url: string | null;
          notes: string | null;
          installed_at: string | null;
          installer_team: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          floor_id: string;
          project_id: string;
          code: string;
          type: ItemType;
          name: string;
          model: string;
          zone: string;
          status?: ItemStatus;
          quantity?: number;
          unit?: string;
          unit_price?: number;
          photo_url?: string | null;
          notes?: string | null;
          installed_at?: string | null;
          installer_team?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          floor_id?: string;
          project_id?: string;
          code?: string;
          type?: ItemType;
          name?: string;
          model?: string;
          zone?: string;
          status?: ItemStatus;
          quantity?: number;
          unit?: string;
          unit_price?: number;
          photo_url?: string | null;
          notes?: string | null;
          installed_at?: string | null;
          installer_team?: string | null;
          updated_at?: string;
        };
      };
      installation_evidences: {
        Row: {
          id: string;
          item_id: string;
          photo_url: string;
          captured_by: string;
          captured_at: string;
          observations: string | null;
        };
        Insert: {
          id?: string;
          item_id: string;
          photo_url: string;
          captured_by: string;
          captured_at?: string;
          observations?: string | null;
        };
        Update: {
          id?: string;
          item_id?: string;
          photo_url?: string;
          captured_by?: string;
          observations?: string | null;
        };
      };
    };
  };
}
