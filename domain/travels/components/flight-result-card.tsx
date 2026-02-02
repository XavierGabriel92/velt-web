"use client"

import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { FlightOption } from "../api/types"

/** Parse ISO duration or "HH:mm:ss" to "Xh Ym" */
function formatDuration(duration: string): string {
  if (!duration) return "—"
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/i) // ISO 8601
  if (match) {
    const h = parseInt(match[1] ?? "0", 10)
    const m = parseInt(match[2] ?? "0", 10)
    const parts = []
    if (h > 0) parts.push(`${h}h`)
    if (m > 0) parts.push(`${m}m`)
    return parts.join(" ") || "—"
  }
  const parts = duration.split(":").map((s) => parseInt(s, 10) || 0)
  if (parts.length >= 2) {
    const [hours, minutes] = parts
    const p = []
    if (hours > 0) p.push(`${hours}h`)
    if (minutes > 0) p.push(`${minutes}m`)
    return p.join(" ") || "—"
  }
  return duration
}

function formatTime(isoDate: string): string {
  if (!isoDate) return "—"
  try {
    const d = new Date(isoDate)
    return d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  } catch {
    return "—"
  }
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value)
}

interface FlightResultCardProps {
  flight: FlightOption
  onSelect: (flight: FlightOption) => void
  selected?: boolean
  minimumPrice?: number
  className?: string
}

export function FlightResultCard({
  flight,
  onSelect,
  selected = false,
  minimumPrice,
  className,
}: FlightResultCardProps) {
  const priceDisplay = flight.finalPrice ?? flight.priceInCash
  const hasDiscount =
    minimumPrice != null &&
    flight.priceInCash > minimumPrice &&
    minimumPrice > 0
  const discountPercent =
    hasDiscount && flight.priceInCash > 0
      ? Math.round((1 - minimumPrice / flight.priceInCash) * 100)
      : 0

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 rounded-2xl border border-[#E5E7EB] bg-white text-[#1E293B] transition-colors",
        "hover:border-[#99A1AF] hover:bg-[#FCFCFA]",
        selected && "ring-2 ring-[#155DFC] border-[#155DFC]",
        className
      )}
    >
      {/* Departure */}
      <div className="flex flex-col min-w-[4rem]">
        <span className="text-lg font-semibold text-[#1E293B]">
          {formatTime(flight.departureDate)}
        </span>
        <span className="text-sm text-[#64748B]">{flight.origin}</span>
      </div>

      {/* Path + airline + duration */}
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <div className="flex-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full border-2 border-[#155DFC] shrink-0" />
          <div className="flex-1 h-px bg-[#155DFC]/30 min-w-[2rem]" />
          <span className="text-xs text-[#64748B] shrink-0">
            {flight.stops === 0 ? "Direto" : `${flight.stops} escala(s)`} +{" "}
            {formatDuration(flight.duration)}
          </span>
          <div className="flex-1 h-px bg-[#155DFC]/30 min-w-[2rem]" />
          <span className="w-2 h-2 rounded-full bg-[#155DFC] shrink-0" />
        </div>
        <div className="shrink-0 text-center min-w-[5rem]">
          <span className="text-sm font-medium text-[#1E293B]">
            {flight.airline}
          </span>
          {flight.flightNumber && (
            <span className="block text-xs text-[#64748B]">
              {flight.flightNumber}
            </span>
          )}
        </div>
      </div>

      {/* Arrival */}
      <div className="flex flex-col min-w-[4rem] text-right">
        <span className="text-lg font-semibold text-[#1E293B]">
          {flight.arrivalDate
            ? formatTime(flight.arrivalDate)
            : "—"}
        </span>
        <span className="text-sm text-[#64748B]">{flight.destination}</span>
      </div>

      {/* Price + select */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex flex-col items-end">
          {hasDiscount && discountPercent > 0 && (
            <span className="text-sm text-[#64748B] line-through">
              {formatPrice(flight.priceInCash)}
            </span>
          )}
          <span className="text-lg font-bold text-[#1E293B]">
            {formatPrice(priceDisplay)}
          </span>
          {hasDiscount && discountPercent > 0 && (
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-700 text-xs font-semibold mt-1">
              -{discountPercent}%
            </span>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onSelect(flight)}
          className="shrink-0 rounded-full border-[#E5E7EB] hover:bg-[#FF3C00] hover:text-white hover:border-[#FF3C00]"
          aria-label="Selecionar voo"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
