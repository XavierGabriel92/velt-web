"use client"

import { MetricCard } from "@/components/shared/metric-card"
import { usePointsMetrics } from "../api/use-points-metrics"
import { Star } from "lucide-react"

export function PointsMetricCard() {
  const { data } = usePointsMetrics()

  const formatPoints = (value: number) => {
    return new Intl.NumberFormat("pt-BR").format(value)
  }

  return (
    <MetricCard
      title="Pontos acumulados"
      value={formatPoints(data.currentMonth)}
      change={`${data.change > 0 ? "+" : ""}${data.change}%`}
      changeType={data.changeType}
      previousPeriod={`${formatPoints(data.previousMonth)} no mês passado`}
      icon={Star}
    />
  )
}

