import { api } from "./api";

export interface Pet {
  id: string;
  name: string;
  breed?: string;
  weight?: string;
  image?: string;
}

interface PetApi {
  id: string | number;
  name: string;
  breed?: string;
  weight?: string | number;
  image?: string;
  photo?: string;
}

function toPet(raw: PetApi): Pet {
  return {
    id: String(raw.id),
    name: raw.name,
    breed: raw.breed,
    weight: raw.weight !== undefined ? String(raw.weight) : undefined,
    image: raw.image ?? raw.photo,
  };
}

export async function getMyPets(): Promise<Pet[]> {
  const response = await api.get<PetApi[]>("/api/pets/me");
  return response.data.map(toPet);
}