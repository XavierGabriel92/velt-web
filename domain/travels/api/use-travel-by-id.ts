"use client"

import { useQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import type { TravelResponse } from "./types"

export function mapTravelFromApi(raw: Record<string, unknown>): TravelResponse {
  const items = (raw.items ?? raw.Items) as Record<string, unknown>[] | undefined
  return {
    id: (raw.id ?? raw.Id) as string,
    userId: (raw.userId ?? raw.UserId) as string,
    userName: (raw.userName ?? raw.UserName) as string,
    userEmail: (raw.userEmail ?? raw.UserEmail) as string,
    companyId: (raw.companyId ?? raw.CompanyId) as string,
    companyName: (raw.companyName ?? raw.CompanyName) as string,
    status: (raw.status ?? raw.Status) as string,
    title: (raw.title ?? raw.Title) as string,
    description: (raw.description ?? raw.Description) as string | undefined,
    travelReportId: (raw.travelReportId ?? raw.TravelReportId) as string | undefined,
    travelReport: raw.travelReport ?? raw.TravelReport
      ? (() => {
          const r = (raw.travelReport ?? raw.TravelReport) as Record<string, unknown>
          return {
            id: (r.id ?? r.Id) as string,
            title: (r.title ?? r.Title) as string,
            startDate: (r.startDate ?? r.StartDate) as string,
            endDate: (r.endDate ?? r.EndDate) as string,
          }
        })()
      : undefined,
    items: Array.isArray(items)
      ? items.map((it: Record<string, unknown>) => ({
          id: (it.id ?? it.Id) as string,
          travelId: (it.travelId ?? it.TravelId) as string | undefined,
          productType: (it.productType ?? it.ProductType) as string,
          productId: (it.productId ?? it.ProductId) as string,
          productName: (it.productName ?? it.ProductName) as string,
          userIds: (it.userIds ?? it.UserIds ?? []) as string[],
          travelers: (it.travelers ?? it.Travelers) as { id: string; name: string; email: string }[] | undefined,
          totalPrice: Number(it.totalPrice ?? it.TotalPrice ?? 0),
          approvalStatus: (it.approvalStatus ?? it.ApprovalStatus) as string,
          requiresApproval: Boolean(it.requiresApproval ?? it.RequiresApproval),
          validationViolations: (it.validationViolations ?? it.ValidationViolations ?? []) as string[],
          deadlineDate: (it.deadlineDate ?? it.DeadlineDate) as string | undefined,
          costCenterId: (it.costCenterId ?? it.CostCenterId) as string | undefined,
          expenseId: (it.expenseId ?? it.ExpenseId) as string | undefined,
          isEmitted: Boolean(it.isEmitted ?? it.IsEmitted),
          emittedAt: (it.emittedAt ?? it.EmittedAt) as string | undefined,
          emittedByUserId: (it.emittedByUserId ?? it.EmittedByUserId) as string | undefined,
          createdAt: (it.createdAt ?? it.CreatedAt) as string,
          updatedAt: (it.updatedAt ?? it.UpdatedAt) as string,
        }))
      : [],
    createdAt: (raw.createdAt ?? raw.CreatedAt) as string,
    updatedAt: (raw.updatedAt ?? raw.UpdatedAt) as string,
  }
}

async function fetchTravelById(id: string): Promise<TravelResponse> {
  const raw = await apiRequest<Record<string, unknown>>(`/api/travels/${encodeURIComponent(id)}`)
  return mapTravelFromApi(raw ?? {})
}

/** Obtém uma Travel por ID (para redirecionamento pós-confirm e detalhe de solicitação) */
export function useTravelById(id: string | null) {
  return useQuery({
    queryKey: ["travel", id],
    queryFn: () => fetchTravelById(id!),
    enabled: !!id,
  })
}

/** Função para obter travelReportId após confirm (sem hook) */
export async function getTravelById(id: string): Promise<TravelResponse> {
  return fetchTravelById(id)
}
