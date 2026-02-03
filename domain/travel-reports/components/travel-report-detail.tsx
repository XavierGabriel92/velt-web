"use client"

import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Plane,
  Bed,
  DollarSign,
  FileText,
  MapPin,
  Calendar,
  User,
  Eye,
  Download,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import { useTravelReportById } from "../api/use-travel-reports"
import { useTravelsByReportId } from "@/domain/travels/api/use-travels-by-report-id"
import type { TravelResponse, TravelItemResponse } from "@/domain/travels/api/types"
import { cn } from "@/lib/utils"

const STATUS_LABELS: Record<string, string> = {
  AguardandoAprovacao: "Aguardando aprovação",
  PartiallyApproved: "Parcialmente aprovada",
  ReadyForPurchase: "Em emissão",
  EmProcessoDeCompra: "Em processo",
  Comprada: "Confirmada",
  Rejeitada: "Rejeitada",
  Cancelada: "Cancelada",
  Aprovada: "Confirmada",
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value)
}

function getStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status
}

function getStatusVariant(status: string): string {
  if (status === "Comprada" || status === "Aprovada" || status === "ReadyForPurchase")
    return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
  if (status === "Rejeitada" || status === "Cancelada")
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
  if (status === "AguardandoAprovacao" || status === "PartiallyApproved")
    return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
  return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
}

interface TravelReportDetailProps {
  reportId: string
  /** ID da solicitação (Travel) em foco para o cabeçalho e grid */
  solicitacaoEmFocoId?: string | null
}

export function TravelReportDetail({ reportId, solicitacaoEmFocoId }: TravelReportDetailProps) {
  const { data: report, isLoading: reportLoading, error: reportError } = useTravelReportById(reportId)
  const { data: travels, isLoading: travelsLoading } = useTravelsByReportId(reportId)

  const focusedTravelId = useMemo(() => {
    if (!travels?.length) return null
    if (solicitacaoEmFocoId && travels.some((t) => t.id === solicitacaoEmFocoId))
      return solicitacaoEmFocoId
    return travels[0].id
  }, [travels, solicitacaoEmFocoId])

  if (reportLoading || reportError) {
    if (reportError) {
      return (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">Relatório não encontrado.</p>
            <Button asChild variant="outline">
              <Link href="/inicio/viagens?tab=minhas">Ver Minhas Viagens</Link>
            </Button>
          </CardContent>
        </Card>
      )
    }
    return null
  }

  if (!report) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground mb-4">Relatório não encontrado.</p>
          <Button asChild variant="outline">
            <Link href="/inicio/viagens?tab=minhas">Ver Minhas Viagens</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho do relatório (só dados do relatório) */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin className="size-4 shrink-0" />
          {report.companyName}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="size-4 shrink-0" />
          {formatDate(report.startDate)} - {formatDate(report.endDate)}
        </span>
      </div>

      {/* Lista de solicitações: cada item expande no lugar */}
      {travels && travels.length > 0 && (
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Solicitações</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-2">
              {travels.map((t) => {
                const isExpanded = t.id === focusedTravelId
                const flightItems = t.items?.filter((i) => i.productType === "Aereo") ?? []
                const hotelItems = t.items?.filter((i) => i.productType === "Hotel") ?? []
                const docCount = flightItems.length + hotelItems.length
                return (
                  <li key={t.id} className="rounded-lg border overflow-hidden">
                    {isExpanded ? (
                      <Link
                        href={`/inicio/viagens/relatorio/${reportId}`}
                        className="flex items-center justify-between gap-2 p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{t.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(report.startDate)} - {formatDate(report.endDate)} · {t.userName}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {flightItems.length} voos, {hotelItems.length} hospedagem
                          </p>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 px-2 py-1 rounded-full text-xs font-medium",
                            getStatusVariant(t.status)
                          )}
                        >
                          {getStatusLabel(t.status)}
                        </span>
                        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                      </Link>
                    ) : (
                      <Link
                        href={`/inicio/viagens/relatorio/${reportId}?solicitacao=${t.id}`}
                        className="flex items-center justify-between gap-2 p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{t.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(report.startDate)} - {formatDate(report.endDate)} · {t.userName}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {flightItems.length} voos, {hotelItems.length} hospedagem
                          </p>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 px-2 py-1 rounded-full text-xs font-medium",
                            getStatusVariant(t.status)
                          )}
                        >
                          {getStatusLabel(t.status)}
                        </span>
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                      </Link>
                    )}
                    {isExpanded && (
                      <div className="border-t bg-muted/20 px-4 pb-4 pt-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="border">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center gap-2">
                                <Plane className="size-5 text-[#FF3C00]" />
                                Voos
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {flightItems.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Nenhum voo</p>
                              ) : (
                                flightItems.map((item) => <FlightRow key={item.id} item={item} />)
                              )}
                            </CardContent>
                          </Card>
                          <Card className="border">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center gap-2">
                                <Bed className="size-5 text-[#FF3C00]" />
                                Hospedagem
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {hotelItems.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Nenhuma hospedagem</p>
                              ) : (
                                hotelItems.map((item) => (
                                  <div key={item.id} className="flex justify-between items-start gap-2 text-sm">
                                    <div>
                                      <p className="font-medium">{item.productName}</p>
                                      {item.deadlineDate && (
                                        <p className="text-muted-foreground text-xs mt-0.5">
                                          {formatDate(item.deadlineDate)}
                                        </p>
                                      )}
                                    </div>
                                    <span className="font-medium shrink-0">
                                      {formatCurrency(Number(item.totalPrice))}
                                    </span>
                                  </div>
                                ))
                              )}
                            </CardContent>
                          </Card>
                          <Card className="border">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center gap-2">
                                <DollarSign className="size-5 text-[#FF3C00]" />
                                Despesas
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {(report.expensesCount ?? 0) === 0 ? (
                                <p className="text-sm text-muted-foreground">Nenhuma despesa</p>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  {report.expensesCount} despesa(s) vinculada(s)
                                </p>
                              )}
                            </CardContent>
                          </Card>
                          <Card className="border">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center gap-2">
                                <FileText className="size-5 text-[#FF3C00]" />
                                Documentos
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {docCount === 0 ? (
                                <p className="text-sm text-muted-foreground">Nenhum documento</p>
                              ) : (
                                <>
                                  {flightItems.map((item) => (
                                    <DocumentRow
                                      key={item.id}
                                      name={`E-ticket - ${item.productName}`}
                                      date={item.createdAt}
                                      travelItemId={item.id}
                                    />
                                  ))}
                                  {hotelItems.map((item) => (
                                    <DocumentRow
                                      key={item.id}
                                      name={`Voucher - ${item.productName}`}
                                      date={item.createdAt}
                                      travelItemId={item.id}
                                    />
                                  ))}
                                </>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>
      )}

      {travelsLoading && travels === undefined && (
        <div className="flex justify-center py-8">
          <p className="text-sm text-muted-foreground">Carregando solicitações...</p>
        </div>
      )}
    </div>
  )
}

function FlightRow({ item }: { item: TravelItemResponse }) {
  return (
    <div className="flex justify-between items-start gap-2 text-sm border-b pb-2 last:border-0 last:pb-0">
      <div>
        <p className="font-medium">{item.productName}</p>
        {item.deadlineDate && (
          <p className="text-muted-foreground text-xs mt-0.5">
            {formatDate(item.deadlineDate)}
          </p>
        )}
      </div>
      <div className="text-right shrink-0">
        <span className="font-medium">{formatCurrency(Number(item.totalPrice))}</span>
      </div>
    </div>
  )
}

function DocumentRow({
  name,
  date,
  travelItemId,
}: {
  name: string
  date: string
  travelItemId: string
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasTickets, setHasTickets] = useState<boolean | null>(null)

  // Verificar se há tickets disponíveis ao montar o componente
  useEffect(() => {
    async function checkTickets() {
      try {
        const { getTicketsByTravelItemId } = await import("@/domain/emissions/api/use-tickets")
        const tickets = await getTicketsByTravelItemId(travelItemId)
        setHasTickets(tickets.length > 0)
      } catch (err) {
        console.error("Erro ao verificar tickets:", err)
        setHasTickets(false)
      }
    }
    checkTickets()
  }, [travelItemId])

  const handleView = async () => {
    if (!travelItemId || !hasTickets) return
    setIsLoading(true)
    try {
      const { getTicketsByTravelItemId } = await import("@/domain/emissions/api/use-tickets")
      const { handleViewTicket } = await import("@/domain/emissions/api/use-download-ticket")
      const tickets = await getTicketsByTravelItemId(travelItemId)
      if (tickets.length === 0) return
      await handleViewTicket(tickets[0].id)
    } catch (err) {
      console.error("Erro ao visualizar documento:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!travelItemId || !hasTickets) return
    setIsLoading(true)
    try {
      const { getTicketsByTravelItemId } = await import("@/domain/emissions/api/use-tickets")
      const { handleDownloadTicket } = await import("@/domain/emissions/api/use-download-ticket")
      const tickets = await getTicketsByTravelItemId(travelItemId)
      if (tickets.length === 0) return
      await handleDownloadTicket(tickets[0].id, tickets[0].fileName)
    } catch (err) {
      console.error("Erro ao baixar documento:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const isDisabled = hasTickets === null || !hasTickets || isLoading

  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{name}</p>
        <p className="text-xs text-muted-foreground">{formatDate(date)}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label="Visualizar"
          onClick={handleView}
          disabled={isDisabled}
        >
          <Eye className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label="Download"
          onClick={handleDownload}
          disabled={isDisabled}
        >
          <Download className="size-4" />
        </Button>
      </div>
    </div>
  )
}
