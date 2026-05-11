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