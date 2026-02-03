"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  getBookingSession,
  clearBookingSession,
} from "@/lib/booking-session"
import { FinishBookingForm } from "@/domain/travels/components/finish-booking-form"
import { FinishBookingSummary } from "@/domain/travels/components/finish-booking-summary"
import { useConfirmFlight } from "@/domain/travels/api/use-confirm-flight"
import { getTravelById } from "@/domain/travels/api/use-travel-by-id"
import { EXTRA_BAGgage_UNIT_PRICE_BRL } from "@/domain/travels/constants"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { FileText } from "lucide-react"

export default function FinalizarReservaPage() {
  const router = useRouter()
  const { selectedCompany, user } = useAuth()
  const confirmFlightMutation = useConfirmFlight()
  const [session, setSession] = useState<
    Awaited<ReturnType<typeof getBookingSession>>
  >(null)
  const [canSubmit, setCanSubmit] = useState(false)
  const [policyViolations, setPolicyViolations] = useState<string[]>([])
  const [extraBaggageCountsPerSlot, setExtraBaggageCountsPerSlot] = useState<
    number[]
  >([])

  useEffect(() => {
    const data = getBookingSession()
    setSession(data)
    if (!data) {
      toast.error("Sessão expirada", {
        description: "Selecione os voos novamente para continuar.",
      })
      router.replace("/inicio/viagens/busca")
    } else if (data.searchSessionId == null || data.searchSessionId === "") {
      toast.error("Sessão de busca inválida", {
        description: "Faça uma nova busca de voos.",
      })
      router.replace("/inicio/viagens/busca")
    }
  }, [router])

  const searchParams = session?.searchParams
  const adults = searchParams?.adults ?? 1
  const children = searchParams?.children ?? 0
  const infants = searchParams?.infants ?? 0
  const passengerCount = adults + children + infants
  const initialExtraBaggageCounts = useMemo(
    () => Array.from({ length: passengerCount }, () => 0),
    [passengerCount]
  )
  useEffect(() => {
    if (extraBaggageCountsPerSlot.length !== passengerCount) {
      setExtraBaggageCountsPerSlot(initialExtraBaggageCounts)
    }
  }, [passengerCount, initialExtraBaggageCounts, extraBaggageCountsPerSlot.length])

  const companyId = selectedCompany?.companyId ?? null
  const companyName = selectedCompany?.companyName
  const initialTravelerIds =
    session && (session.searchParams?.travelerIds?.length ?? 0) > 0
      ? session.searchParams!.travelerIds!
      : companyName === "B2C Consumer" && user
        ? [user.userId]
        : []

  const handleSubmit = async (
    data: import("@/domain/travels/components/finish-booking-form").FinishBookingFormData
  ) => {
    if (!session?.searchSessionId || !selectedCompany?.companyId) {
      toast.error("Dados da reserva incompletos.")
      return
    }
    const adults = session.searchParams?.adults ?? 1
    const children = session.searchParams?.children ?? 0
    const infants = session.searchParams?.infants ?? 0
    const passengerCount = adults + children + infants
    const travelerIds =
      data.travelerIds?.length === passengerCount
        ? data.travelerIds
        : (session.searchParams?.travelerIds?.length ?? 0) > 0
          ? session.searchParams!.travelerIds!
          : selectedCompany.companyName === "B2C Consumer" && user
            ? [user.userId]
            : []
    if (travelerIds.length === 0) {
      toast.error("Selecione os passageiros em cada slot.")
      return
    }

    const isB2C = selectedCompany.companyName === "B2C Consumer"
    const selectedFlightId = session.selectedOutbound.combinationId ?? session.selectedOutbound.id
    const returnFlightId = session.selectedReturn?.id ?? undefined

    try {
      const result = await confirmFlightMutation.mutateAsync({
        searchSessionId: session.searchSessionId,
        selectedFlightId,
        returnFlightId,
        travelerIds,
        companyId: selectedCompany.companyId,
        travelReportId: isB2C ? undefined : data.travelReportId ?? undefined,
        costCenterId: isB2C ? undefined : data.costCenterId ?? undefined,
        title: data.title ?? undefined,
      })

      clearBookingSession()
      setPolicyViolations([])

      if (result.kind === "travel") {
        const res = result.data
        if (res.validationViolations?.length) {
          setPolicyViolations(res.validationViolations)
          toast.success("Reserva criada", {
            description: "O item foi enviado para aprovação conforme as políticas.",
          })
        } else {
          toast.success("Reserva confirmada", {
            description: res.requiresApproval
              ? "O item foi criado e enviado para aprovação."
              : "Sua viagem foi registrada.",
          })
        }
        // Priorizar travelReportId da resposta; fallback: buscar pela Travel
        let reportId = res.travelReportId ?? null
        if (!reportId && res.travelId) {
          try {
            const t = await getTravelById(res.travelId)
            reportId = t.travelReportId ?? null
          } catch {
            // ignora falha no fallback
          }
        }
        if (reportId) {
          router.replace(`/inicio/viagens/relatorio/${reportId}`)
        } else {
          router.replace("/inicio/viagens?tab=minhas")
        }
      } else {
        toast.success("Próximo passo: pagamento", {
          description: "Em breve você será redirecionado para concluir o pagamento.",
        })
        router.replace("/inicio/viagens?tab=minhas")
      }
    } catch (err) {
      toast.error("Erro ao finalizar reserva", {
        description:
          err instanceof Error ? err.message : "Tente novamente.",
      })
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#FCFCFA] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#64748B] mb-4">Carregando...</p>
          <Button asChild variant="outline">
            <Link href="/inicio/viagens/busca">Voltar para busca</Link>
          </Button>
        </div>
      </div>
    )
  }

  const { selectedOutbound, selectedReturn } = session

  return (
    <div className="min-h-screen bg-[#FCFCFA]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" className="mb-4 -ml-2" asChild>
            <Link href="/inicio/viagens/busca">← Voltar para busca</Link>
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div className="size-10 rounded-lg bg-[#FF3C00] flex items-center justify-center">
              <FileText className="size-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#1E293B]">
              Finalizar Reserva
            </h1>
          </div>
          <p className="text-[#64748B] mt-1">
            Complete os dados para finalizar sua viagem
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <FinishBookingForm
              selectedOutbound={selectedOutbound}
              selectedReturn={selectedReturn}
              companyId={companyId}
              companyName={companyName}
              passengerCount={passengerCount}
              adults={adults}
              children={children}
              infants={infants}
              extraBaggageCountsPerSlot={extraBaggageCountsPerSlot}
              onExtraBaggageChange={setExtraBaggageCountsPerSlot}
              initialTravelerIds={initialTravelerIds}
              onSubmit={handleSubmit}
              isSubmitting={confirmFlightMutation.isPending}
              policyViolations={policyViolations.length ? policyViolations : undefined}
              onValidityChange={setCanSubmit}
            />
          </div>

          {/* Sidebar - Resumo */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <FinishBookingSummary
                selectedOutbound={selectedOutbound}
                selectedReturn={selectedReturn}
                adults={adults}
                children={children}
                infants={infants}
                extraBaggageCount={extraBaggageCountsPerSlot.reduce(
                  (a, b) => a + b,
                  0
                )}
                extraBaggageUnitPrice={EXTRA_BAGgage_UNIT_PRICE_BRL}
                isSubmitting={confirmFlightMutation.isPending}
                confirmDisabled={!canSubmit}
                isPrePaid={
                  selectedCompany?.companyName === "B2C Consumer" ||
                  selectedCompany?.usaFaturamento === false
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
