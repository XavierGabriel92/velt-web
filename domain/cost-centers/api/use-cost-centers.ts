"use client"

import { useQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import type { CostCenter } from "./types"

async function fetchCostCenters(companyId: string): Promise<CostCenter[]> {
  const data = await apiRequest<CostCenter[]>(
    `/api/CostCenters/my-company?companyId=${encodeURIComponent(companyId)}`
  )
  return Array.isArray(data) ? data.filter((cc) => cc.isActive) : []
}

export function useCostCenters(companyId: string | null) {
  return useQuery({
    queryKey: ["cost-centers", companyId],
    queryFn: () => fetchCostCenters(companyId!),
    enabled: !!companyId,
  })
}
