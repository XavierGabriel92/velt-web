"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import type {
  TravelReportResponse,
  PagedResult,
} from "./types"

function getTomorrowISO(): string {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split("T")[0]
}

async function getUpcomingTravelReports(
  companyId: string | undefined
): Promise<TravelReportResponse[]> {
  if (!companyId) {
    return []
  }

  const params = new URLSearchParams()
  params.append("companyId", companyId)
  params.append("endDateFrom", getTomorrowISO())
  params.append("pageSize", "20")

  const result = await apiRequest<PagedResult<TravelReportResponse>>(
    `/api/travel-reports?${params.toString()}`
  )

  const items = result?.items ?? []
  return items.sort(
    (a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  )
}

export function useTravelReportsUpcoming() {
  const { selectedCompany } = useAuth()
  const companyId = selectedCompany?.companyId

  return useSuspenseQuery({
    queryKey: ["travel-reports-upcoming", companyId ?? "none"],
    queryFn: () => getUpcomingTravelReports(companyId),
  })
}
