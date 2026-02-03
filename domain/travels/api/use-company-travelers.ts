"use client"

import { useQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import type { Traveler } from "./types"

async function getUsersByCompany(companyId: string): Promise<Traveler[]> {
  const users = await apiRequest<Traveler[]>(`/api/users/by-company/${companyId}`)
  return users
}

export function useCompanyTravelers() {
  const { selectedCompany, user } = useAuth()
  const isB2C = selectedCompany?.companyName === "B2C Consumer"

  const query = useQuery({
    queryKey: ["company-travelers", selectedCompany?.companyId],
    queryFn: () =>
      getUsersByCompany(selectedCompany!.companyId),
    enabled: !!selectedCompany?.companyId && !isB2C,
  })

  // For B2C Consumer, return only the logged-in user as traveler
  if (isB2C && user) {
    return {
      data: [
        {
          id: user.userId,
          firstName: user.firstName || "Eu",
          lastName: user.lastName || "",
          email: user.email || "",
        },
      ],
      isLoading: false,
      error: null,
      refetch: () => Promise.resolve(),
    }
  }

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
