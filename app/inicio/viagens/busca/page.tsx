"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Plane } from "lucide-react"

export default function BuscaVoosPage() {
  const searchParams = useSearchParams()

  const origin = searchParams.get("origin") ?? "-"
  const destination = searchParams.get("destination") ?? "-"
  const departureDate = searchParams.get("departureDate") ?? "-"
  const returnDate = searchParams.get("returnDate") ?? "-"
  const tripType = searchParams.get("tripType") ?? "-"
  const adults = searchParams.get("adults") ?? "-"
  const children = searchParams.get("children") ?? "0"
  const infants = searchParams.get("infants") ?? "0"
  const cabinClass = searchParams.get("cabinClass") ?? "-"
  const travelerIds = searchParams.get("travelerIds") ?? "-"

  return (
    <div className="min-h-screen bg-[#FCFCFA]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <Card className="bg-white shadow-sm rounded-2xl max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#DBEAFE]">
                <Plane className="h-6 w-6 text-[#155DFC]" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-[#1E293B]">
                  Resultados da Busca
                </h1>
                <p className="text-sm text-[#64748B]">
                  Página em construção
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-[#64748B]">
              A página de resultados de voos será implementada em breve.
            </p>
            <div className="rounded-xl bg-[#F7F4F5] p-4 text-sm text-[#1E293B] space-y-2">
              <p><strong>Origem:</strong> {origin}</p>
              <p><strong>Destino:</strong> {destination}</p>
              <p><strong>Ida:</strong> {departureDate}</p>
              {returnDate !== "-" && (
                <p><strong>Volta:</strong> {returnDate}</p>
              )}
              <p><strong>Tipo:</strong> {tripType === "RoundTrip" ? "Ida e volta" : "Só ida"}</p>
              <p><strong>Passageiros:</strong> {adults} adulto(s), {children} criança(s), {infants} bebê(s)</p>
              <p><strong>Classe:</strong> {cabinClass === "Economy" ? "Econômica" : "Executiva"}</p>
              {travelerIds !== "-" && (
                <p><strong>Viajantes:</strong> {travelerIds}</p>
              )}
            </div>
            <Button asChild className="bg-[#1E293B] hover:bg-[#334155]">
              <Link href="/inicio/viagens">Nova busca</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
