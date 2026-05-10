import { api } from "./api";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export interface AppointmentRelation {
  id: string;
  name?: string;
  full_name?: string;
}

export interface ApiAppointment {
  id: string;
  pet_id: string;
  client_id: string;
  staff_id: string | null;
  scheduled_date?: string | null;
  start_time: string;
  end_time: string | null;
  status: AppointmentStatus;
  pet?: AppointmentRelation | null;
  client?: AppointmentRelation | null;
  staff?: AppointmentRelation | null;
}

export interface UpdateAppointmentPayload {
  pet_id?: string;
  client_id?: string;
  staff_id?: string | null;
  start_time?: string;
  end_time?: string | null;
  status?: AppointmentStatus;
}

export async function getAppointments(): Promise<ApiAppointment[]> {
  const response = await api.get<ApiAppointment[]>("/api/appointments");
  return response.data;
}

export async function updateAppointment(
  id: string,
  data: UpdateAppointmentPayload
): Promise<ApiAppointment> {
  const response = await api.patch<ApiAppointment>(`/api/appointments/${id}`, data);
  return response.data;
}

export async function deleteAppointment(id: string): Promise<void> {
  await api.delete(`/api/appointments/${id}`);
}
