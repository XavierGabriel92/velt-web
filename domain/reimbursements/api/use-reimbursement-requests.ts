"use client"

import { useSuspenseQuery, useQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import type { ReimbursementRequestResponse } from "./types"

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
  }
}

async function getReimbursementRequests(): Promise<ReimbursementRequestResponse[]> {
  const raw = await apiRequest<Record<string, unknown>[]>("/api/reimbursements/requests")
  const list = Array.isArray(raw) ? raw : []
  return list.map((item) => mapResponse(item ?? {}))
}

export function useReimbursementRequests() {
  return useSuspenseQuery({
    queryKey: ["reimbursement-requests"],
    queryFn: getReimbursementRequests,
  })
}

/** Versão com useQuery para uso em listas onde não há Suspense (ex.: relatórios de despesas). */
export function useReimbursementRequestsQuery() {
  return useQuery({
    queryKey: ["reimbursement-requests"],
    queryFn: getReimbursementRequests,
  })
}
