/**
 * Contexto de exibição do item na lista de aprovações pendentes.
 * - awaiting_my_approval: itens que o usuário pode aprovar (é aprovador).
 * - my_pending_as_traveler: itens onde o usuário é viajante aguardando aprovação.
 */
export type PendingItemViewContext = "awaiting_my_approval" | "my_pending_as_traveler"

/**
 * Informação de um aprovador para exibição em tooltip.
 * Usado para mostrar a lista de aprovadores quando o usuário é viajante.
 */
export interface ApproverInfoDto {
  approverId: string
  approverName: string
  /** 1 = direto, 2+ = herança vertical */
  level: number
}

/**
 * Item de aprovação pendente na lista unificada.
 * Pode ser exibido em dois contextos conforme viewContext.
 */
export interface PendingApproval {
  viewContext: PendingItemViewContext
  travelId: string
  travelItemId: string
  travelerId: string
  travelerName: string
  productType: string
  productName: string
  /** Categoria amigável (ex: "Passagem", "Hotel") - mapeado de productType */
  category: string
  /** Data formatada para exibição (pendingSince) */
  date: string
  amount: number
  violations: string[]
  pendingSince: string
  canApprove: boolean
  isEmergencyApproval: boolean
  directApproverId?: string
  directApproverName?: string
  /** True quando o usuário logado é o aprovador direto - destacar na UI */
  isCurrentUserDirectApprover?: boolean
  /** Lista completa de aprovadores para tooltip (apenas em my_pending_as_traveler) */
  allApprovers?: ApproverInfoDto[]
}

/**
 * Resposta paginada da API de aprovações pendentes.
 */
export interface PagedPendingApprovals {
  items: PendingApproval[]
  totalCount: number
  page: number
  pageSize: number
}
