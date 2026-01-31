"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import { UpcomingTravel } from "./types"

const MOCK_UPCOMING_TRAVELS: UpcomingTravel[] = [
  {
    id: "1",
    traveler: "Ana Silva",
    destination: "Rio de Janeiro",
    date: "15/01/2026",
    status: "Aprovado",
  },
  {
    id: "2",
    traveler: "Carlos Santos",
    destination: "Brasília",
    date: "20/01/2026",
    status: "Pendente",
  },
  {
    id: "3",
    traveler: "Maria Oliveira",
    destination: "Salvador",
    date: "25/01/2026",
    status: "Aprovado",
  },
  {
    id: "4",
    traveler: "João Pereira",
    destination: "Curitiba",
    date: "28/01/2026",
    status: "Aprovado",
  },
]

async function getUpcomingTravels(): Promise<UpcomingTravel[]> {
  // Simular delay de rede
  await new Promise((resolve) => setTimeout(resolve, 4000))
  return MOCK_UPCOMING_TRAVELS
}

export function useUpcomingTravels() {
  return useSuspenseQuery({
    queryKey: ["upcoming-travels"],
    queryFn: getUpcomingTravels,
  })
}

