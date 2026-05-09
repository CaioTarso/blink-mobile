import { AxiosError } from "axios";

/**
 * Mapa de mensagens amigáveis para erros comuns de autenticação.
 * Traduz mensagens técnicas do backend/Axios em textos legíveis para o usuário.
 */
const FRIENDLY_MESSAGES: Record<string, string> = {
  // Mensagens do Laravel
  "These credentials do not match our records.":
    "E-mail ou senha incorretos. Verifique e tente novamente.",
  "The provided credentials are incorrect.":
    "E-mail ou senha incorretos. Verifique e tente novamente.",
  "The email has already been taken.":
    "Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.",
  "The email field is required.":
    "O campo de e-mail é obrigatório.",
  "The password field is required.":
    "O campo de senha é obrigatório.",
  "The password field must be at least 8 characters.":
    "A senha deve ter pelo menos 8 caracteres.",
  "The password field confirmation does not match.":
    "As senhas não coincidem. Verifique e tente novamente.",
  "The name field is required.":
    "O campo de nome é obrigatório.",
  "The phone field is required.":
    "O campo de telefone é obrigatório.",
  "The address field is required.":
    "O campo de endereço é obrigatório.",
  "The email field must be a valid email address.":
    "Informe um endereço de e-mail válido.",
  "Too Many Attempts.":
    "Muitas tentativas. Aguarde um momento e tente novamente.",
};

/**
 * Extrai uma mensagem de erro legível a partir de um erro do Axios ou genérico.
 * Tenta, nesta ordem:
 *  1. `response.data.message` (mensagem principal do Laravel)
 *  2. `response.data.errors` (erros de validação do Laravel — pega o primeiro)
 *  3. Tratamento por status HTTP
 *  4. Mensagem genérica
 */
export function getReadableErrorMessage(error: unknown, fallback?: string): string {
  if (!error) {
    return fallback ?? "Ocorreu um erro inesperado. Tente novamente.";
  }

  // Erro do Axios com resposta do servidor
  if (isAxiosError(error) && error.response) {
    const { status, data } = error.response;

    // 1. Erros de validação (422) — Laravel retorna `errors` como objeto
    if (status === 422 && data?.errors) {
      const messages = extractValidationErrors(data.errors);
      if (messages.length > 0) {
        return messages.map((msg) => translateMessage(msg)).join("\n");
      }
    }

    // 2. Mensagem principal do backend
    if (data?.message && typeof data.message === "string") {
      return translateMessage(data.message);
    }

    // 3. Tratamento por status HTTP
    return getMessageByStatus(status);
  }

  // Erro de rede (sem resposta do servidor)
  if (isAxiosError(error) && !error.response) {
    if (error.code === "ECONNABORTED") {
      return "A conexão demorou muito. Verifique sua internet e tente novamente.";
    }
    return "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.";
  }

  // Erro genérico
  if (error instanceof Error) {
    // Evitar mostrar "Request failed with status code XXX"
    if (error.message.startsWith("Request failed with status code")) {
      return fallback ?? "Ocorreu um erro inesperado. Tente novamente.";
    }
    return error.message;
  }

  return fallback ?? "Ocorreu um erro inesperado. Tente novamente.";
}

function isAxiosError(error: unknown): error is AxiosError<any> {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as any).isAxiosError === true
  );
}

/**
 * Extrai todas as mensagens de validação do objeto `errors` do Laravel.
 * O formato é: { campo: ["mensagem1", "mensagem2"], ... }
 */
function extractValidationErrors(errors: Record<string, string[]>): string[] {
  const messages: string[] = [];
  for (const field of Object.keys(errors)) {
    const fieldErrors = errors[field];
    if (Array.isArray(fieldErrors)) {
      messages.push(...fieldErrors);
    }
  }
  return messages;
}

/**
 * Traduz uma mensagem do backend para uma versão amigável, se disponível.
 */
function translateMessage(message: string): string {
  return FRIENDLY_MESSAGES[message] ?? message;
}

/**
 * Retorna uma mensagem amigável com base no código de status HTTP.
 */
function getMessageByStatus(status: number): string {
  switch (status) {
    case 400:
      return "Dados inválidos. Verifique as informações e tente novamente.";
    case 401:
      return "E-mail ou senha incorretos. Verifique e tente novamente.";
    case 403:
      return "Você não tem permissão para realizar esta ação.";
    case 404:
      return "Recurso não encontrado. Tente novamente mais tarde.";
    case 409:
      return "Este registro já existe. Verifique os dados informados.";
    case 422:
      return "Alguns campos estão inválidos. Verifique e tente novamente.";
    case 429:
      return "Muitas tentativas. Aguarde um momento e tente novamente.";
    case 500:
    case 502:
    case 503:
      return "O servidor está temporariamente indisponível. Tente novamente em alguns instantes.";
    default:
      return "Ocorreu um erro inesperado. Tente novamente.";
  }
}
