"use client"

import { useState, useCallback } from "react"
import { FlightSearchCard } from "@/domain/travels/components/flight-search-card"
import { LastSearchesCard } from "@/domain/travels/components/last-searches-card"
import type { FlightSearchParams, LastFlightSearch } from "@/domain/travels/api/types"

export default function ViagensPage() {
  const [formValues, setFormValues] = useState<Partial<FlightSearchParams>>({})
  const [formKey, setFormKey] = useState(0)

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
        <div className="flex flex-col gap-8">
          <FlightSearchCard
            key={formKey}
            initialValues={formValues}
          />
          <LastSearchesCard onSelect={handleSelectSearch} />
        </div>
      </div>
    </div>
  )
}
