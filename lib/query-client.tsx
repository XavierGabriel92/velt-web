"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import * as React from "react"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Com SSR, geralmente queremos definir algum stale time
        // para evitar refetch imediatamente no cliente
        staleTime: 60 * 1000, // 1 minuto
        refetchOnWindowFocus: false,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: sempre fazer um novo client
    return makeQueryClient()
  } else {
    // Browser: usar singleton pattern para manter o mesmo client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

/**
 * Obtém o QueryClient do browser (apenas no cliente)
 * Útil para limpar cache quando necessário
 */
export function getBrowserQueryClient(): QueryClient | null {
  if (typeof window === "undefined") return null
  return browserQueryClient || null
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

