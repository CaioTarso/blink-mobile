import { api } from "./api";
import { Appointment, AppointmentStatus } from "@/types";

export type { Appointment, AppointmentStatus };

export async function getStaffAppointments(staffId: string): Promise<Appointment[]> {
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