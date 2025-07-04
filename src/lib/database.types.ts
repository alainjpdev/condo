export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          role: 'admin' | 'residente' | 'proveedor'
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          role?: 'admin' | 'residente' | 'proveedor'
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          role?: 'admin' | 'residente' | 'proveedor'
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      units: {
        Row: {
          id: string
          name: string
          type: 'departamento' | 'local' | 'oficina'
          floor: number
          resident_id: string | null
          cuota_mensual: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type?: 'departamento' | 'local' | 'oficina'
          floor: number
          resident_id?: string | null
          cuota_mensual?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'departamento' | 'local' | 'oficina'
          floor?: number
          resident_id?: string | null
          cuota_mensual?: number
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          unit_id: string
          amount: number
          due_date: string
          status: 'pendiente' | 'pagado' | 'vencido'
          receipt_url: string | null
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          unit_id: string
          amount: number
          due_date: string
          status?: 'pendiente' | 'pagado' | 'vencido'
          receipt_url?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          unit_id?: string
          amount?: number
          due_date?: string
          status?: 'pendiente' | 'pagado' | 'vencido'
          receipt_url?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      common_areas: {
        Row: {
          id: string
          name: string
          description: string | null
          usage_rules: string | null
          capacity: number | null
          hourly_rate: number | null
          available: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          usage_rules?: string | null
          capacity?: number | null
          hourly_rate?: number | null
          available?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          usage_rules?: string | null
          capacity?: number | null
          hourly_rate?: number | null
          available?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      reservations: {
        Row: {
          id: string
          area_id: string
          user_id: string
          start_time: string
          end_time: string
          status: 'pendiente' | 'aprobado' | 'rechazado'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          area_id: string
          user_id: string
          start_time: string
          end_time: string
          status?: 'pendiente' | 'aprobado' | 'rechazado'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          area_id?: string
          user_id?: string
          start_time?: string
          end_time?: string
          status?: 'pendiente' | 'aprobado' | 'rechazado'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      service_providers: {
        Row: {
          id: string
          name: string
          phone: string
          email: string | null
          category: 'electricista' | 'plomero' | 'limpieza' | 'jardineria' | 'seguridad' | 'otros'
          rating: number | null
          description: string | null
          available: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          email?: string | null
          category: 'electricista' | 'plomero' | 'limpieza' | 'jardineria' | 'seguridad' | 'otros'
          rating?: number | null
          description?: string | null
          available?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          email?: string | null
          category?: 'electricista' | 'plomero' | 'limpieza' | 'jardineria' | 'seguridad' | 'otros'
          rating?: number | null
          description?: string | null
          available?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      incidents: {
        Row: {
          id: string
          unit_id: string | null
          reporter_id: string
          title: string
          description: string
          image_url: string | null
          status: 'nuevo' | 'en_progreso' | 'resuelto'
          assigned_provider_id: string | null
          resolution_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          unit_id?: string | null
          reporter_id: string
          title: string
          description: string
          image_url?: string | null
          status?: 'nuevo' | 'en_progreso' | 'resuelto'
          assigned_provider_id?: string | null
          resolution_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          unit_id?: string | null
          reporter_id?: string
          title?: string
          description?: string
          image_url?: string | null
          status?: 'nuevo' | 'en_progreso' | 'resuelto'
          assigned_provider_id?: string | null
          resolution_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          title: string
          description: string
          options: Json
          start_date: string
          end_date: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          options: Json
          start_date?: string
          end_date: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          options?: Json
          start_date?: string
          end_date?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      vote_responses: {
        Row: {
          id: string
          vote_id: string
          user_id: string
          selected_option: string
          created_at: string
        }
        Insert: {
          id?: string
          vote_id: string
          user_id: string
          selected_option: string
          created_at?: string
        }
        Update: {
          id?: string
          vote_id?: string
          user_id?: string
          selected_option?: string
          created_at?: string
        }
      }
    }
  }
}