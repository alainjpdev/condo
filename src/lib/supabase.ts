import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Tipos para la aplicación
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Unit = Database['public']['Tables']['units']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type CommonArea = Database['public']['Tables']['common_areas']['Row'];
export type Reservation = Database['public']['Tables']['reservations']['Row'];
export type ServiceProvider = Database['public']['Tables']['service_providers']['Row'];
export type Incident = Database['public']['Tables']['incidents']['Row'];
export type Vote = Database['public']['Tables']['votes']['Row'];
export type VoteResponse = Database['public']['Tables']['vote_responses']['Row'];

export type UserRole = 'admin' | 'residente' | 'proveedor';
export type PaymentStatus = 'pendiente' | 'pagado' | 'vencido';
export type ReservationStatus = 'pendiente' | 'aprobado' | 'rechazado';
export type IncidentStatus = 'nuevo' | 'en_progreso' | 'resuelto';