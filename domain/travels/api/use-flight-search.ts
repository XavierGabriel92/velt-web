"use client"

import { useMutation } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import type { FlightSearchParams, FlightSearchResponse } from "./types"

/** Request body for backend (camelCase; backend binding is case-insensitive) */
interface FlightSearchRequestBody {
  tripType: string
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  adults: number
  children?: number
  infants?: number
  cabinClass: string
}

function buildRequestBody(params: FlightSearchParams): FlightSearchRequestBody {
  return {
    tripType: params.tripType,
    origin: params.origin,
    destination: params.destination,
    departureDate: params.departureDate,
    returnDate: params.returnDate,
    adults: params.adults,
    children: params.children ?? 0,
    infants: params.infants ?? 0,
    cabinClass: params.cabinClass,
  }
}

async function searchFlights(
  params: FlightSearchParams
): Promise<FlightSearchResponse> {
  const body = buildRequestBody(params)
  return apiRequest<FlightSearchResponse>("/api/flight-search/test-direct", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export function useFlightSearch() {
  return useMutation({
    mutationFn: searchFlights,
  })
}
