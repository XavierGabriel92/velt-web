"use client"

import { useQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import type { TravelResponse, PagedTravelsResult } from "./types"
import { mapTravelFromApi } from "./use-travel-by-id"

async function fetchTravelsByReportId(reportId: string): Promise<TravelResponse[]> {
  const params = new URLSearchParams()
  params.append("travelReportId", reportId)
  params.append("pageSize", "50")
  const data = await apiRequest<Record<string, unknown>>(
    `/api/travels?${params.toString()}`
  )
  const items = (data?.items ?? data?.Items ?? []) as unknown[]
  return Array.isArray(items)
    ? items.map((raw) => mapTravelFromApi((raw as Record<string, unknown>) ?? {}))
    : []
}

/** Lista Travels (Solicitações) de um relatório de viagem */
export function useTravelsByReportId(reportId: string | null) {
  return useQuery({
    queryKey: ["travels", "by-report", reportId],
    queryFn: () => fetchTravelsByReportId(reportId!),
    enabled: !!reportId,
  })
}
