import React, { createContext, useContext, useState } from "react";
import { useRouter } from "expo-router";
import { login as authLogin, register as authRegister, recoverPassword as authRecover, logout as authLogout } from "@/services/auth";
import { User, RegisterRequest } from "@/types";

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  recoverPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function redirectByRole(role: User["role"]) {
    switch (role) {
      case "admin":
        router.replace("/(protected)/(admin)/dashboard");
        break;
      case "client":
        router.replace("/(protected)/(client)/pets");
        break;
      case "staff":
        router.replace("/(protected)/(staff)/staff-agenda");
        break;
    }
  }

  async function login(email: string, password: string) {
    setIsLoading(true);
    try {
      const response = await authLogin({ email, password });
      setUser(response.user);
      setToken(response.access_token);
      redirectByRole(response.user.role);
    } finally {
      setIsLoading(false);
    }
  }

  async function register(data: RegisterRequest) {
    setIsLoading(true);
    try {
      await authRegister(data);
      router.replace("/login");
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    authLogout();
    setUser(null);
    setToken(null);
    router.replace("/welcome");
  }

  async function recoverPassword(email: string) {
    setIsLoading(true);
    try {
      await authRecover(email);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout, recoverPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
