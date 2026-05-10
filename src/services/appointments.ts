import { Appointment } from "@/components/AppointmentsList";
import {
  AppointmentApi,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from "@/types/appointment";
import { api } from "./api";

function toAppointment(raw: AppointmentApi): Appointment {
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

export async function listMyAppointments(): Promise<Appointment[]> {
  const response = await api.get<AppointmentApi[]>("/api/appointments/me");
  return response.data.map(toAppointment);
}

export async function createAppointment(
  payload: CreateAppointmentPayload
): Promise<Appointment> {
  const response = await api.post<AppointmentApi>("/api/appointments", payload);
  return toAppointment(response.data);
}

export async function cancelAppointment(id: string): Promise<void> {
  await api.delete(`/api/appointments/${id}`);
}

export async function updateAppointment(
  id: string,
  payload: UpdateAppointmentPayload
): Promise<Appointment> {
  const response = await api.put<AppointmentApi>( 
    `/api/appointments/${id}`,
    payload
  );
  return toAppointment(response.data);
}
