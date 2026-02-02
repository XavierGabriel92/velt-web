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
  updatedAt: string
}
