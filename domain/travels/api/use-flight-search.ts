"use client"

import { useMutation } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import type { FlightSearchParams, FlightSearchResponse, FlightOption } from "./types"

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

/** Resposta do POST /api/flight-search/railway (202 Accepted) */
interface RailwayTriggerResponse {
  searchSessionId: string
  status?: string
  message?: string
}

/** Resposta do GET /api/flight-search/session/{id} */
interface SessionResponse {
  searchSessionId: string
  status: "in_progress" | "completed"
  expired: boolean
  minimumPrice?: number
  flights: FlightOption[]
  totalCount: number
}

const POLL_INTERVAL_MS = 2000
const POLL_TIMEOUT_MS = 120000 // 2 min (BDR-008)

async function pollSession(searchSessionId: string): Promise<SessionResponse> {
  const session = await apiRequest<SessionResponse>(
    `/api/flight-search/session/${encodeURIComponent(searchSessionId)}`
  )
  return session
}

async function waitForSession(searchSessionId: string): Promise<SessionResponse> {
  const start = Date.now()
  while (Date.now() - start < POLL_TIMEOUT_MS) {
    const session = await pollSession(searchSessionId)
    if (session.status === "completed" || session.expired) {
      return session
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
  }
  return pollSession(searchSessionId)
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

/**
 * Busca de voos via Railway (BDR-008).
 * Dispara POST /railway, faz polling em GET /session até completed ou timeout e devolve voos no formato esperado pela página.
 */
async function searchFlights(
  params: FlightSearchParams
): Promise<FlightSearchResponse> {
  const body = buildRequestBody(params)
  const trigger = await apiRequest<RailwayTriggerResponse>(
    "/api/flight-search/railway",
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  )
  const searchSessionId = trigger.searchSessionId
  if (!searchSessionId) {
    throw new Error("Resposta da busca sem searchSessionId")
  }
  const session = await waitForSession(searchSessionId)
  return {
    searchSessionId: session.searchSessionId,
    provider: "Railway",
    status: session.status,
    flights: session.flights ?? [],
    minimumPrice: session.minimumPrice,
    processedAt: new Date().toISOString(),
  }
}

export function useFlightSearch() {
  return useMutation({
    mutationFn: searchFlights,
  })
}
