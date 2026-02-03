"use client"

import { getApiUrl } from "@/lib/api"

function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

/**
 * Faz download de um bilhete (e-ticket, voucher) via blob.
 * Retorna o Blob para ser usado com window.URL.createObjectURL.
 */
export async function downloadTicket(ticketId: string): Promise<Blob> {
  const token = getToken()
  if (!token) {
    throw new Error("Usuário não autenticado")
  }

  const apiUrl = getApiUrl()
  const response = await fetch(`${apiUrl}/emissions/tickets/${ticketId}/download`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("auth_token")
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
      throw new Error("Não autorizado")
    }
    const errorData = await response.json().catch(() => ({ message: "Erro desconhecido" }))
    throw new Error(errorData.message || `Erro ao fazer download: ${response.status}`)
  }

  return response.blob()
}

/**
 * Handler para download: cria blob URL, dispara download via <a>, e limpa.
 */
export async function handleDownloadTicket(ticketId: string, fileName: string): Promise<void> {
  const blob = await downloadTicket(ticketId)
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

/**
 * Handler para visualizar: abre o blob em nova aba (funciona para PDF, imagens).
 */
export async function handleViewTicket(ticketId: string): Promise<void> {
  const blob = await downloadTicket(ticketId)
  const url = window.URL.createObjectURL(blob)
  window.open(url, "_blank")
  // Nota: o URL não é revogado imediatamente para permitir visualização na nova aba
}
