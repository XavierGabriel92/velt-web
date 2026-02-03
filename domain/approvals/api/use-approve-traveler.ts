"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import { toast } from "sonner"

interface ApproveParams {
  travelId: string
  itemId: string
  travelerId: string
  comments?: string
}

async function approveTraveler({
  travelId,
  itemId,
  travelerId,
  comments,
}: ApproveParams): Promise<void> {
  await apiRequest(`/api/approvals/travels/${travelId}/items/${itemId}/travelers/${travelerId}/approve`, {
    method: "POST",
    body: JSON.stringify({ comments: comments ?? "" }),
  })
}

/**
 * Hook para aprovar um viajante em um TravelItem.
 * Invalida o cache de aprovações pendentes ao suceder.
 */
export function useApproveTraveler() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: approveTraveler,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-approvals"] })
      toast.success("Aprovação realizada com sucesso")
    },
    onError: (error) => {
      toast.error("Erro ao aprovar", {
        description: error instanceof Error ? error.message : "Erro desconhecido",
      })
    },
  })
}
