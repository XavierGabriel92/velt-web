"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import { PointsMetrics } from "./types"

const MOCK_POINTS_METRICS: PointsMetrics = {
  currentMonth: 1786,
  previousMonth: 1549,
  change: 15,
  changeType: "positive",
}

async function getPointsMetrics(): Promise<PointsMetrics> {
  // Simular delay de rede
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_POINTS_METRICS
}

export function usePointsMetrics() {
  return useSuspenseQuery({
    queryKey: ["points-metrics"],
    queryFn: getPointsMetrics,
  })
}

