"use client"

import { useRouter } from "next/navigation"
import { QuickActionButton } from "@/components/shared/quick-action-button"
import { Plane } from "lucide-react"

export function SearchTravelsAction() {
  const router = useRouter()

  const handleClick = () => {
    router.push("/inicio/viagens")
  }

  return (
    <QuickActionButton
      title="Buscar Viagens"
      icon={Plane}
      onClick={handleClick}
    />
  )
}

