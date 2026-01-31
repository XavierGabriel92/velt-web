"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import { ExpensesMetrics } from "./types"

const MOCK_EXPENSES_METRICS: ExpensesMetrics = {
  currentMonth: 27900,
  previousMonth: 21400,
  change: 30,
  changeType: "positive",
}

async function getExpensesMetrics(): Promise<ExpensesMetrics> {
  // Simular delay de rede
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_EXPENSES_METRICS
}

export function useExpensesMetrics() {
  return useSuspenseQuery({
    queryKey: ["expenses-metrics"],
    queryFn: getExpensesMetrics,
  })
}

