"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"

async function deleteExpense(expenseId: string): Promise<void> {
  await apiRequest(`/api/expenses/${encodeURIComponent(expenseId)}`, {
    method: "DELETE",
  })
}

export function useDeleteExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] })
      queryClient.invalidateQueries({ queryKey: ["travel-reports"] })
    },
  })
}
