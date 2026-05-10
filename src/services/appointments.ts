import { api } from "./api";

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show";

export type AppointmentClient = {
  id: string;
  user_id: string;
  phone: string;
  address: string;
};

export type AppointmentStaff = {
  id: string;
  user_id: string;
  position: string;
  phone: string;
};

export type AppointmentPet = {
  id: string;
  name: string;
  species: string;
  breed: string;
};

export type Appointment = {
  id: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  pet: AppointmentPet;
  client: AppointmentClient;
  staff: AppointmentStaff;
};

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