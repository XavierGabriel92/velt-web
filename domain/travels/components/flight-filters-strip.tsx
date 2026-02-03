"use client"

import { cn } from "@/lib/utils"

const FILTER_LABELS = [
  "Todos os filtros",
  "Escalas",
  "Companhias aéreas",
  "Bagagem",
  "Preço",
  "Horários",
  "Embarque",
  "Aeroporto de conexão",
] as const

export type FilterId = (typeof FILTER_LABELS)[number]

interface FlightFiltersStripProps {
  activeFilterId?: FilterId | null
  onFilterChange?: (id: FilterId | null) => void
  className?: string
}

export function FlightFiltersStrip({
  activeFilterId = null,
  onFilterChange,
  className,
}: FlightFiltersStripProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 py-3",
        className
      )}
      role="group"
      aria-label="Filtros de voos"
    >
      {FILTER_LABELS.map((label) => {
        const isActive = activeFilterId === label
        return (
          <button
            key={label}
            type="button"
            onClick={() => onFilterChange?.(isActive ? null : label)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              "border border-[#E2E8F0] bg-white text-[#1E293B]",
              "hover:bg-[#F7F4F5] hover:border-[#E5E7EB]",
              isActive && "bg-[#1E293B] text-white border-[#1E293B] hover:bg-[#334155] hover:border-[#334155]"
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
