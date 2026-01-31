"use client"

import { useMutation } from "@tanstack/react-query"
import { setToken, apiRequestWithoutAuth } from "@/lib/api"
import { LoginRequest, AuthResponse } from "./types"

/**
 * Função para fazer login
 * Usa apiRequestWithoutAuth porque ainda não temos token
 */
async function login(credentials: LoginRequest): Promise<AuthResponse> {
  // NÃO normalizar no frontend - deixar o backend fazer
  // O backend precisa do documento original para normalizar corretamente

  return apiRequestWithoutAuth<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<AuthResponse> => {
      const data = await login(credentials)

      // Salvar token e dados do usuário após login bem-sucedido
      setToken(data.token)
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_user", JSON.stringify(data))
      }

      return data
    },
  })
}

