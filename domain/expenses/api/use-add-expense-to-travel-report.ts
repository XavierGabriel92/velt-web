"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import type { TravelReportResponse } from "@/domain/travel-reports/api/types"

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

async function addExpenseToTravelReport(
  reportId: string,
  expenseId: string
): Promise<TravelReportResponse> {
  const raw = await apiRequest<Record<string, unknown>>(
    `/api/travel-reports/${encodeURIComponent(reportId)}/expenses/${encodeURIComponent(expenseId)}`,
    { method: "POST" }
  )
  return mapTravelReportFromApi(raw ?? {})
}

export function useAddExpenseToTravelReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ reportId, expenseId }: { reportId: string; expenseId: string }) =>
      addExpenseToTravelReport(reportId, expenseId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["travel-report", data.id] })
      queryClient.invalidateQueries({ queryKey: ["travel-reports"] })
      queryClient.invalidateQueries({ queryKey: ["expenses"] })
    },
  })
}
