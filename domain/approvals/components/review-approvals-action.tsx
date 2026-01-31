"use client"

import { QuickActionButton } from "@/components/shared/quick-action-button"
import { usePendingApprovals } from "../api/use-pending-approvals"
import { CheckCircle2 } from "lucide-react"

export function ReviewApprovalsAction() {
  const { data: approvals } = usePendingApprovals()
  const pendingCount = approvals?.length || 0

  const handleClick = () => {
    // Placeholder - não faz nada por enquanto
  }

  return (
    <QuickActionButton
      title="Revisar Aprovações"
      icon={CheckCircle2}
      onClick={handleClick}
      badge={pendingCount > 0 ? pendingCount : undefined}
    />
  )
}

