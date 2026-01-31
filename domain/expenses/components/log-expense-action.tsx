"use client"

import { QuickActionButton } from "@/components/shared/quick-action-button"
import { FileText } from "lucide-react"

export function LogExpenseAction() {
  const handleClick = () => {
    // Placeholder - não faz nada por enquanto
  }

  return (
    <QuickActionButton
      title="Lançar Despesas"
      icon={FileText}
      onClick={handleClick}
    />
  )
}

