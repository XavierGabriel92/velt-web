"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { saveBookingSession } from "@/lib/booking-session"
import { FlightSearchCard } from "@/domain/travels/components/flight-search-card"
import { FlightFiltersStrip, type FilterId } from "@/domain/travels/components/flight-filters-strip"
import { OutboundFlightsList } from "@/domain/travels/components/outbound-flights-list"
import { TravelSummarySidebar } from "@/domain/travels/components/travel-summary-sidebar"
import { useFlightSearch } from "@/domain/travels/api/use-flight-search"
import { useReturnFlights } from "@/domain/travels/api/use-return-flights"
import type { FlightSearchParams, FlightOption } from "@/domain/travels/api/types"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/loading"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

function parseSearchParams(searchParams: URLSearchParams): Partial<FlightSearchParams> | null {
  const origin = searchParams.get("origin")?.trim().toUpperCase()
  const destination = searchParams.get("destination")?.trim().toUpperCase()
  const departureDate = searchParams.get("departureDate") ?? ""
  const returnDate = searchParams.get("returnDate") ?? undefined
  const tripType = (searchParams.get("tripType") as FlightSearchParams["tripType"]) ?? "RoundTrip"
  const adults = parseInt(searchParams.get("adults") ?? "1", 10)
  const children = parseInt(searchParams.get("children") ?? "0", 10)
  const infants = parseInt(searchParams.get("infants") ?? "0", 10)
  const cabinClass = (searchParams.get("cabinClass") as FlightSearchParams["cabinClass"]) ?? "Economy"
  const travelerIdsParam = searchParams.get("travelerIds")
  const travelerIds = travelerIdsParam ? travelerIdsParam.split(",").filter(Boolean) : undefined

  if (!origin || !destination || !departureDate || adults < 1) return null

  return {
    origin,
    destination,
    departureDate,
    returnDate: tripType === "RoundTrip" && returnDate ? returnDate : undefined,
    tripType,
    adults,
    children: children > 0 ? children : undefined,
    infants: infants > 0 ? infants : undefined,
    cabinClass,
    travelerIds,
  }
}

export default function BuscaVoosPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [selectedOutbound, setSelectedOutbound] = useState<FlightOption | null>(null)
  const [selectedReturn, setSelectedReturn] = useState<FlightOption | null>(null)
  const [activeFilterId, setActiveFilterId] = useState<FilterId | null>(null)

  const paramsFromRouter = useMemo(
    () => parseSearchParams(searchParams),
    [searchParams]
  )

  const [paramsFromUrl, setParamsFromUrl] = useState<Partial<FlightSearchParams> | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const query = window.location.search
    if (!query) return
    const parsed = parseSearchParams(new URLSearchParams(query))
    if (parsed) setParamsFromUrl(parsed)
  }, [])

  const params = paramsFromRouter ?? paramsFromUrl

  const searchMutation = useFlightSearch()
  const returnFlightsMutation = useReturnFlights()

  const runSearch = useCallback(() => {
    if (!params || !params.origin || !params.destination || !params.departureDate || (params.adults ?? 0) < 1) {
      return
    }
    const fullParams: FlightSearchParams = {
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      tripType: params.tripType ?? "RoundTrip",
      adults: params.adults ?? 1,
      children: params.children,
      infants: params.infants,
      cabinClass: params.cabinClass ?? "Economy",
      travelerIds: params.travelerIds,
    }
    searchMutation.mutate(fullParams)
  }, [params, searchMutation])

  const paramsKey = useMemo(
    () =>
      params
        ? `${params.origin}|${params.destination}|${params.departureDate}|${params.returnDate ?? ""}|${params.adults ?? 1}`
        : "",
    [params]
  )

  useEffect(() => {
    if (!paramsKey || !params) return
    runSearch()
    // Só rodar quando a query string da busca mudar (ex.: chegou na página ou clicou Buscar de novo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey])

  useEffect(() => {
    if (searchMutation.isError) {
      toast.error("Erro ao buscar voos", {
        description: searchMutation.error instanceof Error ? searchMutation.error.message : "Tente novamente.",
      })
    }
  }, [searchMutation.isError, searchMutation.error])

  useEffect(() => {
    if (returnFlightsMutation.isError) {
      toast.error("Erro ao buscar voos de volta", {
        description: returnFlightsMutation.error instanceof Error ? returnFlightsMutation.error.message : "Tente novamente.",
      })
    }
  }, [returnFlightsMutation.isError, returnFlightsMutation.error])

  const searchSessionId = searchMutation.data?.searchSessionId
  const allFlights = searchMutation.data?.flights ?? []
  const minimumPrice = searchMutation.data?.minimumPrice
  const isLoading = searchMutation.isPending
  const hasSearched = searchMutation.isSuccess || searchMutation.isError
  const isRoundTrip = (params?.tripType ?? "RoundTrip") === "RoundTrip"

  const returnFlights = useMemo(() => {
    const data = returnFlightsMutation.data
    if (!data) return []
    return [...(data.correlatedFlights ?? []), ...(data.otherFlights ?? [])]
  }, [returnFlightsMutation.data])

  const isLoadingReturnFlights = returnFlightsMutation.isPending

  useEffect(() => {
    if (
      !isRoundTrip ||
      !selectedOutbound ||
      !searchSessionId ||
      !params?.returnDate
    ) {
      setSelectedReturn(null)
      return
    }
    setSelectedReturn(null)
    returnFlightsMutation.mutate({
      originalSearchSessionId: searchSessionId,
      selectedOutboundFlightId: selectedOutbound.id,
      selectedOutboundHash: selectedOutbound.hash,
      returnDate: params.returnDate,
      adults: params.adults ?? 1,
      children: params.children,
      infants: params.infants,
      cabinClass: params.cabinClass ?? "Economy",
      userId: user?.userId,
      travelerIds: params.travelerIds,
    })
    // Só buscar voltas quando o voo de ida selecionado mudar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRoundTrip, selectedOutbound?.id, searchSessionId, params?.returnDate])

  const flights = useMemo(() => {
    if (activeFilterId === "Escalas") {
      return allFlights.filter((f) => f.stops === 0)
    }
    return allFlights
  }, [allFlights, activeFilterId])

  if (!params) {
    return (
      <div className="min-h-screen bg-[#FCFCFA]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center">
            <p className="text-[#64748B] mb-4">
              Informe origem, destino, data e passageiros para buscar voos.
            </p>
            <Button asChild className="bg-[#1E293B] hover:bg-[#334155] rounded-2xl">
              <Link href="/inicio/viagens">Nova busca</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const initialValues: Partial<FlightSearchParams> = {
    ...params,
    origin: params.origin ?? "",
    destination: params.destination ?? "",
    departureDate: params.departureDate ?? "",
  }

  return (
    <div className="min-h-screen bg-[#FCFCFA]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main: search + filters + results */}
          <div className="lg:col-span-2 space-y-6">
            <FlightSearchCard key={JSON.stringify(initialValues)} initialValues={initialValues} />

            {isLoading && hasSearched === false && paramsKey ? (
              <div className="py-12">
                <Loading text="Buscando voos..." />
              </div>
            ) : null}

            {hasSearched && (
              <>
                <FlightFiltersStrip
                  activeFilterId={activeFilterId}
                  onFilterChange={setActiveFilterId}
                />

                <div className="space-y-2">
                  <OutboundFlightsList
                    title="IDA"
                    flights={
                      selectedOutbound
                        ? [selectedOutbound]
                        : flights
                    }
                    loading={isLoading}
                    minimumPrice={minimumPrice}
                    selectedFlightId={selectedOutbound?.id}
                    onSelectFlight={(flight) => {
                      if (selectedOutbound?.id === flight.id) {
                        setSelectedOutbound(null)
                        setSelectedReturn(null)
                      } else {
                        setSelectedOutbound(flight)
                      }
                    }}
                  />
                  {selectedOutbound && (
                    <Button
                      type="button"
                      variant="link"
                      className="text-[#64748B] text-sm h-auto p-0 hover:text-[#1E293B]"
                      onClick={() => {
                        setSelectedOutbound(null)
                        setSelectedReturn(null)
                      }}
                    >
                      Ver todos os voos de ida
                    </Button>
                  )}
                </div>

                {isRoundTrip && selectedOutbound && (
                  <OutboundFlightsList
                    title="VOLTA"
                    flights={returnFlights}
                    loading={isLoadingReturnFlights}
                    minimumPrice={undefined}
                    selectedFlightId={selectedReturn?.id}
                    onSelectFlight={setSelectedReturn}
                  />
                )}
              </>
            )}

            {searchMutation.isError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-red-800">
                  Não foi possível carregar os voos. Tente novamente.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => runSearch()}
                  className="rounded-xl"
                >
                  Tentar novamente
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar: resumo da viagem */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <TravelSummarySidebar
                selectedOutbound={selectedOutbound}
                selectedReturn={isRoundTrip ? selectedReturn : null}
                adults={params.adults ?? 1}
                onConfirm={() => {
                  const sessionId = searchMutation.data?.searchSessionId
                  if (params.tripType === "OneWay" && selectedOutbound) {
                    if (!sessionId) {
                      toast.error("Sessão de busca inválida. Faça uma nova busca.")
                      return
                    }
                    saveBookingSession({
                      selectedOutbound,
                      selectedReturn: null,
                      searchParams: params,
                      searchSessionId: sessionId,
                      timestamp: Date.now(),
                    })
                    router.push("/inicio/viagens/finalizar")
                  } else if (isRoundTrip && selectedOutbound && selectedReturn) {
                    if (!sessionId) {
                      toast.error("Sessão de busca inválida. Faça uma nova busca.")
                      return
                    }
                    saveBookingSession({
                      selectedOutbound,
                      selectedReturn,
                      searchParams: params,
                      searchSessionId: sessionId,
                      timestamp: Date.now(),
                    })
                    router.push("/inicio/viagens/finalizar")
                  } else {
                    toast.info("Para Ida e volta, selecione o voo de ida e em seguida o voo de volta.")
                  }
                }}
                confirmDisabled={
                  !selectedOutbound || (isRoundTrip && !selectedReturn)
                }
                tripType={params.tripType ?? "RoundTrip"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
