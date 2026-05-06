import { api } from "./api";

export type UserRole = "admin" | "client" | "staff";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ─── MOCK ────────────────────────────────────────────────────────────────────
// Remover quando o backend estiver pronto e descomentar as funções reais abaixo

const MOCK_USERS = [
  { id: "1", name: "João Silva",  email: "admin@blink.com",  password: "123456", role: "admin"  as UserRole },
  { id: "2", name: "Carlos Lima", email: "client@blink.com", password: "123456", role: "client" as UserRole },
  { id: "3", name: "Maria Souza", email: "staff@blink.com",  password: "123456", role: "staff"  as UserRole },
];

export async function login(email: string, password: string): Promise<AuthResponse> {
  // TODO: trocar pelo fetch real quando backend estiver pronto
  // return api<AuthResponse>("/auth/login", { method: "POST", body: { email, password } });

  await new Promise((resolve) => setTimeout(resolve, 600)); // simula latência

  const user = MOCK_USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) throw new Error("Email ou senha incorretos");

  const { password: _, ...userWithoutPassword } = user;
  return {
    token: `mock-token-${user.id}`,
    user: userWithoutPassword,
  };
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  // TODO: trocar pelo fetch real quando backend estiver pronto
  // return api<AuthResponse>("/auth/register", { method: "POST", body: { name, email, password } });

  await new Promise((resolve) => setTimeout(resolve, 600));
  throw new Error("Cadastro disponível em breve");
}

export async function recoverPassword(email: string): Promise<void> {
  // TODO: trocar pelo fetch real quando backend estiver pronto
  // return api<void>("/auth/recover", { method: "POST", body: { email } });

  await new Promise((resolve) => setTimeout(resolve, 600));
  // mock: não faz nada, só simula sucesso
}