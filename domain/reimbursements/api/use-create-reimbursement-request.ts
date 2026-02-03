"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import type { CreateReimbursementRequestRequest, ReimbursementRequestResponse } from "./types"

function mapResponse(raw: Record<string, unknown>): ReimbursementRequestResponse {
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
  }
}

async function createReimbursementRequest(
  data: CreateReimbursementRequestRequest
): Promise<ReimbursementRequestResponse> {
  const raw = await apiRequest<Record<string, unknown>>("/api/reimbursements/requests", {
    method: "POST",
    body: JSON.stringify({
      expenseId: data.expenseId,
      declaredPaidWithPersonalFunds: data.declaredPaidWithPersonalFunds,
    }),
  })
  return mapResponse(raw ?? {})
}

export function useCreateReimbursementRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createReimbursementRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reimbursement-requests"] })
      queryClient.invalidateQueries({ queryKey: ["reimbursements"] })
      queryClient.invalidateQueries({ queryKey: ["expenses"] })
    },
  })
}
