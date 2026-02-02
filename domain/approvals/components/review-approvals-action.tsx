"use client"

import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { QuickActionButton } from "@/components/shared/quick-action-button"
import { usePendingApprovals } from "../api/use-pending-approvals"
import { useAuth } from "@/lib/auth-context"
import { CheckCircle2 } from "lucide-react"
import type { MockScenarioId } from "../api/mock-pending-approvals"

export function ReviewApprovalsAction() {
  const router = useRouter()
  const { user, selectedCompany } = useAuth()
  const searchParams = useSearchParams()
  const userId = user?.userId ?? ""
  const companyId = selectedCompany?.companyId

  const mockScenario = searchParams.get("approvalScenario")
  const scenarioId = mockScenario && /^[1-4]$/.test(mockScenario)
    ? (Number(mockScenario) as MockScenarioId)
    : undefined

  const { data: approvals } = usePendingApprovals(userId, companyId, scenarioId)
  const awaitingCount =
    approvals?.filter((a) => a.viewContext === "awaiting_my_approval").length ??
    0

  const handleClick = () => {
    router.push("/inicio/aprovacoes")
  }

  return (
    <QuickActionButton
      title="Revisar Aprovações"
      icon={CheckCircle2}
      onClick={handleClick}
      badge={awaitingCount > 0 ? awaitingCount : undefined}
    />
  )
}
