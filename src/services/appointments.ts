import {
  Appointment,
  AppointmentStatus,
  UpdateAppointmentPayload,
} from "@/types";
import { api } from "./api";

export type { Appointment, AppointmentStatus };

export async function getAppointments(): Promise<Appointment[]> {
  const response = await api.get<Appointment[]>("/api/appointments");
  return response.data;
}

export async function getStaffAppointments(staffId: string): Promise<Appointment[]> {
  const response = await api.get<Appointment[]>(
    `/api/staff/${staffId}/appointments`
  );
  return response.data;
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
  status: AppointmentStatus
): Promise<Appointment> {
  const response = await api.patch<Appointment>(
    `/api/appointments/${appointmentId}`,
    { status }
  );
  return response.data;
}

export async function deleteAppointment(id: string): Promise<void> {
  await api.delete(`/api/appointments/${id}`);
}