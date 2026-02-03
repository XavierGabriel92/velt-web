"use client"

import { useCostCenters } from "../api/use-cost-centers"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface CostCenterSelectorProps {
  companyId: string | null
  value: string
  onChange: (costCenterId: string) => void
  required?: boolean
}

export function CostCenterSelector({
  companyId,
  value,
  onChange,
  required = true,
}: CostCenterSelectorProps) {
  const { data: costCenters = [], isLoading, isError } = useCostCenters(companyId)

  return (
    <div className="space-y-2">
      <Label>
        Centro de Custo
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <Select
        value={value || ""}
        onValueChange={onChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione um centro de custo..." />
        </SelectTrigger>
        <SelectContent>
          {costCenters.map((cc) => (
            <SelectItem key={cc.id} value={cc.id}>
              {cc.code} - {cc.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isLoading && (
        <p className="text-sm text-muted-foreground">
          Carregando centros de custo...
        </p>
      )}
      {isError && (
        <p className="text-sm text-destructive">Erro ao carregar centros de custo.</p>
      )}
    </div>
  )
}
