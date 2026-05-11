export type Staff = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  position: string;
  tags: string[];
  active?: boolean; 
};

export type UpdateStaffData = {
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  tags?: string[];
  active?: boolean;
};