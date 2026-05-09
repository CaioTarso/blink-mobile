import { api } from "./api";

export type PetSpecies = "dog" | "cat" | "bird" | "rabbit" | "other";

export type Pet = {
  id: string;
  client_id: string;
  name: string;
  species: PetSpecies;
  weight: number;
  notes: string;
  breed: string;
  years: number;
  sex: string;
  created_at?: string;
  updated_at?: string;
};

export type CreatePetRequest = {
  client_id: string;
  name: string;
  species: PetSpecies;
  weight: number;
  notes: string;
  breed: string;
  years: number;
  sex: string;
};

export type UpdatePetRequest = Partial<CreatePetRequest>;

export async function getPets(): Promise<Pet[]> {
  const response = await api.get<Pet[]>("/api/pets");
  return response.data;
}

export async function getPetsByClient(clientId: string): Promise<Pet[]> {
  const response = await api.get<Pet[]>(`/api/clients/${clientId}/pets`);
  return response.data;
}

export async function createPet(data: CreatePetRequest): Promise<Pet> {
  const response = await api.post<Pet>("/api/pets", data);
  return response.data;
}

export async function updatePet(id: string, data: UpdatePetRequest): Promise<Pet> {
  const response = await api.put<Pet>(`/api/pets/${id}`, data);
  return response.data;
}

export async function deletePet(id: string): Promise<void> {
  await api.delete(`/api/pets/${id}`);
}