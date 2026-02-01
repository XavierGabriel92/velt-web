/**
 * Dados mockados para testar a experiência de cada cenário da lista de aprovações.
 *
 * Cenários (baseado na hierarquia: User 2 aprova User 1, User 4 aprova User 2, User 4 aprova User 1 e User 3 por herança):
 *
 * - Cenário 1 (User 1): Viajante. Vê suas aprovações pendentes, ícone sino, tooltip com aprovadores.
 * - Cenário 2 (User 2): Aprovador E viajante. Vê itens de User 1 (destacados, Check/X) + seus próprios (sino).
 * - Cenário 3 (User 3): Viajante sem subordinados. Similar ao User 1.
 * - Cenário 4 (User 4): Aprovador de todos. Vê itens de User 1, 2 e 3 com Check/X. Destaca onde é aprovador direto.
 */

import type { PendingApproval } from "./types"

const baseDate = new Date().toISOString()

/** Cenário 1: User 1 (viajante) - apenas itens aguardando aprovação do aprovador dele */
export const MOCK_SCENARIO_1: PendingApproval[] = [
  {
    viewContext: "my_pending_as_traveler",
    travelId: "trav-1",
    travelItemId: "item-1",
    travelerId: "user-1",
    travelerName: "User 1",
    productType: "Aereo",
    productName: "Passagem GRU-SSA",
    category: "Passagem",
    date: "15/01/2026",
    amount: 1549.9,
    violations: [],
    pendingSince: baseDate,
    canApprove: false,
    isEmergencyApproval: false,
    directApproverName: "User 2",
    allApprovers: [
      { approverId: "user-2", approverName: "User 2", level: 1 },
      { approverId: "user-4", approverName: "User 4", level: 2 },
    ],
  },
  {
    viewContext: "my_pending_as_traveler",
    travelId: "trav-1",
    travelItemId: "item-2",
    travelerId: "user-1",
    travelerName: "User 1",
    productType: "Hotel",
    productName: "Hotel Ibis Centro",
    category: "Hotel",
    date: "18/01/2026",
    amount: 820.0,
    violations: [],
    pendingSince: baseDate,
    canApprove: false,
    isEmergencyApproval: false,
    directApproverName: "User 2",
    allApprovers: [
      { approverId: "user-2", approverName: "User 2", level: 1 },
      { approverId: "user-4", approverName: "User 4", level: 2 },
    ],
  },
]

/** Cenário 2: User 2 (aprovador de User 1 E viajante) */
export const MOCK_SCENARIO_2: PendingApproval[] = [
  {
    viewContext: "awaiting_my_approval",
    travelId: "trav-1",
    travelItemId: "item-1",
    travelerId: "user-1",
    travelerName: "User 1",
    productType: "Aereo",
    productName: "Passagem GRU-SSA",
    category: "Passagem",
    date: "15/01/2026",
    amount: 1549.9,
    violations: [],
    pendingSince: baseDate,
    canApprove: true,
    isEmergencyApproval: false,
    directApproverName: "User 2",
    isCurrentUserDirectApprover: true,
  },
  {
    viewContext: "awaiting_my_approval",
    travelId: "trav-1",
    travelItemId: "item-2",
    travelerId: "user-1",
    travelerName: "User 1",
    productType: "Hotel",
    productName: "Hotel Ibis Centro",
    category: "Hotel",
    date: "18/01/2026",
    amount: 820.0,
    violations: [],
    pendingSince: baseDate,
    canApprove: true,
    isEmergencyApproval: false,
    directApproverName: "User 2",
    isCurrentUserDirectApprover: true,
  },
  {
    viewContext: "my_pending_as_traveler",
    travelId: "trav-2",
    travelItemId: "item-3",
    travelerId: "user-2",
    travelerName: "User 2",
    productType: "Aereo",
    productName: "Passagem CGH-REC",
    category: "Passagem",
    date: "20/01/2026",
    amount: 2180.5,
    violations: [],
    pendingSince: baseDate,
    canApprove: false,
    isEmergencyApproval: false,
    directApproverName: "User 4",
    allApprovers: [
      { approverId: "user-4", approverName: "User 4", level: 1 },
    ],
  },
]

/** Cenário 3: User 3 (viajante, sem subordinados) */
export const MOCK_SCENARIO_3: PendingApproval[] = [
  {
    viewContext: "my_pending_as_traveler",
    travelId: "trav-3",
    travelItemId: "item-4",
    travelerId: "user-3",
    travelerName: "User 3",
    productType: "AluguelCarro",
    productName: "Aluguel Fiat Argo",
    category: "Aluguel de carro",
    date: "22/01/2026",
    amount: 456.0,
    violations: [],
    pendingSince: baseDate,
    canApprove: false,
    isEmergencyApproval: false,
    directApproverName: "User 4",
    allApprovers: [
      { approverId: "user-4", approverName: "User 4", level: 1 },
    ],
  },
]

/** Cenário 4: User 4 (aprovador de todos - destaca onde é aprovador direto) */
export const MOCK_SCENARIO_4: PendingApproval[] = [
  {
    viewContext: "awaiting_my_approval",
    travelId: "trav-1",
    travelItemId: "item-1",
    travelerId: "user-1",
    travelerName: "User 1",
    productType: "Aereo",
    productName: "Passagem GRU-SSA",
    category: "Passagem",
    date: "15/01/2026",
    amount: 1549.9,
    violations: [],
    pendingSince: baseDate,
    canApprove: true,
    isEmergencyApproval: false,
    directApproverName: "User 2",
    isCurrentUserDirectApprover: false,
  },
  {
    viewContext: "awaiting_my_approval",
    travelId: "trav-2",
    travelItemId: "item-3",
    travelerId: "user-2",
    travelerName: "User 2",
    productType: "Aereo",
    productName: "Passagem CGH-REC",
    category: "Passagem",
    date: "20/01/2026",
    amount: 2180.5,
    violations: [],
    pendingSince: baseDate,
    canApprove: true,
    isEmergencyApproval: false,
    directApproverName: "User 4",
    isCurrentUserDirectApprover: true,
  },
  {
    viewContext: "awaiting_my_approval",
    travelId: "trav-3",
    travelItemId: "item-4",
    travelerId: "user-3",
    travelerName: "User 3",
    productType: "AluguelCarro",
    productName: "Aluguel Fiat Argo",
    category: "Aluguel de carro",
    date: "22/01/2026",
    amount: 456.0,
    violations: [],
    pendingSince: baseDate,
    canApprove: true,
    isEmergencyApproval: false,
    directApproverName: "User 4",
    isCurrentUserDirectApprover: true,
  },
]

export const MOCK_SCENARIOS = {
  1: MOCK_SCENARIO_1,
  2: MOCK_SCENARIO_2,
  3: MOCK_SCENARIO_3,
  4: MOCK_SCENARIO_4,
} as const

export type MockScenarioId = keyof typeof MOCK_SCENARIOS
