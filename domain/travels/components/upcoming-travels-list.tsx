"use client"

import { ListWithButton } from "@/components/shared/list-with-button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTravelReportsUpcoming } from "../api/use-travel-reports"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import type { TravelReportResponse } from "../api/types"

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function getStatus(report: TravelReportResponse): "Em andamento" | "Futura" {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(report.startDate)
  start.setHours(0, 0, 0, 0)
  return start <= today ? "Em andamento" : "Futura"
}

export function UpcomingTravelsList() {
  const { selectedCompany } = useAuth()
  const { data: reports } = useTravelReportsUpcoming()

  const handleButtonClick = () => {
    // Placeholder - não faz nada por enquanto
  }

  const emptyMessage = !selectedCompany?.companyId
    ? "Selecione uma empresa para ver as próximas viagens"
    : "Nenhuma viagem agendada"

  if (!reports || reports.length === 0) {
    return (
      <ListWithButton
        title="Próximas Viagens"
        items={[]}
        renderItem={() => null}
        buttonText="Ver todas as viagens →"
        onButtonClick={handleButtonClick}
        emptyMessage={emptyMessage}
      />
    )
  }

  return (
    <ListWithButton
      title="Próximas Viagens"
      items={reports}
      renderItem={(report) => {
        const status = getStatus(report)
        const firstName =
          report.firstTravelerName || report.createdByUserName || "—"
        const otherCount = report.otherTravelersCount ?? 0
        const hasOthers = otherCount > 0
        const travelerNames = report.travelerNames ?? []

        return (
          <div
            key={report.id}
            className="flex items-center justify-between gap-2 py-2 border-b last:border-b-0"
          >
            <div className="flex-1 min-w-0">
              {hasOthers ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="font-medium truncate cursor-default">
                      {firstName}
                      <span className="text-muted-foreground font-normal">
                        {" "}
                        +{otherCount}
                      </span>
                    </p>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <ul className="list-disc list-inside space-y-0.5">
                      {travelerNames.map((name) => (
                        <li key={name}>{name}</li>
                      ))}
                    </ul>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <p className="font-medium truncate">{firstName}</p>
              )}
              <p className="text-sm text-muted-foreground">
                {formatDate(report.startDate)} - {formatDate(report.endDate)}
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 px-3 py-1 rounded-full text-xs font-medium",
                status === "Em andamento"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
              )}
            >
              {status}
            </span>
          </div>
        )
      }}
      buttonText="Ver todas as viagens →"
      onButtonClick={handleButtonClick}
    />
  )
}
