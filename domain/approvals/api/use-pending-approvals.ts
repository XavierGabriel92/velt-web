"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import type { PendingApproval } from "./types"
import { MOCK_SCENARIOS, type MockScenarioId } from "./mock-pending-approvals"

/** Mapeia productType do backend para label amigável em português */
const PRODUCT_TYPE_LABELS: Record<string, string> = {
  Aereo: "Passagem",
  Hotel: "Hotel",
  AluguelCarro: "Aluguel de carro",
}

/**
 * Busca aprovações pendentes da API.
 * Retorna itens em dois contextos: awaiting_my_approval e my_pending_as_traveler.
 *
 * @param userId - ID do usuário logado (approverId/requester)
 * @param companyId - ID da empresa selecionada (opcional - sem filtro de empresa se null)
 */
async function getPendingApprovals(
  userId: string,
  companyId: string | undefined
): Promise<PendingApproval[]> {
  const params = new URLSearchParams({
    approverId: userId,
    page: "1",
    pageSize: "10",
    includeOwnPending: "true",
  })
  if (companyId) {
    params.set("companyId", companyId)
  }

  const data = await apiRequest<{ items: Record<string, unknown>[] }>(
    `/api/approvals/pending?${params.toString()}`
  )

  return (data.items ?? []).map(mapApiItemToPendingApproval)
}

/**
 * Converte o item da API (camelCase) para o tipo PendingApproval do frontend.
 * Inclui formatação de category e date.
 */
function mapApiItemToPendingApproval(item: Record<string, unknown>): PendingApproval {
  const pendingSince = item.pendingSince as string
  const date = pendingSince
    ? new Date(pendingSince).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : ""

  const productType = (item.productType as string) || ""
  const category = PRODUCT_TYPE_LABELS[productType] || productType || "Outros"

  return {
    viewContext: item.viewContext as PendingApproval["viewContext"],
    travelId: (item.travelId as string) || "",
    travelItemId: (item.travelItemId as string) || "",
    travelerId: (item.travelerId as string) || "",
    travelerName: (item.travelerName as string) || "",
    productType,
    productName: (item.productName as string) || "",
    category,
    date,
    amount: Number(item.price ?? item.amount ?? 0),
    violations: Array.isArray(item.violations) ? (item.violations as string[]) : [],
    pendingSince,
    canApprove: Boolean(item.canApprove),
    isEmergencyApproval: Boolean(item.isEmergencyApproval),
    directApproverId: item.directApproverId as string | undefined,
    directApproverName: item.directApproverName as string | undefined,
    isCurrentUserDirectApprover: Boolean(item.isCurrentUserDirectApprover),
    allApprovers: item.allApprovers as PendingApproval["allApprovers"],
  }
}

/**
 * Hook para buscar aprovações pendentes.
 * Usa useSuspenseQuery - deve ser envolvido em Suspense boundary.
 *
 * Quando userId não está disponível, retorna array vazio (evita chamada à API).
 *
 * @param mockScenario - Quando 1|2|3|4, retorna dados mockados do cenário correspondente (para testar UX).
 */
export function usePendingApprovals(
  userId: string,
  companyId: string | undefined,
  mockScenario?: MockScenarioId
) {
  return useSuspenseQuery({
    queryKey: ["pending-approvals", userId, companyId ?? "all", mockScenario ?? "live"],
    queryFn: () => {
      if (mockScenario && mockScenario in MOCK_SCENARIOS) {
        return Promise.resolve([...MOCK_SCENARIOS[mockScenario]])
      }
      return userId ? getPendingApprovals(userId, companyId) : Promise.resolve([])
    },
  })
}
