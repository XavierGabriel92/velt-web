"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Plane, Shield, CreditCard } from "lucide-react"
import type { FlightOption, BaggageAllowance } from "../api/types"
import { EXTRA_BAGgage_UNIT_PRICE_BRL } from "../constants"

export const FINISH_BOOKING_FORM_ID = "finish-booking-form"

function formatPrice(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value)
}

function formatFlightDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function BaggageLine({ bag, label }: { bag: BaggageAllowance; label: string }) {
  const parts: string[] = []
  if (bag.carryOnCount > 0) {
    parts.push(
      `${bag.carryOnCount} mão (até ${bag.carryOnWeight} kg)`
    )
  }
  if (bag.checkedBaggageCount != null && bag.checkedBaggageCount > 0) {
    const w =
      bag.checkedBaggageWeight != null
        ? ` até ${bag.checkedBaggageWeight} kg`
        : ""
    parts.push(`${bag.checkedBaggageCount} despachada${w}`)
  }
  if (parts.length === 0) return null
  return (
    <p className="text-[#64748B] text-xs mt-1">
      {label}: {parts.join(" • ")}
    </p>
  )
}

function farePassengerLabel(adults: number, children: number, infants: number): string {
  const parts: string[] = []
  if (adults > 0) {
    parts.push(`${adults} ${adults === 1 ? "adulto" : "adultos"}`)
  }
  if (children > 0) {
    parts.push(`${children} ${children === 1 ? "criança" : "crianças"}`)
  }
  if (infants > 0) {
    parts.push(`${infants} ${infants === 1 ? "bebê" : "bebês"}`)
  }
  return parts.length > 0 ? parts.join(", ") : "1 adulto"
}

interface FinishBookingSummaryProps {
  selectedOutbound: FlightOption
  selectedReturn: FlightOption | null
  adults?: number
  children?: number
  infants?: number
  /** Total de bagagens extra (soma por passageiro) */
  extraBaggageCount?: number
  /** Preço unitário (R$) da bagagem extra; default 170 */
  extraBaggageUnitPrice?: number
  formId?: string
  isSubmitting?: boolean
  confirmDisabled?: boolean
  /** B2C ou pré-pago: exibe seção de forma de pagamento */
  isPrePaid?: boolean
  className?: string
}

export function FinishBookingSummary({
  selectedOutbound,
  selectedReturn,
  adults = 1,
  children = 0,
  infants = 0,
  extraBaggageCount = 0,
  extraBaggageUnitPrice = EXTRA_BAGgage_UNIT_PRICE_BRL,
  formId = FINISH_BOOKING_FORM_ID,
  isSubmitting = false,
  confirmDisabled = false,
  isPrePaid = false,
  className,
}: FinishBookingSummaryProps) {
  const fareLabel = farePassengerLabel(adults, children, infants)
  const outboundPrice =
    selectedOutbound?.finalPrice ?? selectedOutbound?.priceInCash ?? 0
  const returnPrice =
    selectedReturn?.finalPrice ?? selectedReturn?.priceInCash ?? 0
  const subtotal =
    selectedReturn != null ? outboundPrice + returnPrice : outboundPrice
  const tax =
    (selectedOutbound?.embarkationTax ?? 0) +
    (selectedReturn?.embarkationTax ?? 0)
  const extraBaggageTotal =
    (extraBaggageCount ?? 0) * (extraBaggageUnitPrice ?? EXTRA_BAGgage_UNIT_PRICE_BRL)
  const total = subtotal + tax + extraBaggageTotal

  return (
    <Card
      className={`bg-white shadow-sm rounded-2xl border border-[#E5E7EB] ${className ?? ""}`}
    >
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold text-[#1E293B]">
          Resumo da Viagem
        </h3>
        <p className="text-sm text-[#64748B]">
          Confirme os detalhes da sua reserva
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* IDA */}
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-[#1E293B] mb-2">
            <Plane className="size-4" />
            IDA
          </div>
          <div className="rounded-lg bg-[#F1F5F9] p-3 text-sm">
            <div className="flex justify-between items-baseline gap-2">
              <span className="font-semibold text-[#1E293B]">
                {selectedOutbound.origin}
              </span>
              <span className="text-[#64748B]">
                {selectedOutbound.flightNumber ?? ""}
              </span>
              <span className="font-semibold text-[#1E293B]">
                {selectedOutbound.destination}
              </span>
            </div>
            <p className="text-[#64748B] mt-1">
              {formatFlightDateTime(selectedOutbound.departureDate)} •{" "}
              {selectedOutbound.airline}
            </p>
            {selectedOutbound.baggageAllowance && (
              <BaggageLine
                bag={selectedOutbound.baggageAllowance}
                label="Bagagem"
              />
            )}
          </div>
        </div>

        {/* VOLTA */}
        {selectedReturn && (
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-[#1E293B] mb-2">
              <Plane className="size-4" />
              VOLTA
            </div>
            <div className="rounded-lg bg-[#F1F5F9] p-3 text-sm">
              <div className="flex justify-between items-baseline gap-2">
                <span className="font-semibold text-[#1E293B]">
                  {selectedReturn.origin}
                </span>
                <span className="text-[#64748B]">
                  {selectedReturn.flightNumber ?? ""}
                </span>
                <span className="font-semibold text-[#1E293B]">
                  {selectedReturn.destination}
                </span>
              </div>
              <p className="text-[#64748B] mt-1">
                {formatFlightDateTime(selectedReturn.departureDate)} •{" "}
                {selectedReturn.airline}
              </p>
              {selectedReturn.baggageAllowance && (
                <BaggageLine
                  bag={selectedReturn.baggageAllowance}
                  label="Bagagem"
                />
              )}
            </div>
          </div>
        )}

        {/* Detalhamento de Preços */}
        <div>
          <h4 className="text-sm font-semibold text-[#1E293B] mb-2">
            Detalhamento de Preços
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#64748B]">
                Tarifa básica ({fareLabel})
              </span>
              <span className="text-[#1E293B]">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Taxas e impostos (voo)</span>
              <span className="text-[#1E293B]">{formatPrice(tax)}</span>
            </div>
            {extraBaggageCount > 0 && (
              <div className="flex justify-between">
                <span className="text-[#64748B]">
                  Bagagem extra ({extraBaggageCount} un.)
                </span>
                <span className="text-[#1E293B]">
                  {formatPrice(extraBaggageTotal)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-[#E5E7EB] flex justify-between items-center">
          <span className="font-semibold text-[#1E293B]">Total</span>
          <span className="text-xl font-bold text-[#FF3C00]">
            {formatPrice(total)}
          </span>
        </div>

        {isPrePaid && (
          <div className="rounded-lg border border-[#E5E7EB] bg-[#FCFCFA] p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-[#1E293B] mb-1">
              <CreditCard className="size-4" />
              Forma de pagamento
            </div>
            <p className="text-xs text-[#64748B]">
              PIX, cartão ou boleto na próxima etapa após confirmar.
            </p>
          </div>
        )}

        <button
          type="submit"
          form={formId}
          disabled={isSubmitting || confirmDisabled}
          className="w-full rounded-2xl bg-[#FF3C00] hover:bg-[#E63500] text-white font-medium h-10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Finalizando..." : "Finalizar Reserva"}
        </button>

        <div className="flex items-center gap-2 text-sm text-[#64748B]">
          <Shield className="size-4 shrink-0" />
          <span>Pagamento 100% seguro e protegido</span>
        </div>
      </CardContent>
    </Card>
  )
}
