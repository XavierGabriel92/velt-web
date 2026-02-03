"use client"

import { useMemo } from "react"
import { usePendingReimbursements } from "../api/use-pending-reimbursements"
import { useApproveReimbursement } from "../api/use-approve-reimbursement"
import { useRejectReimbursement } from "../api/use-reject-reimbursement"
import { useAuth } from "@/lib/auth-context"
import { ApprovalsTable } from "./approvals-table"
import type { ApprovalRow, ApprovalRowItem } from "../api/approval-row-types"
import type { ReimbursementRequestResponse } from "@/domain/reimbursements/api/types"

function mapReimbursementsToRows(
  requests: ReimbursementRequestResponse[]
): ApprovalRow[] {
  return requests.map((r) => ({
    id: r.id,
    type: "reimbursement",
    collaborator: r.requesterUserName ?? "—",
    report: r.travelReportTitle ?? "—",
    itemsCount: 1,
    totalValue: r.expenseAmount ?? 0,
    status:
      r.state === "Pending"
        ? "Pendente"
        : r.state === "Approved"
          ? "Aprovado"
          : "Rejeitado",
    items: [
      {
        id: r.id,
        label: r.expenseDescription ?? `Despesa ${r.expenseId.slice(0, 8)}`,
        amount: r.expenseAmount ?? 0,
        meta: { reimbursementRequestId: r.id },
      },
    ],
    canApprove: r.state === "Pending",
    reimbursementRequestId: r.id,
  }))
}

export function ApprovalsReimbursementTab() {
  const { selectedCompany } = useAuth()
  const companyId = selectedCompany?.companyId

  const { data: requests = [] } = usePendingReimbursements(companyId)
  const approveMutation = useApproveReimbursement()
  const rejectMutation = useRejectReimbursement()

  const rows = useMemo(
    () => mapReimbursementsToRows(requests),
    [requests]
  )

  const handleApproveItem = (row: ApprovalRow, item: ApprovalRowItem) => {
    const id = row.reimbursementRequestId ?? item.meta?.reimbursementRequestId
    if (id) approveMutation.mutate(id)
  }

  const handleRejectItem = (row: ApprovalRow, item: ApprovalRowItem) => {
    const id = row.reimbursementRequestId ?? item.meta?.reimbursementRequestId
    if (id) {
      const reason =
        typeof window !== "undefined"
          ? window.prompt("Motivo da rejeição (opcional):") ?? "Rejeitado pelo aprovador"
          : "Rejeitado pelo aprovador"
      rejectMutation.mutate({
        id,
        reason: reason || "Rejeitado pelo aprovador",
      })
    }
  }

  return (
    <ApprovalsTable
      rows={rows}
      onApproveItem={handleApproveItem}
      onRejectItem={handleRejectItem}
      isApproving={approveMutation.isPending}
      isRejecting={rejectMutation.isPending}
      emptyMessage={
        !companyId
          ? "Selecione uma empresa para ver solicitações de reembolso pendentes"
          : "Nenhuma solicitação de reembolso pendente de aprovação"
      }
    />
  )
}
