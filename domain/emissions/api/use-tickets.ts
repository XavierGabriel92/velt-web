"use client"

import { apiRequest } from "@/lib/api"
import type { Ticket } from "./types"

function mapTicketFromApi(raw: Record<string, unknown>): Ticket {
  return {
    id: (raw.id ?? raw.Id) as string,
    travelItemId: (raw.travelItemId ?? raw.TravelItemId) as string,
    fileName: (raw.fileName ?? raw.FileName) as string,
    contentType: (raw.contentType ?? raw.ContentType) as string,
    fileSize: Number(raw.fileSize ?? raw.FileSize ?? 0),
    description: (raw.description ?? raw.Description) as string | undefined,
    uploadedAt: (raw.uploadedAt ?? raw.UploadedAt) as string,
    uploadedByUserName: (raw.uploadedByUserName ?? raw.UploadedByUserName) as string,
  }
}

/**
 * Busca tickets (bilhetes) de um TravelItem.
 * Usado para obter o ticketId e fileName para download/visualização.
 * Endpoint público que valida se o usuário tem acesso ao item.
 */
export async function getTicketsByTravelItemId(travelItemId: string): Promise<Ticket[]> {
  const raw = await apiRequest<Record<string, unknown>[]>(
    `/api/emissions/items/${encodeURIComponent(travelItemId)}/tickets`
  )
  return (raw ?? []).map(mapTicketFromApi)
}
