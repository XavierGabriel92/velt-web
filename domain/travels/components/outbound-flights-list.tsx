"use client"

import { FlightResultCard } from "./flight-result-card"
import { Loading } from "@/components/ui/loading"
import { cn } from "@/lib/utils"
import type { FlightOption } from "../api/types"

interface OutboundFlightsListProps {
  flights: FlightOption[]
  loading?: boolean
  minimumPrice?: number
  selectedFlightId?: string | null
  onSelectFlight: (flight: FlightOption) => void
  moreOptionsCount?: number
  onLoadMore?: () => void
  title?: string
  className?: string
}

export function OutboundFlightsList({
  flights,
  loading = false,
  minimumPrice,
  selectedFlightId,
  onSelectFlight,
  moreOptionsCount,
  onLoadMore,
  title = "IDA",
  className,
}: OutboundFlightsListProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-lg font-semibold text-[#1E293B]">{title}</h2>
      {loading ? (
        <div className="py-12">
          <Loading text="Carregando voos..." />
        </div>
      ) : flights.length === 0 ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center text-[#64748B]">
          Nenhum voo encontrado para os critérios informados.
        </div>
      ) : (
        <>
          <ul className="space-y-3" role="list">
            {/* key usa id + index: a API pode devolver mais de um voo com o mesmo id (ex. hash-solo),
                o que geraria "Encountered two children with the same key" no React. */}
            {flights.map((flight, index) => (
              <li key={`${flight.id}-${index}`}>
                <FlightResultCard
                  flight={flight}
                  onSelect={onSelectFlight}
                  selected={selectedFlightId === flight.id}
                  minimumPrice={minimumPrice}
                />
              </li>
            ))}
          </ul>
          {moreOptionsCount != null && moreOptionsCount > 0 && onLoadMore && (
            <div className="pt-4 flex justify-center">
              <button
                type="button"
                onClick={onLoadMore}
                className="rounded-full bg-[#FF3C00] text-white px-6 py-2.5 text-sm font-medium hover:bg-[#E63500] transition-colors"
              >
                Mais opções {moreOptionsCount}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
