"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { ListWithButton } from "@/components/shared/list-with-button"
import { usePendingApprovals } from "../api/use-pending-approvals"
import { useApproveTraveler } from "../api/use-approve-traveler"
import { useRejectTraveler } from "../api/use-reject-traveler"
import { useAuth } from "@/lib/auth-context"
import type { MockScenarioId } from "../api/mock-pending-approvals"
import { Check, X, Clock, Bell } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import type { PendingApproval } from "../api/types"
import { cn } from "@/lib/utils"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

/** Linha de item aguardando aprovação do usuário (Check/X) */
function AwaitingMyApprovalRow({
  approval,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: {
  approval: PendingApproval
  onApprove: () => void
  onReject: () => void
  isApproving: boolean
  isRejecting: boolean
}) {
  const isHighlighted = approval.isCurrentUserDirectApprover

  return (
    <div
      className={cn(
        "flex items-center justify-between py-2 border-b last:border-b-0 rounded-lg px-2 -mx-2",
        isHighlighted && "bg-amber-50 dark:bg-amber-950/30 border-l-4 border-l-amber-500"
      )}
    >
      <div className="flex-1">
        <p className="font-medium">{approval.travelerName}</p>
        <p className="text-sm text-muted-foreground">
          {approval.directApproverName
            ? `Aprovador: ${approval.directApproverName}`
            : approval.category}
          {" • "}
          {approval.date}
        </p>
        <p className="text-sm font-semibold mt-1">
          {formatCurrency(approval.amount)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/50"
          onClick={onApprove}
          disabled={isApproving || isRejecting}
          aria-label="Aprovar"
        >
          <Check className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50"
          onClick={onReject}
          disabled={isApproving || isRejecting}
          aria-label="Rejeitar"
        >
          <X className="size-5" />
        </Button>
      </div>
    </div>
  )
}

/** Linha de item do usuário aguardando aprovação (Sino + tooltip) */
function MyPendingAsTravelerRow({ approval }: { approval: PendingApproval }) {
  const approvers = approval.allApprovers ?? []

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-between py-2 border-b last:border-b-0">
            <div className="flex-1">
              <p className="font-medium">Sua solicitação</p>
              <p className="text-sm text-muted-foreground">
                {approval.directApproverName
                  ? `Aguardando: ${approval.directApproverName}`
                  : approval.category}
                {" • "}
                {approval.date}
              </p>
              <p className="text-sm font-semibold mt-1">
                {formatCurrency(approval.amount)}
              </p>
            </div>
            <div
              className="flex items-center gap-2 cursor-help"
              aria-label="Passe o mouse para ver todos os aprovadores"
            >
              <Bell className="size-5 text-muted-foreground" aria-hidden />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          <p className="font-medium mb-1">Aprovadores:</p>
          <ul className="text-xs space-y-0.5">
            {approvers.map((a) => (
              <li key={a.approverId}>
                {a.approverName}
                {a.level === 1 ? " (direto)" : ` (herança nível ${a.level})`}
              </li>
            ))}
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const MOCK_SCENARIO_LABELS: Record<MockScenarioId, string> = {
  1: "Cenário 1: User 1 (viajante)",
  2: "Cenário 2: User 2 (aprovador + viajante)",
  3: "Cenário 3: User 3 (viajante)",
  4: "Cenário 4: User 4 (aprovador de todos)",
}

const MOCK_SCENARIO_IDS: MockScenarioId[] = [1, 2, 3, 4]

export function PendingApprovalsList() {
  const { user, selectedCompany } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const userId = user?.userId ?? ""
  const companyId = selectedCompany?.companyId

  const mockScenario = searchParams.get("approvalScenario")
  const scenarioId = mockScenario && /^[1-4]$/.test(mockScenario)
    ? (Number(mockScenario) as MockScenarioId)
    : undefined

  const { data: approvals } = usePendingApprovals(userId, companyId, scenarioId)

  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    if (v === "") {
      params.delete("approvalScenario")
    } else {
      params.set("approvalScenario", v)
    }
    const query = params.toString()
    router.replace(query ? `/inicio?${query}` : "/inicio", { scroll: false })
  }
  const approveMutation = useApproveTraveler()
  const rejectMutation = useRejectTraveler()

  const handleButtonClick = () => {
    // Placeholder - navegação para página completa futura
  }

  const handleApprove = (approval: PendingApproval) => {
    if (scenarioId) {
      toast.info("Modo mock: aprovação simulada", { description: `${approval.travelerName} - ${approval.productName}` })
      return
    }
    approveMutation.mutate({
      travelId: approval.travelId,
      itemId: approval.travelItemId,
      travelerId: approval.travelerId,
    })
  }

  const handleReject = (approval: PendingApproval) => {
    if (scenarioId) {
      toast.info("Modo mock: rejeição simulada", { description: `${approval.travelerName} - ${approval.productName}` })
      return
    }
    rejectMutation.mutate({
      travelId: approval.travelId,
      itemId: approval.travelItemId,
      travelerId: approval.travelerId,
      reason: "Rejeitado pelo aprovador",
    })
  }

  const items = approvals ?? []
  const awaitingCount = items.filter(
    (a) => a.viewContext === "awaiting_my_approval"
  ).length

  const emptyMessage = !companyId
    ? "Selecione uma empresa para ver aprovações pendentes"
    : "Nenhuma aprovação pendente"

  return (
    <ListWithButton
      title="Aprovações Pendentes"
      items={items}
      getItemKey={(a) => `${a.travelItemId}-${a.travelerId}`}
      headerIcon={Clock}
      headerExtra={
        <div className="flex items-center gap-2">
          <label htmlFor="mock-scenario" className="text-xs text-muted-foreground whitespace-nowrap">
            Mock:
          </label>
          <select
            id="mock-scenario"
            value={scenarioId ?? ""}
            onChange={handleScenarioChange}
            className="text-xs border rounded px-2 py-1 bg-background"
          >
            <option value="">API real</option>
            {MOCK_SCENARIO_IDS.map((id) => (
              <option key={id} value={id}>
                {MOCK_SCENARIO_LABELS[id]}
              </option>
            ))}
          </select>
        </div>
      }
      renderItem={(approval) =>
        approval.viewContext === "awaiting_my_approval" ? (
          <AwaitingMyApprovalRow
            key={`${approval.travelItemId}-${approval.travelerId}`}
            approval={approval}
            onApprove={() => handleApprove(approval)}
            onReject={() => handleReject(approval)}
            isApproving={approveMutation.isPending}
            isRejecting={rejectMutation.isPending}
          />
        ) : (
          <MyPendingAsTravelerRow
            key={`${approval.travelItemId}-${approval.travelerId}`}
            approval={approval}
          />
        )
      }
      buttonText="Ver todas as aprovações →"
      onButtonClick={handleButtonClick}
      headerBadge={awaitingCount > 0 ? awaitingCount : undefined}
      emptyMessage={emptyMessage}
    />
  )
}
