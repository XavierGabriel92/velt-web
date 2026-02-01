"use client"

import { Plane, Briefcase } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { FlightSearchForm } from "./flight-search-form"
import type { FlightSearchParams } from "../api/types"

interface FlightSearchCardProps {
  initialValues?: Partial<FlightSearchParams>
}

export function FlightSearchCard({ initialValues }: FlightSearchCardProps) {
  return (
    <Card className="bg-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] rounded-2xl border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FF3C00]">
            <Plane className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-2xl font-normal text-[#1E293B]">
            Planejamento de Viagens Corporativas
          </CardTitle>
        </div>
        <CardDescription className="text-lg text-[#64748B]">
          Reserve voos e hospedagem para suas viagens de negócios
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Tabs - largura igual */}
        <div className="flex p-1 gap-1 bg-[#F7F4F5] rounded-full">
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#1E293B] text-white text-sm font-medium rounded-full"
          >
            <Plane className="h-4 w-4" />
            Buscar Voos
          </button>
          <button
            type="button"
            disabled
            className="flex-1 flex items-center justify-center gap-2 py-2 text-[#1E293B] text-sm font-medium rounded-full opacity-60 cursor-not-allowed"
          >
            <Briefcase className="h-4 w-4" />
            Minhas Viagens
          </button>
        </div>

        <FlightSearchForm initialValues={initialValues} />
      </CardContent>
    </Card>
  )
}
