import { api } from "./api";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterStaffRequest,
  RegisterStaffResponse,
} from "../types";

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/api/login", credentials);
  api.setToken(response.data.access_token);
  return response.data;
}

export async function register(payload: RegisterRequest) {
  const response = await api.post<LoginResponse>("/api/register", payload);
  return response.data;
}

export async function registerStaff(data: RegisterStaffRequest): Promise<RegisterStaffResponse> {
  const response = await api.post<RegisterStaffResponse>("/api/admin/staff", data);
  return response.data;
}

export async function recoverPassword(email: string): Promise<void> {
  await api.post("/auth/recover", { email });
}

export function logout() {
  api.clearToken();
}