"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import { FlightsMetrics } from "./types"

const MOCK_FLIGHTS_METRICS: FlightsMetrics = {
  currentMonth: 156,
  previousMonth: 182,
  change: -17,
  changeType: "negative",
}

async function getFlightsMetrics(): Promise<FlightsMetrics> {
  // Simular delay de rede
  await new Promise((resolve) => setTimeout(resolve, 4000))
  return MOCK_FLIGHTS_METRICS
}

export function useFlightsMetrics() {
  return useSuspenseQuery({
    queryKey: ["flights-metrics"],
    queryFn: getFlightsMetrics,
  })
}

