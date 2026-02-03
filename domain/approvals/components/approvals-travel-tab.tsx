"use client"

import { useMemo } from "react"
import { usePendingApprovals } from "../api/use-pending-approvals"
import { useApproveTraveler } from "../api/use-approve-traveler"
import { useRejectTraveler } from "../api/use-reject-traveler"
import { useAuth } from "@/lib/auth-context"
import { ApprovalsTable } from "./approvals-table"
import type { ApprovalRow, ApprovalRowItem } from "../api/approval-row-types"
import type { PendingApproval } from "../api/types"

function mapTravelApprovalsToRows(approvals: PendingApproval[]): ApprovalRow[] {
  const awaiting = approvals.filter(
    (a) => a.viewContext === "awaiting_my_approval" && a.canApprove
  )
  const byTravel = new Map<string, PendingApproval[]>()
  for (const a of awaiting) {
    const key = a.travelId
    if (!byTravel.has(key)) byTravel.set(key, [])
    byTravel.get(key)!.push(a)
  }

  const rows: ApprovalRow[] = []
  for (const [travelId, items] of byTravel) {
    const totalValue = items.reduce((s, i) => s + i.amount, 0)
    const collaborator = [...new Set(items.map((i) => i.travelerName))].join(", ")
    rows.push({
      id: `travel-${travelId}`,
      type: "travel",
      collaborator,
      report: `Viagem ${travelId.slice(0, 8)}`,
      itemsCount: items.length,
      totalValue,
      status: "Pendente",
      items: items.map((i) => ({
        id: `${i.travelItemId}-${i.travelerId}`,
        label: `${i.travelerName} – ${i.category}: ${i.productName}`,
        amount: i.amount,
        meta: {
          travelId: i.travelId,
          travelItemId: i.travelItemId,
          travelerId: i.travelerId,
        },
      })),
      canApprove: true,
      travelId: items[0]?.travelId,
      travelItemId: items[0]?.travelItemId,
      travelerId: items[0]?.travelerId,
    })
  }
  return rows
}

export function ApprovalsTravelTab() {
  const { user, selectedCompany } = useAuth()
  const userId = user?.userId ?? ""
  const companyId = selectedCompany?.companyId

  const { data: approvals = [] } = usePendingApprovals(userId, companyId)
  const approveMutation = useApproveTraveler()
  const rejectMutation = useRejectTraveler()

  const rows = useMemo(
    () => mapTravelApprovalsToRows(approvals),
    [approvals]
  )

  const handleApproveItem = (row: ApprovalRow, item: ApprovalRowItem) => {
    const travelId = item.meta?.travelId ?? row.travelId
    const travelItemId = item.meta?.travelItemId ?? row.travelItemId
    const travelerId = item.meta?.travelerId ?? row.travelerId
    if (travelId && travelItemId && travelerId) {
      approveMutation.mutate({ travelId, itemId: travelItemId, travelerId })
    }
  }

  const handleRejectItem = (row: ApprovalRow, item: ApprovalRowItem) => {
    const travelId = item.meta?.travelId ?? row.travelId
    const travelItemId = item.meta?.travelItemId ?? row.travelItemId
    const travelerId = item.meta?.travelerId ?? row.travelerId
    if (travelId && travelItemId && travelerId) {
      const reason =
        typeof window !== "undefined"
          ? window.prompt("Motivo da rejeição (opcional):") ?? "Rejeitado pelo aprovador"
          : "Rejeitado pelo aprovador"
      rejectMutation.mutate({
        travelId,
        itemId: travelItemId,
        travelerId,
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
          ? "Selecione uma empresa para ver aprovações pendentes de viagens"
          : "Nenhuma solicitação de viagem pendente de aprovação"
      }
    />
  )
}
