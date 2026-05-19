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
  image?: string;
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