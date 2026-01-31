import { getBrowserQueryClient } from "./query-client"

/**
 * Funções utilitárias para gerenciar autenticação
 */

/**
 * Verifica se o usuário está autenticado
 * Retorna true se houver token e dados do usuário no localStorage
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  
  const token = localStorage.getItem("auth_token");
  const user = localStorage.getItem("auth_user");
  
  return !!(token && user);
}

/**
 * Obtém os dados do usuário autenticado
 */
export function getAuthUser(): any | null {
  if (typeof window === "undefined") return null;
  
  const userStr = localStorage.getItem("auth_user");
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Remove todos os dados de autenticação e limpa o cache do TanStack Query
 */
export function clearAuth(): void {
  if (typeof window === "undefined") return;
  
  // Limpar localStorage
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
  
  // Limpar cache do TanStack Query
  const queryClient = getBrowserQueryClient();
  if (queryClient) {
    queryClient.clear();
  }
}

