import { Appointment as AppointmentUI } from "@/components/AppointmentsList";
import { api } from "./api";

import { 
  AppointmentApi, 
  CreateAppointmentPayload, 
  UpdateAppointmentPayload,
  AppointmentStatus // Importado da dev
} from "@/types/appointment";



function toAppointment(raw: AppointmentApi): AppointmentUI {
  return {
    id: String(raw.id),
    date: raw.date,
    time: raw.time?.slice(0, 5) ?? "",
    service: raw.service?.name ?? "—",
    petName: raw.pet?.name ?? "—",
    professional: raw.professional?.name ?? "—",
    status: raw.status,
  };
}

// --- FUNÇÕES DO CLIENTE ---
export async function listMyAppointments(): Promise<AppointmentUI[]> {
  const response = await api.get<AppointmentApi[]>("/api/appointments/me");
  return response.data.map(toAppointment);
}

export async function getAppointments(): Promise<AppointmentUI[]> {
  const response = await api.get<AppointmentApi[]>("/api/appointments");
  return response.data.map(toAppointment);
}

export async function createAppointment(
  payload: CreateAppointmentPayload
): Promise<AppointmentUI> {
  const response = await api.post<AppointmentApi>(
    "/api/appointments",
    payload
  );

  return toAppointment(response.data);
}

export async function cancelAppointment(id: string): Promise<void> {
  await api.delete(`/api/appointments/${id}`);
}

export async function updateAppointment(
  id: string,
  payload: UpdateAppointmentPayload
): Promise<AppointmentUI> {
  const response = await api.put<AppointmentApi>(
    `/api/appointments/${id}`,
    payload
  );

  return toAppointment(response.data);
}

// --- FUNÇÕES DO STAFF ---
export async function getStaffAppointments(
  staffId: string
): Promise<AppointmentUI[]> {
  const response = await api.get<AppointmentApi[]>(
    `/api/staff/${staffId}/appointments`
  );

  return response.data.map(toAppointment);
}

export async function updateAppointment(
  id: string,
  data: UpdateAppointmentPayload
): Promise<Appointment> {
  const response = await api.patch<Appointment>(`/api/appointments/${id}`, data);
  return response.data;
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: any
): Promise<any> {
  const response = await api.patch<any>(
    `/api/appointments/${appointmentId}`,
    { status }
  );
  return response.data;
}

export async function deleteAppointment(id: string): Promise<void> {
  await api.delete(`/api/appointments/${id}`);
}
