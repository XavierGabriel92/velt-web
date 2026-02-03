"use client"

import { useRouter } from "next/navigation"
import { QuickActionButton } from "@/components/shared/quick-action-button"
import { FileText } from "lucide-react"

export function LogExpenseAction() {
  const router = useRouter()

  const handleClick = () => {
    router.push("/inicio/despesas")
  }

  return (
    <QuickActionButton
      title="Lançar Despesas"
      icon={FileText}
      onClick={handleClick}
    />
  )
}

