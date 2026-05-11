import { api } from "./api";

export type Professional = {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  tags: string[];
};

export const getProfessionals = async (): Promise<Professional[]> => {
  const response = await api.get<any>("/api/staff");
  const list = Array.isArray(response.data.data)
    ? response.data.data
    : Array.isArray(response.data)
      ? response.data
      : [];

  return list.map((item: any) => ({
    id: String(item.id),
    name: item.name,
    email: item.email ?? "",
    phone: item.phone ?? "",
    position: item.position ?? "",
    tags: item.tags ?? [],
  }));
};