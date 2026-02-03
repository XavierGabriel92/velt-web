"use client"

import { use } from "react"
import Link from "next/link"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { TravelReportDetail } from "@/domain/travel-reports/components/travel-report-detail"
import { TravelReportDetailSkeleton } from "@/domain/travel-reports/components/travel-report-detail-skeleton"

export default function RelatorioViagemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ solicitacao?: string }>
}) {
  const { id } = use(params)
  const { solicitacao } = use(searchParams)

  return (
    <div className="min-h-screen bg-[#FCFCFA]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" className="-ml-2" asChild>
            <Link href="/inicio/viagens?tab=minhas">← Minhas Viagens</Link>
          </Button>
        </div>
        <Suspense fallback={<TravelReportDetailSkeleton />}>
          <TravelReportDetail
            reportId={id}
            solicitacaoEmFocoId={solicitacao ?? null}
          />
        </Suspense>
      </div>
    </div>
  )
}
