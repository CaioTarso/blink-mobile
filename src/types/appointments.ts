export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type AppointmentClient = {
  id: string;
  user_id: string;
  phone: string;
  address: string;
  name?: string;
  full_name?: string;
};

export type AppointmentStaff = {
  id: string;
  user_id: string;
  position: string;
  phone: string;
  name?: string;
  full_name?: string;
};

export type AppointmentPet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  full_name?: string;
};

export type AppointmentService = {
  id: string;
  name: string;
  description?: string;
  price?: number;
};

export type Appointment = {
  id: string;
  pet_id?: string;
  client_id?: string;
  staff_id?: string | null;
  service_id?: string;
  scheduled_date?: string | null;
  start_time: string;
  end_time: string | null;
  status: AppointmentStatus;
  pet: AppointmentPet;
  client: AppointmentClient;
  staff?: AppointmentStaff | null;
  service?: AppointmentService | null;
  services?: AppointmentService[];
};

export type CreateAppointmentPayload = {
  pet_id: string;
  service_id: string;
  staff_id: string;
  client_id: string;
  start_time: string;
};

export type UpdateAppointmentPayload = {
  pet_id?: string;
  client_id?: string;
  staff_id?: string | null;
  start_time?: string;
  end_time?: string | null;
  status?: AppointmentStatus;
};