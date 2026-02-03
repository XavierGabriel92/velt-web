"use client"

import { useTravelReports } from "../api/use-travel-reports"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface TravelReportSelectorProps {
  companyId: string
  value: string
  onChange: (reportId: string) => void
  onCreateNew: () => void
  refreshKey?: number
  required?: boolean
}

export function TravelReportSelector({
  companyId,
  value,
  onChange,
  onCreateNew,
  refreshKey = 0,
  required = true,
}: TravelReportSelectorProps) {
  const { data: reports = [], isLoading, isError } = useTravelReports(
    companyId,
    refreshKey
  )

  return (
    <div className="space-y-2">
      <Label>
        Relatório de Viagem
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <div className="flex gap-2">
        <Select
          value={value || ""}
          onValueChange={onChange}
          disabled={isLoading}
        >
          <SelectTrigger className="flex-1 w-full">
            <SelectValue placeholder="Selecione um relatório..." />
          </SelectTrigger>
          <SelectContent>
            {reports.map((report) => (
              <SelectItem key={report.id} value={report.id}>
                {report.title} ({new Date(report.endDate).toLocaleDateString("pt-BR")})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" onClick={onCreateNew}>
          Criar Novo
        </Button>
      </div>
      {isLoading && (
        <p className="text-sm text-muted-foreground">Carregando relatórios...</p>
      )}
      {isError && (
        <p className="text-sm text-destructive">Erro ao carregar relatórios.</p>
      )}
      {!isLoading && !isError && reports.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhum relatório disponível. Crie um novo relatório.
        </p>
      )}
    </div>
  )
}
