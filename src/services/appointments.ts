import { Appointment as ListAppointment } from "@/components/AppointmentsList";
import { api } from "./api";
import {
  Appointment,
  AppointmentStatus,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from "@/types/appointments";

// Re-export types for consumers
export type { Appointment, AppointmentStatus, UpdateAppointmentPayload, CreateAppointmentPayload };

// --- Status mapping (API → UI) ---
const statusMap: Record<AppointmentStatus, ListAppointment["status"]> = {
  pending: "agendado",
  confirmed: "agendado",
  completed: "concluído",
  cancelled: "cancelado",
  no_show: "não_comparecimento",
};

function formatDate(value?: string | null): string {
  if (!value) return "--/--/--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--/--/--";
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function formatTime(value?: string | null): string {
  if (!value) return "--:--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--:--";
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getRelationName(
  relation?: any | null
): string {
  if (!relation) return "Não informado";
  return relation.name || relation.full_name || relation.user?.name || relation.user?.full_name || "Não informado";
}

function toListAppointment(raw: Appointment): ListAppointment {
  return {
    id: raw.id,
    date: formatDate(raw.scheduled_date || raw.start_time),
    time: formatTime(raw.start_time),
    service: raw.service?.name ?? raw.services?.[0]?.name ?? "Serviço não informado",
    petName: getRelationName(raw.pet),
    professional: getRelationName(raw.staff),
    status: statusMap[raw.status],
  };
}

// --- FUNÇÕES DO CLIENTE (retornam tipo UI mapeado) ---

export async function listMyAppointments(clientId: string): Promise<ListAppointment[]> {
  const response = await api.get<Appointment[]>(`/api/clients/${clientId}/appointments`);
  return response.data.map(toListAppointment);
}

export async function createAppointment(
  payload: CreateAppointmentPayload
): Promise<Appointment> {
  const response = await api.post<Appointment>("/api/appointments", payload);
  return response.data;
}

export async function cancelAppointment(id: string): Promise<void> {
  await api.delete(`/api/appointments/${id}`);
}

// --- FUNÇÕES DO ADMIN (retornam tipo API cru) ---

export async function getAppointments(): Promise<Appointment[]> {
  const response = await api.get<Appointment[]>("/api/appointments");
  return response.data;
}

export async function updateAppointment(
  id: string,
  data: UpdateAppointmentPayload
): Promise<Appointment> {
  const response = await api.patch<Appointment>(
    `/api/appointments/${id}`,
    data
  );
  return response.data;
}

export async function deleteAppointment(id: string): Promise<void> {
  await api.delete(`/api/appointments/${id}`);
}

// --- FUNÇÕES DO STAFF ---

export async function getStaffAppointments(
  staffId: string
): Promise<Appointment[]> {
  const response = await api.get<Appointment[]>(
    `/api/staff/${staffId}/appointments`
  );
  return response.data;
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus
): Promise<Appointment> {
  const response = await api.patch<Appointment>(
    `/api/appointments/${appointmentId}`,
    { status }
  );
  return response.data;
}
