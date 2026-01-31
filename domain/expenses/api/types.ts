export interface ExpensesMetrics {
  currentMonth: number
  previousMonth: number
  change: number
  changeType: "positive" | "negative"
}

