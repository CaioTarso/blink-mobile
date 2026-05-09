export type UserRole = "admin" | "client" | "staff";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role?: UserRole;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  access_token: string;
  token_type: string;
  user: User;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  address: string;
};

export type RegisterStaffRequest = {
  name: string;
  email: string;
  phone: string;
  position: string;
  hired_at: string;
};

export type RegisterStaffResponse = {
  staff: User;
  generated_credentials: {
    email: string;
    password: string;
  };
};
