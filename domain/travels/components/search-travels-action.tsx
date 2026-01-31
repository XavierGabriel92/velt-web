"use client"

import { QuickActionButton } from "@/components/shared/quick-action-button"
import { Plane } from "lucide-react"

export function SearchTravelsAction() {
  const handleClick = () => {
    // Placeholder - não faz nada por enquanto
  }

  return (
    <QuickActionButton
      title="Buscar Viagens"
      icon={Plane}
      onClick={handleClick}
    />
  )
}

