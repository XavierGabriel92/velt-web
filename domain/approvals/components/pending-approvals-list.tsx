"use client"

import { ListWithButton } from "@/components/shared/list-with-button"
import { usePendingApprovals } from "../api/use-pending-approvals"
import { Check, X, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PendingApprovalsList() {
  const { data: approvals } = usePendingApprovals()

  const handleButtonClick = () => {
    // Placeholder - não faz nada por enquanto
  }

  const handleApprove = (id: string) => {
    // Placeholder - não faz nada por enquanto
    console.log("Approve", id)
  }

  const handleReject = (id: string) => {
    // Placeholder - não faz nada por enquanto
    console.log("Reject", id)
  }

  if (!approvals || approvals.length === 0) {
    return (
      <ListWithButton
        title="Aprovações Pendentes"
        items={[]}
        renderItem={() => null}
        buttonText="Ver todas as aprovações →"
        onButtonClick={handleButtonClick}
        headerBadge={0}
        emptyMessage="Nenhuma aprovação pendente"
      />
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <ListWithButton
      title="Aprovações Pendentes"
      items={approvals}
      headerIcon={Clock}
      renderItem={(approval) => (
        <div className="flex items-center justify-between py-2 border-b last:border-b-0">
          <div className="flex-1">
            <p className="font-medium">{approval.traveler}</p>
            <p className="text-sm text-muted-foreground">
              {approval.category} • {approval.date}
            </p>
            <p className="text-sm font-semibold mt-1">
              {formatCurrency(approval.amount)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => handleApprove(approval.id)}
            >
              <Check className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleReject(approval.id)}
            >
              <X className="size-5" />
            </Button>
          </div>
        </div>
      )}
      buttonText="Ver todas as aprovações →"
      onButtonClick={handleButtonClick}
      headerBadge={approvals.length}
    />
  )
}

