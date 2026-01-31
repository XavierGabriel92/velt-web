"use client"

import { MetricCard } from "@/components/shared/metric-card"
import { useSavingsMetrics } from "../api/use-savings-metrics"
import { TrendingUp } from "lucide-react"

export function SavingsMetricCard() {
  const { data } = useSavingsMetrics()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <MetricCard
      title="Economia gerada"
      value={formatCurrency(data.currentMonth)}
      change={`${data.change > 0 ? "+" : ""}${data.change}%`}
      changeType={data.changeType}
      previousPeriod={`${formatCurrency(data.previousMonth)} no mês passado`}
      icon={TrendingUp}
    />
  )
}

