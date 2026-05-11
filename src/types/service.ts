export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes?: number;
  image: string;
  active: boolean;
}

export type ToggleTarget = { id: string; name: string; currentActive: boolean };
export type DeleteTarget = { id: string; name: string };
