"use client"

import { useState, useCallback, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { FlightSearchCard } from "@/domain/travels/components/flight-search-card"
import { LastSearchesCard } from "@/domain/travels/components/last-searches-card"
import { TravelReportList } from "@/domain/travel-reports/components/travel-report-list"
import type { FlightSearchParams, LastFlightSearch } from "@/domain/travels/api/types"
import { Button } from "@/components/ui/button"
import { Plane, ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"

type Tab = "buscar" | "minhas"

export default function ViagensPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [tab, setTab] = useState<Tab>(tabParam === "minhas" ? "minhas" : "buscar")
  const [formValues, setFormValues] = useState<Partial<FlightSearchParams>>({})
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    if (tabParam === "minhas") setTab("minhas")
    else if (tabParam === "buscar") setTab("buscar")
  }, [tabParam])

  const handleSelectSearch = useCallback((search: LastFlightSearch) => {
    setFormValues({
      origin: search.origin,
      destination: search.destination,
      departureDate: search.departureDate,
      returnDate: search.returnDate,
      tripType: search.tripType,
      adults: search.adults,
      children: search.children,
      infants: search.infants,
      cabinClass: search.cabinClass,
      travelerIds: search.travelerIds,
    })
    setFormKey((k) => k + 1)
  }, [])

  return (
    <div className="min-h-screen bg-[#FCFCFA]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="flex gap-2 mb-6 border-b">
          <Button
            variant="ghost"
            className={cn(
              "rounded-b-none border-b-2 border-transparent",
              tab === "buscar" && "border-[#FF3C00] bg-transparent"
            )}
            onClick={() => {
              setTab("buscar")
              router.replace("/inicio/viagens?tab=buscar", { scroll: false })
            }}
          >
            <Plane className="size-4 mr-2" />
            Buscar voos
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "rounded-b-none border-b-2 border-transparent",
              tab === "minhas" && "border-[#FF3C00] bg-transparent"
            )}
            onClick={() => {
              setTab("minhas")
              router.replace("/inicio/viagens?tab=minhas", { scroll: false })
            }}
          >
            <ClipboardList className="size-4 mr-2" />
            Minhas Viagens
          </Button>
        </div>
        {tab === "buscar" && (
          <div className="flex flex-col gap-8">
            <FlightSearchCard
              key={formKey}
              initialValues={formValues}
            />
            <LastSearchesCard onSelect={handleSelectSearch} />
          </div>
        )}
        {tab === "minhas" && <TravelReportList />}
      </div>
    </div>
  )
}
