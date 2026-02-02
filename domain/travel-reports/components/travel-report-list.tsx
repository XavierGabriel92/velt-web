"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useTravelReportsList } from "../api/use-travel-reports"
import { MapPin, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function TravelReportList() {
  const { selectedCompany } = useAuth()
  const companyId = selectedCompany?.companyId ?? null
  const { data: reports, isLoading } = useTravelReportsList({
    companyId: companyId ?? undefined,
    pageSize: 50,
  })

  if (!companyId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center py-6">
            Selecione uma empresa para ver suas viagens.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Minhas Viagens</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Carregando...
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!reports?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Minhas Viagens</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhuma viagem encontrada. Reserve um voo para começar.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Minhas Viagens</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {reports.map((report) => (
            <li key={report.id}>
              <Link
                href={`/inicio/viagens/relatorio/${report.id}`}
                className={cn(
                  "flex items-center justify-between gap-2 p-3 rounded-lg border",
                  "hover:bg-muted/50 transition-colors"
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{report.title}</p>
                  <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5 shrink-0" />
                      {formatDate(report.startDate)} - {formatDate(report.endDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5 shrink-0" />
                      {report.companyName}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {report.travelsCount ?? report.travelIds?.length ?? 0} solicitações
                    {(report.expensesCount ?? report.expenseIds?.length ?? 0) > 0 &&
                      ` · ${report.expensesCount ?? report.expenseIds?.length} despesas`}
                  </p>
                </div>
                <span className="shrink-0 text-muted-foreground">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
