import axios, { AxiosInstance, AxiosError } from "axios";
import { Platform } from "react-native";

export const BASE_URL = "http://localhost:8000";

const TOKEN_KEY = "@blink:token";

class ApiClient {
  private instance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.restoreToken();

    this.instance = axios.create({
      baseURL: BASE_URL,
      timeout: 60000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.instance.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url} | Token: ${this.token ? 'SIM (' + this.token.substring(0, 20) + '...)' : 'NÃO'}`);
      return config;
    });

    this.instance.interceptors.response.use(
      (response) => {
        console.log(`[API] Response ${response.status}:`, response.data);
        return response;
      },
      (error: AxiosError) => {
        console.warn(`[API] Error:`, error.message, error.response?.data);
        if (error.response?.status === 401) {
          this.clearToken();
        }
        return Promise.reject(error);
      }
    );
  }

  private restoreToken() {
    try {
      if (Platform.OS === "web" && typeof localStorage !== "undefined") {
        const saved = localStorage.getItem(TOKEN_KEY);
        if (saved) {
          this.token = saved;
          console.log("[API] Token restaurado do storage");
        }
      }
    } catch (e) {
      console.warn("[API] Falha ao restaurar token:", e);
    }
  }

  private persistToken(token: string | null) {
    try {
      if (Platform.OS === "web" && typeof localStorage !== "undefined") {
        if (token) {
          localStorage.setItem(TOKEN_KEY, token);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      }
    } catch (e) {
      console.warn("[API] Falha ao persistir token:", e);
    }
  }

  setToken(token: string) {
    this.token = token;
    this.persistToken(token);
  }

  clearToken() {
    this.token = null;
    this.persistToken(null);
  }

  getToken() {
    return this.token;
  }

  get<T>(endpoint: string) {
    return this.instance.get<T>(endpoint);
  }

  post<T>(endpoint: string, data?: object) {
    return this.instance.post<T>(endpoint, data);
  }

  put<T>(endpoint: string, data?: object) {
    return this.instance.put<T>(endpoint, data);
  }

  delete<T>(endpoint: string) {
    return this.instance.delete<T>(endpoint);
  }

  patch<T>(endpoint: string, data?: object) {
    return this.instance.patch<T>(endpoint, data);
  }
}

export const api = new ApiClient();