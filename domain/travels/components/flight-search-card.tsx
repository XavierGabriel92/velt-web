"use client"

import { Plane } from "lucide-react"
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
      <CardContent>
        <FlightSearchForm initialValues={initialValues} />
      </CardContent>
    </Card>
  )
}
