"use client"

import { MetricCard } from "@/components/shared/metric-card"
import { useFlightsMetrics } from "../api/use-flights-metrics"
import { Plane } from "lucide-react"

export function FlightsMetricCard() {
  const { data } = useFlightsMetrics()

  return (
    <MetricCard
      title="Voos este mês"
      value={data.currentMonth.toString()}
      change={`${data.change > 0 ? "+" : ""}${data.change}%`}
      changeType={data.changeType}
      previousPeriod={`${data.previousMonth} no mês passado`}
      icon={Plane}
    />
  )
}

