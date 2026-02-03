"use client"

import { useMutation } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import type {
  ConfirmFlightRequest,
  ConfirmFlightResponse,
  InitiatePaymentResponse,
} from "./types"

export type ConfirmFlightResult =
  | { kind: "travel"; data: ConfirmFlightResponse }
  | { kind: "payment"; data: InitiatePaymentResponse }

async function confirmFlight(
  request: ConfirmFlightRequest
): Promise<ConfirmFlightResult> {
  const raw = await apiRequest<ConfirmFlightResponse | InitiatePaymentResponse>(
    "/api/flight-search/confirm-flight",
    {
      method: "POST",
      body: JSON.stringify({
        searchSessionId: request.searchSessionId,
        selectedFlightId: request.selectedFlightId,
        returnFlightId: request.returnFlightId ?? undefined,
        travelerIds: request.travelerIds,
        companyId: request.companyId,
        travelReportId: request.travelReportId ?? undefined,
        costCenterId: request.costCenterId ?? undefined,
        title: request.title ?? undefined,
      }),
    }
  )
  const hasTravelId =
    raw != null &&
    (("travelId" in raw && (raw as ConfirmFlightResponse).travelId) ||
      ("TravelId" in raw && (raw as { TravelId?: string }).TravelId))
  if (hasTravelId) {
    const d = raw as Record<string, unknown>
    return {
      kind: "travel",
      data: {
        travelId: (d.travelId ?? d.TravelId) as string,
        travelItemId: (d.travelItemId ?? d.TravelItemId) as string,
        status: (d.status ?? d.Status) as string,
        requiresApproval: (d.requiresApproval ?? d.RequiresApproval) as boolean,
        validationViolations: (d.validationViolations ?? d.ValidationViolations) as
          | string[]
          | undefined,
        travelReportId: (d.travelReportId ?? d.TravelReportId) as string | undefined,
      },
    }
  }
  return { kind: "payment", data: raw as InitiatePaymentResponse }
}

export function useConfirmFlight() {
  return useMutation({
    mutationFn: confirmFlight,
  })
}
