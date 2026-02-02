"use client"

import { Suspense } from "react"
import { FlightsMetricCard } from "@/domain/travels/components/flights-metric-card"
import { SearchTravelsAction } from "@/domain/travels/components/search-travels-action"
import { UpcomingTravelsList } from "@/domain/travels/components/upcoming-travels-list"
import { ExpensesMetricCard } from "@/domain/expenses/components/expenses-metric-card"
import { LogExpenseAction } from "@/domain/expenses/components/log-expense-action"
import { ReviewApprovalsAction } from "@/domain/approvals/components/review-approvals-action"
import { PendingApprovalsList } from "@/domain/approvals/components/pending-approvals-list"
import { SavingsMetricCard } from "@/domain/analytics/components/savings-metric-card"
import { PointsMetricCard } from "@/domain/rewards/components/points-metric-card"
import { MetricCardSkeleton } from "@/components/shared/metric-card-skeleton"
import { ListSkeleton } from "@/components/shared/list-skeleton"
import { QuickActionSkeleton } from "@/components/shared/quick-action-skeleton"
import { Plane, TrendingUp, Wallet, Star } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"

export default function Dashboard() {
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    const date = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
    setCurrentDate(date.toLocaleDateString("pt-BR", options).toUpperCase())
  }, [])

  const getUserName = () => {
    if (!user) return "Usuário"
    return user.firstName || "Usuário"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Olá, {getUserName()}</h1>
              <p className="text-muted-foreground max-w-2xl">
                Viajar a trabalho nunca foi tão simples: eficiência para a empresa,
                economia para o negócio e tranquilidade para você
              </p>
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              {currentDate}
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Suspense fallback={<MetricCardSkeleton title="Voos este mês" icon={Plane} />}>
            <FlightsMetricCard />
          </Suspense>
          <Suspense fallback={<MetricCardSkeleton title="Economia gerada" icon={TrendingUp} />}>
            <SavingsMetricCard />
          </Suspense>
          <Suspense fallback={<MetricCardSkeleton title="Despesas do mês" icon={Wallet} />}>
            <ExpensesMetricCard />
          </Suspense>
          <Suspense fallback={<MetricCardSkeleton title="Pontos acumulados" icon={Star} />}>
            <PointsMetricCard />
          </Suspense>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchTravelsAction />
            <Suspense fallback={<QuickActionSkeleton />}>
              <ReviewApprovalsAction />
            </Suspense>
            <LogExpenseAction />
          </div>
        </div>

        {/* Lists Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<ListSkeleton title="Próximas Viagens" />}>
            <UpcomingTravelsList />
          </Suspense>
          <Suspense fallback={<ListSkeleton title="Aprovações Pendentes" />}>
            <PendingApprovalsList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
