import { api } from "./api";

export interface AppointmentsByWeekday {
  sunday: number;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
}

export interface DashboardMetrics {
  revenue: number;
  total_clients: number;
  total_pets: number;
  total_services: number;
  appointments_current_month: number;
  appointments_by_weekday: AppointmentsByWeekday;
}

class DashboardService {
  async getMetrics(): Promise<DashboardMetrics> {
    const response = await api.get<DashboardMetrics>("/api/admin/dashboard");
    return response.data;
  }
}

export const dashboardService = new DashboardService();
