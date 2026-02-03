"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import type { ReimbursementRequestResponse } from "@/domain/reimbursements/api/types"

function mapResponse(raw: Record<string, unknown>): ReimbursementRequestResponse {
  const expenseAmount = raw.expenseAmount ?? raw.ExpenseAmount
  return {
    id: (raw.id ?? raw.Id) as string,
    expenseId: (raw.expenseId ?? raw.ExpenseId) as string,
    state: (raw.state ?? raw.State) as ReimbursementRequestResponse["state"],
    approvedByUserId: (raw.approvedByUserId ?? raw.ApprovedByUserId) as string | undefined,
    rejectedByUserId: (raw.rejectedByUserId ?? raw.RejectedByUserId) as string | undefined,
    rejectionReason: (raw.rejectionReason ?? raw.RejectionReason) as string | undefined,
    approvedAt: (raw.approvedAt ?? raw.ApprovedAt) as string | undefined,
    declaredPaidWithPersonalFunds: Boolean(raw.declaredPaidWithPersonalFunds ?? raw.DeclaredPaidWithPersonalFunds),
    createdAt: (raw.createdAt ?? raw.CreatedAt) as string,
    updatedAt: (raw.updatedAt ?? raw.UpdatedAt) as string,
    expenseDescription: (raw.expenseDescription ?? raw.ExpenseDescription) as string | undefined,
    expenseAmount: expenseAmount != null ? Number(expenseAmount) : undefined,
    requesterUserId: (raw.requesterUserId ?? raw.RequesterUserId) as string | undefined,
    requesterUserName: (raw.requesterUserName ?? raw.RequesterUserName) as string | undefined,
    travelReportId: (raw.travelReportId ?? raw.TravelReportId) as string | undefined,
    travelReportTitle: (raw.travelReportTitle ?? raw.TravelReportTitle) as string | undefined,
  }
}

async function getPendingReimbursementsForApprover(
  companyId: string | undefined
): Promise<ReimbursementRequestResponse[]> {
  const params = new URLSearchParams({ scope: "approver" })
  if (companyId) params.set("companyId", companyId)
  const raw = await apiRequest<Record<string, unknown>[]>(
    `/api/reimbursements/requests?${params.toString()}`
  )
  const list = Array.isArray(raw) ? raw : []
  return list.map((item) => mapResponse(item ?? {}))
}

/**
 * Hook para listar solicitações de reembolso pendentes que o usuário logado pode aprovar.
 * Usa useSuspenseQuery - deve ser envolvido em Suspense boundary.
 */
export function usePendingReimbursements(companyId: string | undefined) {
  return useSuspenseQuery({
    queryKey: ["pending-reimbursements", companyId ?? "all"],
    queryFn: () => getPendingReimbursementsForApprover(companyId),
  })
}
