"use client"

import { useRouter } from "next/navigation"
import { Plane, Calendar, Users } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLastSearches } from "../api/use-last-searches"
import type { LastFlightSearch } from "../api/types"

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  } catch {
    return dateStr
  }
}

function formatPassengers(search: LastFlightSearch) {
  const total = search.adults + (search.children ?? 0) + (search.infants ?? 0)
  return total === 1 ? "1 passageiro" : `${total} passageiros`
}

function getRouteLabel(search: LastFlightSearch) {
  return `${search.origin} - ${search.destination}`
}

interface LastSearchesCardProps {
  onSelect: (search: LastFlightSearch) => void
}

export function LastSearchesCard({ onSelect }: LastSearchesCardProps) {
  const router = useRouter()
  const { searches } = useLastSearches()

  const handleSearch = (search: LastFlightSearch) => {
    const params = new URLSearchParams({
      origin: search.origin,
      destination: search.destination,
      departureDate: search.departureDate,
      tripType: search.tripType,
      adults: search.adults.toString(),
      cabinClass: search.cabinClass,
    })
    if (search.returnDate) params.set("returnDate", search.returnDate)
    if (search.children) params.set("children", search.children.toString())
    if (search.infants) params.set("infants", (search.infants ?? 0).toString())
    if (search.travelerIds?.length)
      params.set("travelerIds", search.travelerIds.join(","))

    router.push(`/inicio/viagens/busca?${params.toString()}`)
  }

  if (searches.length === 0) {
    return null
  }

  return (
    <Card className="bg-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] rounded-2xl border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-normal text-[#1E293B]">
          Últimas Pesquisas
        </CardTitle>
        <CardDescription className="text-base text-[#64748B]">
          Acesse rapidamente suas pesquisas recentes ou edite-as
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {searches.map((search) => (
            <div
              key={`${search.origin}-${search.destination}-${search.departureDate}-${search.createdAt}`}
              className="flex items-center justify-between p-4 border border-[#F3F4F6] rounded-3xl"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#DBEAFE] shrink-0">
                  <Plane className="h-6 w-6 text-[#155DFC]" />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="font-semibold text-base text-[#1E293B]">
                    {search.origin} → {search.destination}
                  </div>
                  <div className="text-base text-[#64748B]">
                    {getRouteLabel(search)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#64748B]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(search.departureDate)}
                      {search.returnDate && ` - ${formatDate(search.returnDate)}`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {formatPassengers(search)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onSelect(search)}
                  className="border-[#FF6600] text-[#FF6600] hover:bg-[#FF6600]/10 hover:text-[#FF6600]"
                >
                  Selecionar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleSearch(search)}
                  className="bg-[#FF6600] hover:bg-[#FF6600]/90 text-white"
                >
                  Buscar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
