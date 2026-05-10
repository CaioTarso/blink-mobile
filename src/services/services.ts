import { api } from "./api";

export interface Service {
  id: number;
  name: string;
  description: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceDTO {
  name: string;
  description: string;
  price: number;
  image_url?: string;
}

class ServiceService {
  async getAll() {
    const response = await api.get<Service[]>("/api/service");

    return response.data;
  }

  async getById(id: string) {
    const response = await api.get<Service>(`/api/service/${id}`);

    return response.data;
  }

  async create(data: FormData) {
    const response = await api.instance.post("/api/service", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  async update(id: string, data: Partial<CreateServiceDTO>) {
    const response = await api.put<Service>(`/api/service/${id}`, data);

    return response.data;
  }

  async delete(id: string) {
    await api.delete(`/api/service/${id}`);
  }
}

export const serviceService = new ServiceService();
