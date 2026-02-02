"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { FINISH_BOOKING_FORM_ID } from "./finish-booking-summary"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TravelReportSelector } from "@/domain/travel-reports/components/travel-report-selector"
import { TravelReportFormModal } from "@/domain/travel-reports/components/travel-report-form-modal"
import { useCreateTravelReport } from "@/domain/travel-reports/api/use-create-travel-report"
import type { CreateTravelReportRequest } from "@/domain/travel-reports/api/types"
import { CostCenterSelector } from "@/domain/cost-centers/components/cost-center-selector"
import { PassengerSlotsCard } from "./passenger-slots-card"
import { BaggageAndServicesCard } from "./baggage-and-services-card"
import { Textarea } from "@/components/ui/textarea"
import type { FlightOption } from "../api/types"
import { toast } from "sonner"

export interface FinishBookingFormData {
  costCenterId?: string
  travelReportId?: string
  title?: string
  observations?: string
  /** IDs dos passageiros (ordem dos slots); obrigatório para confirm-flight */
  travelerIds?: string[]
}

interface FinishBookingFormProps {
  selectedOutbound: FlightOption
  selectedReturn: FlightOption | null
  companyId: string | null
  companyName?: string
  /** Total de passageiros (adultos + crianças + bebês) da busca */
  passengerCount: number
  adults?: number
  children?: number
  infants?: number
  /** Contagem de bagagem extra por slot (0..5 cada); estado na Page */
  extraBaggageCountsPerSlot?: number[]
  onExtraBaggageChange?: (counts: number[]) => void
  /** IDs dos passageiros da busca (pré-preenchimento); pode estar vazio para seleção na tela */
  initialTravelerIds?: string[]
  onSubmit: (data: FinishBookingFormData) => void | Promise<void>
  isSubmitting?: boolean
  error?: string | null
  /** Violações de política (B2B); exibido como aviso, permite prosseguir */
  policyViolations?: string[]
  onValidityChange?: (canSubmit: boolean) => void
}

const B2C_COMPANY_NAME = "B2C Consumer"

export function FinishBookingForm({
  selectedOutbound,
  selectedReturn,
  companyId,
  companyName,
  passengerCount = 1,
  adults = 1,
  children = 0,
  infants = 0,
  extraBaggageCountsPerSlot = [],
  onExtraBaggageChange,
  initialTravelerIds = [],
  onSubmit,
  isSubmitting = false,
  error: externalError,
  policyViolations,
  onValidityChange,
}: FinishBookingFormProps) {
  const isB2C = companyName === B2C_COMPANY_NAME

  const [costCenterId, setCostCenterId] = useState("")
  const [travelReportId, setTravelReportId] = useState("")
  const [title, setTitle] = useState("")
  const [observations, setObservations] = useState("")
  const [passengerTravelerIds, setPassengerTravelerIds] = useState<string[]>([])
  const [showCreateReportModal, setShowCreateReportModal] = useState(false)
  const [reportRefreshKey, setReportRefreshKey] = useState(0)

  const createReportMutation = useCreateTravelReport()

  // Auto-suggest title based on flight
  useEffect(() => {
    if (!title) {
      const isRoundTrip = !!selectedReturn || !!selectedOutbound.combinationTotalPrice
      const dateStr = new Date(selectedOutbound.departureDate).toLocaleDateString(
        "pt-BR"
      )
      const suggested = isRoundTrip
        ? `${selectedOutbound.origin} → ${selectedOutbound.destination} - ${dateStr} (Ida e Volta)`
        : `${selectedOutbound.origin} → ${selectedOutbound.destination} - ${dateStr}`
      setTitle(suggested)
    }
  }, [selectedOutbound, selectedReturn, title])

  const handleCreateReport = async (
    data: CreateTravelReportRequest | import("@/domain/travel-reports/api/types").UpdateTravelReportRequest
  ) => {
    const createData = data as CreateTravelReportRequest
    try {
      const report = await createReportMutation.mutateAsync(createData)
      setShowCreateReportModal(false)
      setReportRefreshKey((k) => k + 1)
      setTravelReportId(report.id)
      toast.success("Relatório criado com sucesso")
    } catch (err) {
      toast.error("Erro ao criar relatório", {
        description: err instanceof Error ? err.message : "Tente novamente.",
      })
      throw err
    }
  }

  const canSubmit =
    passengerTravelerIds.length === passengerCount &&
    (isB2C || (!!travelReportId && !!costCenterId))

  useEffect(() => {
    onValidityChange?.(canSubmit)
  }, [canSubmit, onValidityChange])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isB2C) {
      if (!travelReportId) {
        toast.error("Por favor, selecione um relatório de viagem")
        return
      }
      if (!costCenterId) {
        toast.error("Por favor, selecione um centro de custo")
        return
      }
    }
    onSubmit({
      costCenterId: isB2C ? undefined : costCenterId || undefined,
      travelReportId: isB2C ? undefined : travelReportId || undefined,
      title: title.trim() || undefined,
      observations: observations.trim() || undefined,
      travelerIds: passengerTravelerIds.length === passengerCount ? passengerTravelerIds : undefined,
    })
  }

  return (
    <>
      <PassengerSlotsCard
        passengerCount={passengerCount}
        adults={adults}
        children={children}
        infants={infants}
        initialTravelerIds={initialTravelerIds}
        companyId={companyId}
        companyName={companyName}
        selectedOutbound={selectedOutbound}
        selectedReturn={selectedReturn}
        onTravelerIdsChange={setPassengerTravelerIds}
        className="mb-6"
      />

      {onExtraBaggageChange && (
        <BaggageAndServicesCard
          passengerCount={passengerCount}
          adults={adults}
          children={children}
          infants={infants}
          selectedOutbound={selectedOutbound}
          selectedReturn={selectedReturn}
          extraBaggageCountsPerSlot={extraBaggageCountsPerSlot}
          onExtraBaggageChange={onExtraBaggageChange}
          className="mb-6"
        />
      )}

      <Card className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold text-[#1E293B] mb-1">
            Fale um pouco mais sobre sua viagem
          </h3>
          <p className="text-sm text-[#64748B] mb-6">
            Relatório, centro de custo e título (B2B) ou título (B2C)
          </p>

          <form
            id={FINISH_BOOKING_FORM_ID}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {!isB2C && (
              <TravelReportSelector
                companyId={companyId!}
                value={travelReportId}
                onChange={setTravelReportId}
                onCreateNew={() => setShowCreateReportModal(true)}
                refreshKey={reportRefreshKey}
                required
              />
            )}

            {!isB2C && (
              <CostCenterSelector
                companyId={companyId}
                value={costCenterId}
                onChange={setCostCenterId}
                required
              />
            )}

            <div className="space-y-2">
              <Label htmlFor="trip-title">Título da Viagem (opcional)</Label>
              <Input
                id="trip-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título da viagem"
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Observações (opcional)</Label>
              <Textarea
                id="observations"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Ex.: assento preferencial, refeição especial..."
                rows={3}
                maxLength={500}
                className="resize-none border-[#E5E7EB] rounded-xl"
              />
            </div>

            {policyViolations != null && policyViolations.length > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <h4 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
                  Aviso: violações de política
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-amber-700">
                  {policyViolations.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
                <p className="mt-2 text-sm text-amber-700">
                  O item será criado e enviado para aprovação.
                </p>
              </div>
            )}

            {externalError && (
              <p className="text-sm text-destructive" role="alert">
                {externalError}
              </p>
            )}

            {/* Submit button is in the sidebar (FinishBookingSummary) via form attribute */}
          </form>
        </CardContent>
      </Card>

      {companyId && (
        <TravelReportFormModal
          open={showCreateReportModal}
          onOpenChange={setShowCreateReportModal}
          companyId={companyId}
          onSubmit={handleCreateReport}
        />
      )}
    </>
  )
}
