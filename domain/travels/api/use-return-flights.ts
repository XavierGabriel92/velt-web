"use client"

import { useMutation } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import type {
  ReturnFlightSearchRequest,
  ReturnFlightsResponse,
} from "./types"

async function getReturnFlights(
  request: ReturnFlightSearchRequest
): Promise<ReturnFlightsResponse> {
  return apiRequest<ReturnFlightsResponse>("/api/flight-search/return-flights", {
    method: "POST",
    body: JSON.stringify(request),
  })
}

export function useReturnFlights() {
  return useMutation({
    mutationFn: getReturnFlights,
  })
}
