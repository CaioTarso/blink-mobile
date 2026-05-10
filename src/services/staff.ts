import { api } from "./api";

export type Staff = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  tags: string[];
  active: boolean;
};

export async function listStaff(): Promise<Staff[]> {
  const response = await api.get<any>("/api/admin/staff");
  const list = Array.isArray(response.data.data) ? response.data.data : [];

  return list.map((item: any) => ({
    id: String(item.id),
    name: item.name,
    email: item.email,
    phone: item.phone ?? "",
    role: item.position ?? item.role ?? "Staff",
    tags: item.tags ?? [],
    active: item.active ?? item.is_active ?? true,
  }));
}

export async function updateStaff(
  id: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    position?: string;
    tags?: string[];
    active?: boolean;
  }
): Promise<Partial<Staff>> {
  const response = await api.put<any>(`/api/admin/staff/${id}`, data);
  const item = response.data.staff ?? response.data.data ?? response.data;

  return {
    id: String(item.id),
    name: item.name,
    email: item.email,
    phone: item.phone ?? "",
    role: item.position ?? item.role ?? "Staff",
    tags: item.tags ?? [],
    active: item.active ?? item.is_active ?? true,
  };
}

export async function deleteStaff(id: string): Promise<void> {
  await api.delete(`/api/admin/staff/${id}`);
}