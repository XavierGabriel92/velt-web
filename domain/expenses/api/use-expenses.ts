"use client"

import { useQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import type { ExpenseResponse, ExpenseFilterRequest } from "./types"

function mapExpenseFromApi(raw: Record<string, unknown>): ExpenseResponse {
  return {
    id: (raw.id ?? raw.Id) as string,
    companyId: (raw.companyId ?? raw.CompanyId) as string,
    travelId: (raw.travelId ?? raw.TravelId) as string | undefined,
    travelItemId: (raw.travelItemId ?? raw.TravelItemId) as string | undefined,
    userId: (raw.userId ?? raw.UserId) as string,
    emissorId: (raw.emissorId ?? raw.EmissorId) as string | undefined,
    valor: Number(raw.valor ?? raw.Valor ?? 0),
    costCenterId: (raw.costCenterId ?? raw.CostCenterId) as string,
    grupoDeDespesaId: (raw.grupoDeDespesaId ?? raw.GrupoDeDespesaId) as string | undefined,
    comprovantesPath: (raw.comprovantesPath ?? raw.ComprovantesPath) as string | undefined,
    origin: (raw.origin ?? raw.Origin) as ExpenseResponse["origin"],
    purpose: (raw.purpose ?? raw.Purpose) as ExpenseResponse["purpose"],
    state: (raw.state ?? raw.State) as ExpenseResponse["state"],
    checkoutPaymentMethodSelected: (raw.checkoutPaymentMethodSelected ?? raw.CheckoutPaymentMethodSelected) as string | undefined,
    description: (raw.description ?? raw.Description) as string | undefined,
    expenseDate: (raw.expenseDate ?? raw.ExpenseDate) as string | undefined,
    category: (raw.category ?? raw.Category) as string | undefined,
    createdAt: (raw.createdAt ?? raw.CreatedAt) as string,
    updatedAt: (raw.updatedAt ?? raw.UpdatedAt) as string,
    companyName: (raw.companyName ?? raw.CompanyName) as string | undefined,
    userName: (raw.userName ?? raw.UserName) as string | undefined,
    costCenterName: (raw.costCenterName ?? raw.CostCenterName) as string | undefined,
  }
}

async function fetchExpenses(filter: ExpenseFilterRequest): Promise<ExpenseResponse[]> {
  const params = new URLSearchParams()
  params.set("companyId", filter.companyId)
  if (filter.dateFrom) params.set("dateFrom", filter.dateFrom)
  if (filter.dateTo) params.set("dateTo", filter.dateTo)
  if (filter.state) params.set("state", filter.state)
  const data = await apiRequest<unknown>(`/api/expenses?${params.toString()}`)
  const items = Array.isArray(data) ? data : []
  return items.map((item) => mapExpenseFromApi(item as Record<string, unknown>))
}

export function useExpenses(filter: ExpenseFilterRequest | null) {
  return useQuery({
    queryKey: ["expenses", filter],
    queryFn: () => fetchExpenses(filter!),
    enabled: !!filter?.companyId,
  })
}
