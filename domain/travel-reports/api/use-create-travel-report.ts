"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import type {
  CreateTravelReportRequest,
  TravelReportResponse,
} from "./types"

async function createTravelReport(
  data: CreateTravelReportRequest
): Promise<TravelReportResponse> {
  return apiRequest<TravelReportResponse>("/api/travel-reports", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function useCreateTravelReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTravelReport,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["travel-reports", "available", variables.companyId],
      })
    },
  })
}
