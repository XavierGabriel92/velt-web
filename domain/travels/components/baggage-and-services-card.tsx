"use client"

import { useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Luggage, Minus, Package, Plus } from "lucide-react"
import type { BaggageAllowance, FlightOption } from "../api/types"
import { slotLabel } from "./passenger-slots-card"

function BaggageIcons({
  bag,
  className,
}: {
  bag: BaggageAllowance
  className?: string
}) {
  const parts: { icon: typeof Package; text: string }[] = []
  if (bag.carryOnCount > 0) {
    parts.push({
      icon: Package,
      text: `${bag.carryOnCount} mão (até ${bag.carryOnWeight} kg)`,
    })
  }
  if (bag.checkedBaggageCount != null && bag.checkedBaggageCount > 0) {
    const w =
      bag.checkedBaggageWeight != null
        ? ` até ${bag.checkedBaggageWeight} kg`
        : ""
    parts.push({
      icon: Briefcase,
      text: `${bag.checkedBaggageCount} despachada${w}`,
    })
  }
  if (parts.length === 0) return null
  return (
    <div
      className={`flex flex-wrap items-center gap-2 text-xs text-[#64748B] ${className ?? ""}`}
    >
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1">
          <p.icon className="size-3.5" />
          {p.text}
        </span>
      ))}
    </div>
  )
}

function slotLabelDisplay(
  index: number,
  adults: number,
  children: number,
  infants: number
): string {
  const { type, number } = slotLabel(index, adults, children, infants)
  const cap = type.charAt(0).toUpperCase() + type.slice(1)
  return `${cap} ${number}`
}

const MAX_EXTRA_BAGgage_PER_PASSENGER = 5

interface BaggageAndServicesCardProps {
  passengerCount: number
  adults: number
  children: number
  infants: number
  selectedOutbound: FlightOption
  selectedReturn: FlightOption | null
  extraBaggageCountsPerSlot: number[]
  onExtraBaggageChange: (counts: number[]) => void
  className?: string
}

export function BaggageAndServicesCard({
  passengerCount,
  adults,
  children,
  infants,
  selectedOutbound,
  selectedReturn,
  extraBaggageCountsPerSlot,
  onExtraBaggageChange,
  className,
}: BaggageAndServicesCardProps) {
  const bagOutbound = selectedOutbound?.baggageAllowance
  const bagReturn = selectedReturn?.baggageAllowance
  const hasIncludedBaggage = !!(bagOutbound || bagReturn)

  const setCount = useCallback(
    (index: number, count: number) => {
      const clamped = Math.min(
        MAX_EXTRA_BAGgage_PER_PASSENGER,
        Math.max(0, count)
      )
      const next = [...extraBaggageCountsPerSlot]
      while (next.length <= index) next.push(0)
      next[index] = clamped
      onExtraBaggageChange(next)
    },
    [extraBaggageCountsPerSlot, onExtraBaggageChange]
  )

  return (
    <Card
      className={`rounded-2xl border border-[#E5E7EB] bg-white shadow-sm ${className ?? ""}`}
    >
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold text-[#1E293B] mb-1">
          Bagagens e Serviços
        </h3>
        <p className="text-sm text-[#64748B] mb-4">
          Personalize sua viagem com serviços adicionais
        </p>
        <div className="space-y-4">
          {Array.from({ length: passengerCount }, (_, index) => {
            const current =
              extraBaggageCountsPerSlot[index] ??
              0
            const label = slotLabelDisplay(index, adults, children, infants)
            return (
              <div
                key={index}
                data-testid={`baggage-slot-${index + 1}`}
                className="rounded-xl border border-[#E5E7EB] bg-[#FCFCFA] p-4 space-y-3"
              >
                <div className="font-medium text-[#1E293B] flex items-center gap-2">
                  <Luggage className="size-4 text-[#FF3C00]" />
                  {label}
                </div>
                {hasIncludedBaggage && (
                  <div>
                    <p className="text-xs font-medium text-[#64748B] mb-1">
                      Bagagens incluídas no voo
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {bagOutbound && (
                        <div>
                          <span className="text-xs text-[#64748B]">
                            Ida:{" "}
                          </span>
                          <BaggageIcons bag={bagOutbound} />
                        </div>
                      )}
                      {bagReturn && (
                        <div>
                          <span className="text-xs text-[#64748B]">
                            Volta:{" "}
                          </span>
                          <BaggageIcons bag={bagReturn} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-[#64748B] mb-2">
                    Serviços adicionais / Bagagem extra
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-8 rounded-lg border-[#E5E7EB]"
                      disabled={current <= 0}
                      onClick={() => setCount(index, current - 1)}
                      aria-label="Remover bagagem"
                    >
                      <Minus className="size-4" />
                    </Button>
                    <span className="min-w-[6rem] text-sm text-[#1E293B] text-center">
                      {current} bagagem{current !== 1 ? "ns" : ""} extra
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-8 rounded-lg border-[#E5E7EB]"
                      disabled={current >= MAX_EXTRA_BAGgage_PER_PASSENGER}
                      onClick={() => setCount(index, current + 1)}
                      aria-label="Adicionar bagagem"
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
