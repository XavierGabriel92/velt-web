/** Estado da solicitação de reembolso (backend: ReimbursementRequest.State) */
export type ReimbursementRequestState = "Pending" | "Approved" | "Rejected"

export interface CreateReimbursementRequestRequest {
  expenseId: string
  declaredPaidWithPersonalFunds: boolean
}

export interface ReimbursementRequestResponse {
  id: string
  expenseId: string
  state: ReimbursementRequestState
  approvedByUserId?: string
  rejectedByUserId?: string
  rejectionReason?: string
  approvedAt?: string
  declaredPaidWithPersonalFunds: boolean
  createdAt: string
  updatedAt?: string
  /** Preenchido quando a listagem inclui a despesa (ex.: listagem por usuário). */
  expenseDescription?: string
  /** Preenchido quando a listagem inclui a despesa (ex.: listagem por usuário). */
  expenseAmount?: number
  /** ID do solicitante. Preenchido na listagem para aprovador. */
  requesterUserId?: string
  /** Nome do solicitante. Preenchido na listagem para aprovador. */
  requesterUserName?: string
  /** ID do TravelReport que contém a despesa, quando aplicável. */
  travelReportId?: string
  /** Título do TravelReport, quando aplicável. */
  travelReportTitle?: string
}
