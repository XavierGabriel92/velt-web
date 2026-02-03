"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import { toast } from "sonner"

interface RejectParams {
  travelId: string
  itemId: string
  travelerId: string
  reason: string
}

async function rejectTraveler({
  travelId,
  itemId,
  travelerId,
  reason,
}: RejectParams): Promise<void> {
  await apiRequest(`/api/approvals/travels/${travelId}/items/${itemId}/travelers/${travelerId}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  })
}

/**
 * Hook para rejeitar um viajante em um TravelItem.
 * Invalida o cache de aprovações pendentes ao suceder.
 */
export function useRejectTraveler() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rejectTraveler,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-approvals"] })
      toast.success("Solicitação rejeitada")
    },
    onError: (error) => {
      toast.error("Erro ao rejeitar", {
        description: error instanceof Error ? error.message : "Erro desconhecido",
      })
    },
  })
}
