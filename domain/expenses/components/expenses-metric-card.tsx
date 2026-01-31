"use client"

import { MetricCard } from "@/components/shared/metric-card"
import { useExpensesMetrics } from "../api/use-expenses-metrics"
import { Wallet } from "lucide-react"

export function ExpensesMetricCard() {
  const { data } = useExpensesMetrics()

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
      title="Despesas do mês"
      value={formatCurrency(data.currentMonth)}
      change={`${data.change > 0 ? "+" : ""}${data.change}%`}
      changeType={data.changeType}
      previousPeriod={`${formatCurrency(data.previousMonth)} no mês passado`}
      icon={Wallet}
    />
  )
}

