"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import { toast } from "sonner"
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
  }
}

async function approveReimbursement(id: string): Promise<ReimbursementRequestResponse> {
  const raw = await apiRequest<Record<string, unknown>>(
    `/api/reimbursements/requests/${encodeURIComponent(id)}/approve`,
    { method: "POST" }
  )
  return mapResponse(raw ?? {})
}

/**
 * Hook para aprovar uma solicitação de reembolso.
 * Invalida caches de reembolsos pendentes ao suceder.
 */
export function useApproveReimbursement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: approveReimbursement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-reimbursements"] })
      queryClient.invalidateQueries({ queryKey: ["reimbursement-requests"] })
      toast.success("Reembolso aprovado com sucesso")
    },
    onError: (error) => {
      toast.error("Erro ao aprovar", {
        description: error instanceof Error ? error.message : "Erro desconhecido",
      })
    },
  })
}
