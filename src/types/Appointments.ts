// src/types/appointment.ts

export type AppointmentStatus =
  | "agendado"
  | "cancelado"
  | "concluído"
  | "não_comparecimento";

// Tipos auxiliares — 
// (pets.ts, services.ts, users.ts). Se já existirem, importa de lá.
export interface Pet {
  id: number;
  name: string;
  breed?: string;
  weight?: string;
  image?: string;
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
}

export interface Professional {
  id: number;
  name: string;
  tags?: string[];
}

// 
// Esse é o tipo "cru" da API — 
export interface AppointmentApi {
  id: number;
  pet_id: number;
  service_id: number;
  professional_id: number;
  client_id: number;
  date: string;             // "2026-05-15"
  time: string;             // "14:00:00"
  status: AppointmentStatus;
  pet?: Pet;                // se vier com eager loading
  service?: Service;
  professional?: Professional;
  created_at?: string;
  updated_at?: string;
}

// Mantém a UI funcionando sem reescrever o componente
export interface Appointment {
  id: string;
  date: string;             // "26/03/26" (formato exibição)
  time: string;             // "08:00"
  service: string;
  petName: string;
  clientName?: string;
  professional: string;
  status: AppointmentStatus;
}

// Payload pro POST de criar
export interface CreateAppointmentPayload {
  pet_id: number;
  service_id: number;
  professional_id: number;
  date: string;             // ISO "2026-05-15"
  time: string;             // "14:00"
}

// Payload pro PUT/PATCH (todos opcionais)
export type UpdateAppointmentPayload = Partial<CreateAppointmentPayload> & {
  status?: AppointmentStatus;
};