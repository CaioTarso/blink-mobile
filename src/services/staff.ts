import { api } from "./api";
import { Staff, UpdateStaffData } from "../types/staff";

export type { Staff, UpdateStaffData };

export async function listStaff(): Promise<Staff[]> {
  const response = await api.get<any>("/api/admin/staff");
  const list = Array.isArray(response.data.data) ? response.data.data : [];

  return list.map((item: any) => ({
    id: String(item.id),
    name: item.name,
    email: item.email,
    phone: item.phone ?? "",
    role: item.role ?? "staff",
    position: item.position ?? "",
    tags: item.tags ?? [],
  }));
}

export async function updateStaff(id: string, data: UpdateStaffData): Promise<Partial<Staff>> {
  const response = await api.put<any>(`/api/admin/staff/${id}`, data);
  const item = response.data;

  return {
    id: String(item.id),
    name: item.name,
    email: item.email,
    phone: item.phone ?? "",
    role: item.role ?? "staff",
    position: item.position ?? "",
    tags: item.tags ?? [],
  };
}

export async function deleteStaff(id: string): Promise<void> {
  await api.delete(`/api/admin/staff/${id}`);
}