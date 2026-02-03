/** Estado da despesa (backend: ExpenseState) */
export type ExpenseState =
  | "Registrada"
  | "Aprovada"
  | "Cancelada"
  | "Rejeitada"

/** Origem da despesa (backend: ExpenseOrigin) */
export type ExpenseOrigin = "VeltSale" | "External" | "Imported"

/** Finalidade da despesa (backend: ExpensePurpose) */
export type ExpensePurpose = "Relatorio" | "Reembolso"

export interface ExpenseResponse {
  id: string
  companyId: string
  travelId?: string
  travelItemId?: string
  userId: string
  emissorId?: string
  /** Quem deve receber o reembolso: emissorId ?? userId */
  reimburseToUserId?: string
  /** Nome de quem solicitou/pagou (Solicitado por) */
  emissorName?: string
  valor: number
  costCenterId: string
  grupoDeDespesaId?: string
  comprovantesPath?: string
  origin: ExpenseOrigin
  purpose?: ExpensePurpose
  state: ExpenseState
  checkoutPaymentMethodSelected?: string
  description?: string
  expenseDate?: string
  category?: string
  createdAt: string
  updatedAt: string
  companyName?: string
  userName?: string
  costCenterName?: string
}

export interface ExpenseFilterRequest {
  companyId: string
  dateFrom?: string // ISO date or date-time
  dateTo?: string
  state?: ExpenseState
}

export interface CreateExpenseRequest {
  companyId: string
  userId: string
  valor: number
  costCenterId: string
  origin: ExpenseOrigin
  purpose?: ExpensePurpose
  travelId?: string
  travelItemId?: string
  description?: string
  expenseDate?: string
  category?: string
  checkoutPaymentMethodSelected?: string
}

export interface UpdateExpenseRequest {
  valor: number
  costCenterId: string
  description?: string
  expenseDate?: string
  category?: string
  userId?: string
  userIds?: string[]
}

export interface ExpensesMetrics {
  currentMonth: number
  previousMonth: number
  change: number
  changeType: "positive" | "negative"
}
