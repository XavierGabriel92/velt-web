"use client"

import { useQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import type {
  TravelReportResponse,
  TravelReportFilterRequest,
  PagedResult,
} from "./types"

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
  const data = await apiRequest<PagedResult<TravelReportResponse>>(endpoint)
  return data?.items ?? []
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
