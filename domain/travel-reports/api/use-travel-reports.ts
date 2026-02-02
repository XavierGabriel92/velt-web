"use client"

import { useQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import type {
  TravelReportResponse,
  TravelReportFilterRequest,
  PagedResult,
} from "./types"

function mapTravelReportFromApi(raw: Record<string, unknown>): TravelReportResponse {
  return {
    id: (raw.id ?? raw.Id) as string,
    companyId: (raw.companyId ?? raw.CompanyId) as string,
    companyName: (raw.companyName ?? raw.CompanyName) as string,
    title: (raw.title ?? raw.Title) as string,
    description: (raw.description ?? raw.Description) as string | undefined,
    reason: (raw.reason ?? raw.Reason) as string | undefined,
    startDate: (raw.startDate ?? raw.StartDate) as string,
    endDate: (raw.endDate ?? raw.EndDate) as string,
    travelIds: (raw.travelIds ?? raw.TravelIds ?? []) as string[],
    expenseIds: (raw.expenseIds ?? raw.ExpenseIds ?? []) as string[],
    createdByUserId: (raw.createdByUserId ?? raw.CreatedByUserId) as string,
    createdByUserName: (raw.createdByUserName ?? raw.CreatedByUserName) as string,
    travelsCount: Number(raw.travelsCount ?? raw.TravelsCount ?? 0),
    expensesCount: Number(raw.expensesCount ?? raw.ExpensesCount ?? 0),
    createdAt: (raw.createdAt ?? raw.CreatedAt) as string,
    updatedAt: (raw.updatedAt ?? raw.UpdatedAt) as string,
    firstTravelerName: (raw.firstTravelerName ?? raw.FirstTravelerName) as string | undefined,
    otherTravelersCount: (raw.otherTravelersCount ?? raw.OtherTravelersCount) as number | undefined,
    travelerNames: (raw.travelerNames ?? raw.TravelerNames) as string[] | undefined,
  }
}

async function fetchTravelReportById(id: string): Promise<TravelReportResponse> {
  const raw = await apiRequest<Record<string, unknown>>(
    `/api/travel-reports/${encodeURIComponent(id)}`
  )
  return mapTravelReportFromApi(raw ?? {})
}

async function fetchAvailableTravelReports(
  companyId: string
): Promise<TravelReportResponse[]> {
  const params = new URLSearchParams()
  params.append("companyId", companyId)
  const data = await apiRequest<TravelReportResponse[]>(
    `/api/travel-reports/available?${params.toString()}`
  )
  return Array.isArray(data) ? data : []
}

async function fetchTravelReports(
  filter?: TravelReportFilterRequest
): Promise<TravelReportResponse[]> {
  const params = new URLSearchParams()
  if (filter?.companyId) params.append("companyId", filter.companyId)
  if (filter?.endDateFrom) params.append("endDateFrom", filter.endDateFrom)
  if (filter?.startDateFrom) params.append("startDateFrom", filter.startDateFrom)
  if (filter?.startDateTo) params.append("startDateTo", filter.startDateTo)
  if (filter?.page) params.append("page", filter.page.toString())
  if (filter?.pageSize) params.append("pageSize", filter.pageSize.toString())
  const queryString = params.toString()
  const endpoint = `/api/travel-reports${queryString ? `?${queryString}` : ""}`
  const data = await apiRequest<Record<string, unknown>>(endpoint)
  const items = (data?.items ?? data?.Items ?? []) as Record<string, unknown>[]
  return Array.isArray(items) ? items.map(mapTravelReportFromApi) : []
}

/** Obtém um relatório de viagem por ID (detalhe da página Minhas Viagens) */
export function useTravelReportById(id: string | null) {
  return useQuery({
    queryKey: ["travel-report", id],
    queryFn: () => fetchTravelReportById(id!),
    enabled: !!id,
  })
}

/** Lista relatórios de viagem (para aba Minhas Viagens) */
export function useTravelReportsList(filter?: TravelReportFilterRequest) {
  return useQuery({
    queryKey: ["travel-reports", "list", filter],
    queryFn: () => fetchTravelReports(filter),
    enabled: !!filter?.companyId,
  })
}

/** Hook for travel reports available for selection (e.g. in booking form) */
export function useTravelReports(
  companyId: string | null,
  refreshKey?: number | string
) {
  return useQuery({
    queryKey: ["travel-reports", "available", companyId, refreshKey],
    queryFn: () => fetchAvailableTravelReports(companyId!),
    enabled: !!companyId,
  })
}

/** Hook for upcoming travel reports (dashboard list) */
export function useTravelReportsUpcoming() {
  const { selectedCompany } = useAuth()
  const companyId = selectedCompany?.companyId ?? null

  return useQuery({
    queryKey: ["travel-reports", "upcoming", companyId],
    queryFn: () =>
      fetchTravelReports({
        companyId: companyId ?? undefined,
        endDateFrom: new Date().toISOString().split("T")[0],
        pageSize: 10,
      }),
    enabled: !!companyId,
  })
}
