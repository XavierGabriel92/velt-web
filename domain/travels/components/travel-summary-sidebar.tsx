"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { FlightOption } from "../api/types"

function formatPrice(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value)
}

interface TravelSummarySidebarProps {
  selectedOutbound: FlightOption | null
  selectedReturn?: FlightOption | null
  adults?: number
  totalPrice?: number
  embarkationTax?: number
  onConfirm?: () => void
  confirmDisabled?: boolean
  confirmLabel?: string
  tripType?: "RoundTrip" | "OneWay"
  className?: string
}

export function TravelSummarySidebar({
  selectedOutbound,
  selectedReturn = null,
  adults = 1,
  totalPrice,
  embarkationTax,
  onConfirm,
  confirmDisabled = false,
  confirmLabel = "Finalizar reserva",
  tripType = "RoundTrip",
  className,
}: TravelSummarySidebarProps) {
  const outboundPrice = selectedOutbound?.finalPrice ?? selectedOutbound?.priceInCash ?? 0
  const returnPrice = selectedReturn?.finalPrice ?? selectedReturn?.priceInCash ?? 0
  const subtotal =
    totalPrice ??
    (selectedOutbound && selectedReturn
      ? outboundPrice + returnPrice
      : selectedOutbound
        ? outboundPrice
        : 0)
  const tax = embarkationTax ?? (selectedOutbound?.embarkationTax ?? 0) + (selectedReturn?.embarkationTax ?? 0)
  const total = subtotal + tax

  return (
    <Card
      className={cn(
        "bg-white shadow-sm rounded-2xl border border-[#E5E7EB]",
        className
      )}
    >
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold text-[#1E293B]">
          Resumo da viagem
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-start gap-2">
            <span className="text-[#64748B]">Voo de ida</span>
            <span className="text-right font-medium text-[#1E293B]">
              {selectedOutbound ? (
                <>
                  {selectedOutbound.origin} → {selectedOutbound.destination},{" "}
                  {selectedOutbound.airline},{" "}
                  {formatPrice(outboundPrice)}
                </>
              ) : (
                "—"
              )}
            </span>
          </div>
          {tripType === "RoundTrip" && (
            <div className="flex justify-between items-start gap-2">
              <span className="text-[#64748B]">Voo de volta</span>
              <span className="text-right font-medium text-[#1E293B]">
                {selectedReturn ? (
                  <>
                    {selectedReturn.origin} → {selectedReturn.destination},{" "}
                    {selectedReturn.airline},{" "}
                    {formatPrice(returnPrice)}
                  </>
                ) : (
                  "Selecione"
                )}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center gap-2">
            <span className="text-[#64748B]">
              Jx. x{adults} Adulto(s)
            </span>
            <span className="font-medium text-[#1E293B]">
              {formatPrice(subtotal)}
            </span>
          </div>
          <div className="flex justify-between items-center gap-2">
            <span className="text-[#64748B]">Taxa de embarque</span>
            <span className="font-medium text-[#1E293B]">
              {formatPrice(tax)}
            </span>
          </div>
        </div>
        <div className="pt-3 border-t border-[#E5E7EB] flex justify-between items-center">
          <span className="font-semibold text-[#1E293B]">Total</span>
          <span className="text-xl font-bold text-[#1E293B]">
            {formatPrice(total)}
          </span>
        </div>
        {onConfirm && (
          <Button
            type="button"
            onClick={onConfirm}
            disabled={confirmDisabled}
            className="w-full rounded-2xl bg-[#FF3C00] hover:bg-[#E63500] text-white font-medium h-10"
          >
            {confirmLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
