import { clearAuth } from "./auth"

/**
 * Função que retorna a URL da API (ex.: http://localhost:5089).
 * Deve conter o esquema (http/https) e não ter barra no final.
 */
export function getApiUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL;
  if (!raw || typeof raw !== "string") {
    throw new Error("NEXT_PUBLIC_API_URL não está definida. Configure em .env.local (ex.: http://localhost:5089).");
  }
  const apiUrl = raw.trim().replace(/\/+$/, "");
  if (!apiUrl.startsWith("http://") && !apiUrl.startsWith("https://")) {
    throw new Error(
      "NEXT_PUBLIC_API_URL deve começar com http:// ou https:// (ex.: http://localhost:5089)."
    );
  }
  return apiUrl;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

// Função para salvar token no localStorage
export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
}

// Função para remover token do localStorage
export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const baseUrl = getApiUrl();
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Não autorizado");
    }
    if (response.status === 404) {
      throw new Error(
        `Recurso não encontrado (404): ${url}. Verifique se a API está rodando e se NEXT_PUBLIC_API_URL está correta (ex.: http://localhost:5089).`
      );
    }
    let errorMessage = `Erro na requisição (${response.status}): ${url}`;
    try {
      const err = await response.json() as { message?: string; title?: string };
      if (err?.message) errorMessage = err.message;
      else if (err?.title) errorMessage = err.title;
    } catch {
      // ignorar falha de parse
    }
    throw new Error(errorMessage);
  }

  return response.json() as T;
}

/**
 * Requisição com FormData (ex.: upload de arquivo).
 * Não define Content-Type para que o browser defina multipart/form-data com boundary.
 */
export async function apiRequestFormData<T>(
  endpoint: string,
  formData: FormData,
  method = "POST"
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const baseUrl = getApiUrl();
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const response = await fetch(url, {
    method,
    credentials: "include",
    headers,
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Não autorizado");
    }
    if (response.status === 404) {
      throw new Error(
        `Recurso não encontrado (404): ${url}. Verifique se a API está rodando e se NEXT_PUBLIC_API_URL está correta.`
      );
    }
    let errorMessage = `Erro na requisição (${response.status}): ${url}`;
    try {
      const err = (await response.json()) as { message?: string; title?: string };
      if (err?.message) errorMessage = err.message;
      else if (err?.title) errorMessage = err.title;
    } catch {
      // ignorar falha de parse
    }
    throw new Error(errorMessage);
  }

  return response.json() as T;
}

/**
 * Função para fazer requisições à API sem autenticação
 * Útil para endpoints públicos como login
 */
export async function apiRequestWithoutAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Tratamento de erro
    let errorMessage = "Erro na requisição";

    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const error = await response.json();

        if (error.message) {
          errorMessage = error.message;
        } else if (error.errorMessage) {
          errorMessage = error.errorMessage;
        } else if (error.title) {
          errorMessage = error.title;
        } else if (error.errors) {
          const validationErrors = Object.values(error.errors)
            .flat()
            .join(", ");
          errorMessage = `Erro de validação: ${validationErrors}`;
        }
      } else {
        const text = await response.text();
        if (text) {
          errorMessage = text;
        }
      }
    } catch {
      errorMessage = response.statusText || `Erro ${response.status}`;
    }

    throw new Error(errorMessage);
  }

  // Verificar se a resposta tem conteúdo antes de tentar fazer parse
  const contentType = response.headers.get("content-type");
  const contentLength = response.headers.get("content-length");

  // Se não houver conteúdo (204 No Content, ou Content-Length: 0), retornar void
  if (response.status === 204 || contentLength === "0") {
    return undefined as T;
  }

  // Se não for JSON, retornar undefined
  if (!contentType || !contentType.includes("application/json")) {
    return undefined as T;
  }

  // Tentar fazer parse do JSON, mas tratar resposta vazia
  const text = await response.text();
  if (!text || text.trim() === "") {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined as T;
  }
}

