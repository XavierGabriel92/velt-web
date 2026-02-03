/**
 * Tipo unificado para linhas da tabela de aprovações.
 * Usado tanto na aba Viagens quanto na aba Relatórios de despesas.
 */
export interface ApprovalRowItem {
  id: string
  label: string
  amount: number
  /** Para viagens: travelItemId + travelerId. Para reembolso: reimbursementRequestId */
  meta?: Record<string, string>
}

export interface ApprovalRow {
  id: string
  type: "travel" | "reimbursement"
  collaborator: string
  report: string
  itemsCount: number
  totalValue: number
  status: "Pendente" | "Aprovado" | "Rejeitado"
  items: ApprovalRowItem[]
  canApprove: boolean
  /** Para ações de aprovar/rejeitar viagem */
  travelId?: string
  travelItemId?: string
  travelerId?: string
  /** Para ações de aprovar/rejeitar reembolso */
  reimbursementRequestId?: string
}
