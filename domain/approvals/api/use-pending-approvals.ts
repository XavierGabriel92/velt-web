"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import { PendingApproval } from "./types"

const MOCK_PENDING_APPROVALS: PendingApproval[] = [
  {
    id: "1",
    traveler: "Ana Silva",
    category: "Transporte",
    date: "15/09/2025",
    amount: 125.1,
  },
  {
    id: "2",
    traveler: "Carlos Santos",
    category: "Alimentação",
    date: "18/09/2025",
    amount: 320.05,
  },
  {
    id: "3",
    traveler: "Maria Oliveira",
    category: "Passagem",
    date: "20/09/2025",
    amount: 3150.99,
  },
  {
    id: "4",
    traveler: "Pedro Costa",
    category: "Outros",
    date: "22/09/2025",
    amount: 1990.76,
  },
  {
    id: "5",
    traveler: "Pedro Costa",
    category: "Alimentação",
    date: "22/09/2025",
    amount: 194.32,
  },
]

async function getPendingApprovals(): Promise<PendingApproval[]> {
  // Simular delay de rede
  await new Promise((resolve) => setTimeout(resolve, 500))
  return MOCK_PENDING_APPROVALS
}

export function usePendingApprovals() {
  return useSuspenseQuery({
    queryKey: ["pending-approvals"],
    queryFn: getPendingApprovals,
  })
}

