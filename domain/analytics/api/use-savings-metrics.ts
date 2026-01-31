"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import { SavingsMetrics } from "./types"

const MOCK_SAVINGS_METRICS: SavingsMetrics = {
  currentMonth: 12300,
  previousMonth: 8900,
  change: 38,
  changeType: "positive",
}

async function getSavingsMetrics(): Promise<SavingsMetrics> {
  // Simular delay de rede
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_SAVINGS_METRICS
}

export function useSavingsMetrics() {
  return useSuspenseQuery({
    queryKey: ["savings-metrics"],
    queryFn: getSavingsMetrics,
  })
}

