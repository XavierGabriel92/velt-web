"use client"

import { ListWithButton } from "@/components/shared/list-with-button"
import { useUpcomingTravels } from "../api/use-upcoming-travels"
import { cn } from "@/lib/utils"

export function UpcomingTravelsList() {
  const { data: travels } = useUpcomingTravels()

  const handleButtonClick = () => {
    // Placeholder - não faz nada por enquanto
  }

  if (!travels || travels.length === 0) {
    return (
      <ListWithButton
        title="Próximas Viagens"
        items={[]}
        renderItem={() => null}
        buttonText="Ver todas as viagens →"
        onButtonClick={handleButtonClick}
        emptyMessage="Nenhuma viagem agendada"
      />
    )
  }

  return (
    <ListWithButton
      title="Próximas Viagens"
      items={travels}
      renderItem={(travel) => (
        <div className="flex items-center justify-between py-2 border-b last:border-b-0">
          <div className="flex-1">
            <p className="font-medium">{travel.traveler}</p>
            <p className="text-sm text-muted-foreground">
              {travel.destination} • {travel.date}
            </p>
          </div>
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              travel.status === "Aprovado"
                ? "bg-green-100 text-green-800"
                : travel.status === "Pendente"
                ? "bg-orange-100 text-orange-800"
                : "bg-red-100 text-red-800"
            )}
          >
            {travel.status}
          </span>
        </div>
      )}
      buttonText="Ver todas as viagens →"
      onButtonClick={handleButtonClick}
    />
  )
}

