"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Plane,
  ArrowRightLeft,
  ArrowLeftRight,
  Calendar,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TravelerSelect } from "./traveler-select"
import { PassengerSelector } from "./passenger-selector"
import { useLastSearches } from "../api/use-last-searches"
import { useCompanyTravelers } from "../api/use-company-travelers"
import { useAuth } from "@/lib/auth-context"
import type {
  FlightSearchParams,
  TripType,
  CabinClass,
} from "../api/types"

const SELECTOR_BASE =
  "flex items-center justify-between gap-2 h-9 px-3 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#1E293B] hover:bg-gray-50"

interface FlightSearchFormProps {
  initialValues?: Partial<FlightSearchParams>
}

export function FlightSearchForm({ initialValues }: FlightSearchFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { saveSearch } = useLastSearches()
  const { data: travelers } = useCompanyTravelers()

  const isB2C = user && travelers.length === 1 && travelers[0]?.id === user.userId

  const [tripType, setTripType] = useState<TripType>(
    initialValues?.tripType ?? "RoundTrip"
  )
  const [cabinClass, setCabinClass] = useState<CabinClass>(
    initialValues?.cabinClass ?? "Economy"
  )
  const [adults, setAdults] = useState(initialValues?.adults ?? 1)
  const [children, setChildren] = useState(initialValues?.children ?? 0)
  const [infants, setInfants] = useState(initialValues?.infants ?? 0)
  const [origin, setOrigin] = useState(initialValues?.origin ?? "")
  const [destination, setDestination] = useState(initialValues?.destination ?? "")
  const [departureDate, setDepartureDate] = useState(
    initialValues?.departureDate ?? ""
  )
  const [returnDate, setReturnDate] = useState(initialValues?.returnDate ?? "")
  const [travelerIds, setTravelerIds] = useState<string[]>(
    initialValues?.travelerIds ?? []
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cabinClassOpen, setCabinClassOpen] = useState(false)
  const [tripTypeOpen, setTripTypeOpen] = useState(false)

  useEffect(() => {
    if (initialValues) {
      setTripType(initialValues.tripType ?? "RoundTrip")
      setCabinClass(initialValues.cabinClass ?? "Economy")
      setAdults(initialValues.adults ?? 1)
      setChildren(initialValues.children ?? 0)
      setInfants(initialValues.infants ?? 0)
      setOrigin(initialValues.origin ?? "")
      setDestination(initialValues.destination ?? "")
      setDepartureDate(initialValues.departureDate ?? "")
      setReturnDate(initialValues.returnDate ?? "")
      setTravelerIds(initialValues.travelerIds ?? [])
    }
  }, [initialValues])

  useEffect(() => {
    if (tripType === "OneWay") {
      setReturnDate("")
    }
  }, [tripType])

  useEffect(() => {
    if (travelerIds.length > adults) {
      setTravelerIds((prev) => prev.slice(0, adults))
    }
  }, [adults])

  useEffect(() => {
    if (isB2C && user && adults >= 1 && travelerIds.length === 0) {
      setTravelerIds([user.userId])
    }
  }, [isB2C, user?.userId, adults, travelerIds.length])

  const handleSwapOriginDestination = () => {
    setOrigin((prev) => destination)
    setDestination((prev) => origin)
  }

  const getTravelerNames = (ids: string[]): string | undefined => {
    if (ids.length === 0) return undefined
    const names = ids
      .map((id) => {
        const t = travelers.find((x) => x.id === id)
        return t ? `${t.firstName} ${t.lastName}` : null
      })
      .filter(Boolean) as string[]
    return names.length > 0 ? names.join(", ") : undefined
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return

    const originTrimmed = origin.trim().toUpperCase()
    const destTrimmed = destination.trim().toUpperCase()

    if (originTrimmed === destTrimmed) return
    if (!departureDate) return
    if (tripType === "RoundTrip" && !returnDate) return
    const today = new Date().toISOString().split("T")[0]
    if (departureDate < today) return
    if (tripType === "RoundTrip" && returnDate && returnDate < departureDate)
      return

    setIsSubmitting(true)

    const params: FlightSearchParams = {
      origin: originTrimmed,
      destination: destTrimmed,
      departureDate,
      returnDate: tripType === "RoundTrip" ? returnDate : undefined,
      tripType,
      adults,
      children: children > 0 ? children : undefined,
      infants: infants > 0 ? infants : undefined,
      cabinClass,
      travelerIds:
        travelerIds.length > 0 || isB2C
          ? isB2C && user
            ? [user.userId]
            : travelerIds
          : undefined,
    }

    const idsToSave = isB2C && user ? [user.userId] : travelerIds
    saveSearch(params, getTravelerNames(idsToSave))

    const searchParams = new URLSearchParams({
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departureDate,
      tripType: params.tripType,
      adults: params.adults.toString(),
      cabinClass: params.cabinClass,
    })
    if (params.returnDate) searchParams.set("returnDate", params.returnDate)
    if (params.children) searchParams.set("children", params.children.toString())
    if (params.infants) searchParams.set("infants", params.infants.toString())
    const ids = params.travelerIds ?? (isB2C && user ? [user.userId] : [])
    if (ids.length) searchParams.set("travelerIds", ids.join(","))

    router.push(`/inicio/viagens/busca?${searchParams.toString()}`)

    setTimeout(() => setIsSubmitting(false), 500)
  }

  const cabinClassLabel = cabinClass === "Economy" ? "Econômica" : "Executiva"
  const tripTypeLabel = tripType === "RoundTrip" ? "Ida e volta" : "Só ida"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Row 1: Viajante - oculto para B2C (usuário é sempre o viajante) */}
      {!isB2C && (
        <div className="flex items-center gap-3">
          <TravelerSelect
            value={travelerIds}
            onChange={setTravelerIds}
            maxSelection={adults}
            disabled={isSubmitting}
          />
        </div>
      )}

      {/* Row 2: Tipo viagem, Passageiros, Classe - todos com o mesmo formato */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Trip Type - dropdown padronizado */}
        <div className="relative">
          <button
            type="button"
            onClick={() => !isSubmitting && setTripTypeOpen(!tripTypeOpen)}
            disabled={isSubmitting}
            className={`${SELECTOR_BASE} min-w-[140px]`}
          >
            <span className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 shrink-0 text-[#64748B]" />
              {tripTypeLabel}
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-[#64748B] opacity-50 transition-transform ${
                tripTypeOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {tripTypeOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setTripTypeOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute left-0 top-full z-20 mt-1 w-[140px] rounded-xl border border-[#E2E8F0] bg-white shadow-lg py-1">
                <button
                  type="button"
                  onClick={() => {
                    setTripType("RoundTrip")
                    setTripTypeOpen(false)
                  }}
                  className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${
                    tripType === "RoundTrip"
                      ? "bg-primary/10 text-primary"
                      : "text-[#1E293B] hover:bg-gray-100"
                  }`}
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  Ida e volta
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTripType("OneWay")
                    setTripTypeOpen(false)
                  }}
                  className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${
                    tripType === "OneWay"
                      ? "bg-primary/10 text-primary"
                      : "text-[#1E293B] hover:bg-gray-100"
                  }`}
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  Só ida
                </button>
              </div>
            </>
          )}
        </div>

        {/* Passageiros - mesmo estilo */}
        <PassengerSelector
          adults={adults}
          children={children}
          infants={infants}
          onChange={(a, c, i) => {
            setAdults(a)
            setChildren(c)
            setInfants(i)
          }}
          disabled={isSubmitting}
        />

        {/* Classe - mesmo estilo */}
        <div className="relative">
          <button
            type="button"
            onClick={() => !isSubmitting && setCabinClassOpen(!cabinClassOpen)}
            disabled={isSubmitting}
            className={`${SELECTOR_BASE} min-w-[120px]`}
          >
            <span>{cabinClassLabel}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-[#64748B] opacity-50 transition-transform ${
                cabinClassOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {cabinClassOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setCabinClassOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute left-0 top-full z-20 mt-1 w-[120px] rounded-xl border border-[#E2E8F0] bg-white shadow-lg py-1">
                <button
                  type="button"
                  onClick={() => {
                    setCabinClass("Economy")
                    setCabinClassOpen(false)
                  }}
                  className={`w-full px-3 py-2 text-left text-sm ${
                    cabinClass === "Economy"
                      ? "bg-primary/10 text-primary"
                      : "text-[#1E293B] hover:bg-gray-100"
                  }`}
                >
                  Econômica
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCabinClass("Business")
                    setCabinClassOpen(false)
                  }}
                  className={`w-full px-3 py-2 text-left text-sm ${
                    cabinClass === "Business"
                      ? "bg-primary/10 text-primary"
                      : "text-[#1E293B] hover:bg-gray-100"
                  }`}
                >
                  Executiva
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Row 3: Origem, Swap, Destino | Datas */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2 p-4 bg-white border border-[#E5E7EB] rounded-2xl">
          <div className="flex-1 flex items-center gap-3 px-4">
            <div className="w-2 h-2 rounded-full border-2 border-[#99A1AF]" />
            <Input
              placeholder="De onde?"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              disabled={isSubmitting}
              className="border-0 p-0 h-auto shadow-none focus-visible:ring-0 text-sm text-[#1E293B] placeholder:text-[#4A5565]"
            />
          </div>
          <button
            type="button"
            onClick={handleSwapOriginDestination}
            disabled={isSubmitting}
            className="shrink-0 w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center hover:bg-[#E2E8F0]"
            aria-label="Trocar origem e destino"
          >
            <ArrowLeftRight className="h-4 w-4 text-[#99A1AF]" />
          </button>
          <div className="flex-1 flex items-center gap-3 px-4 border-l border-[#E5E7EB]">
            <Plane className="h-4 w-4 text-[#99A1AF] shrink-0" />
            <Input
              placeholder="Para onde?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              disabled={isSubmitting}
              className="border-0 p-0 h-auto shadow-none focus-visible:ring-0 text-sm text-[#1E293B] placeholder:text-[#4A5565]"
            />
          </div>
        </div>

        <div className="flex items-center bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 flex-1">
            <Calendar className="h-4 w-4 text-[#99A1AF]" />
            <Input
              type="date"
              placeholder="Partida"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              disabled={isSubmitting}
              min={new Date().toISOString().split("T")[0]}
              className="border-0 p-0 h-auto shadow-none focus-visible:ring-0 text-sm text-[#1E293B] w-32"
            />
          </div>
          {tripType === "RoundTrip" && (
            <div className="flex items-center gap-3 px-4 py-3 border-l border-[#E5E7EB]">
              <Input
                type="date"
                placeholder="Volta"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                disabled={isSubmitting}
                min={departureDate || new Date().toISOString().split("T")[0]}
                className="border-0 p-0 h-auto shadow-none focus-visible:ring-0 text-sm text-[#1E293B] w-28"
              />
            </div>
          )}
        </div>
      </div>

      {/* Botão Buscar */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-10 bg-[#1E293B] hover:bg-[#334155] text-white font-medium rounded-2xl shadow-sm"
      >
        {isSubmitting ? "Buscando..." : "Buscar"}
      </Button>
    </form>
  )
}
