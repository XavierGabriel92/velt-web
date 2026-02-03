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
    <></>
  )
}
