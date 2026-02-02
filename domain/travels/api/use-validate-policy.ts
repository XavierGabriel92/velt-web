"use client"

import { apiRequest } from "@/lib/api"
import type {
  ValidatePolicyRequest,
  PolicyValidationResultDto,
} from "./types"

export async function validateItemAgainstPolicy(
  data: ValidatePolicyRequest
): Promise<PolicyValidationResultDto> {
  return apiRequest<PolicyValidationResultDto>("/api/approvalpolicies/validate", {
    method: "POST",
    body: JSON.stringify({
      companyId: data.companyId,
      productType: data.productType,
      userId: data.userId,
      price: data.price,
      deadlineDate: data.deadlineDate ?? undefined,
      travelerIds: data.travelerIds ?? undefined,
      isRoundTrip: data.isRoundTrip ?? undefined,
    }),
  })
}
