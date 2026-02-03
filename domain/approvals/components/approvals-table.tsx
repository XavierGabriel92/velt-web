"use client"

import React, { useState } from "react"
import { ChevronDown, ChevronRight, Eye, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ApprovalRow, ApprovalRowItem } from "../api/approval-row-types"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function StatusPill({ status }: { status: ApprovalRow["status"] }) {
  const styles = {
    Pendente:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    Aprovado:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    Rejeitado:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  }
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
        styles[status]
      )}
    >
      {status}
    </span>
  )
}

interface ApprovalsTableProps {
  rows: ApprovalRow[]
  onApproveItem?: (row: ApprovalRow, item: ApprovalRowItem) => void
  onRejectItem?: (row: ApprovalRow, item: ApprovalRowItem, reason?: string) => void
  onView?: (row: ApprovalRow) => void
  isApproving?: boolean
  isRejecting?: boolean
  emptyMessage?: string
}

export function ApprovalsTable({
  rows,
  onApproveItem,
  onRejectItem,
  onView,
  isApproving = false,
  isRejecting = false,
  emptyMessage = "Nenhum item para exibir",
}: ApprovalsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (rows.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          {emptyMessage}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="w-8 py-2 px-2 text-left"></th>
              <th className="py-2 px-3 text-left font-medium">Colaborador</th>
              <th className="py-2 px-3 text-left font-medium">Relatório</th>
              <th className="py-2 px-3 text-left font-medium">Itens</th>
              <th className="py-2 px-3 text-left font-medium">Valor Total</th>
              <th className="py-2 px-3 text-left font-medium">Status</th>
              <th className="py-2 px-3 text-left font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isExpanded = expandedId === row.id
              const hasItems = row.items.length > 0

              return (
                <React.Fragment key={row.id}>
                  <tr
                    className="border-b last:border-0 hover:bg-muted/30"
                  >
                    <td className="py-2 px-2">
                      {hasItems && (
                        <button
                          type="button"
                          className="p-1 rounded hover:bg-muted"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : row.id)
                          }
                          aria-expanded={isExpanded}
                        >
                          {isExpanded ? (
                            <ChevronDown className="size-4" />
                          ) : (
                            <ChevronRight className="size-4" />
                          )}
                        </button>
                      )}
                    </td>
                    <td className="py-2 px-3">{row.collaborator}</td>
                    <td className="py-2 px-3">{row.report}</td>
                    <td className="py-2 px-3">{row.itemsCount} item(ns)</td>
                    <td className="py-2 px-3">{formatCurrency(row.totalValue)}</td>
                    <td className="py-2 px-3">
                      <StatusPill status={row.status} />
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1">
                        {onView && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => onView(row)}
                            aria-label="Ver detalhes"
                          >
                            <Eye className="size-4" />
                          </Button>
                        )}
                        {row.canApprove && row.status === "Pendente" && (
                          <>
                            {onApproveItem && row.items.length > 0 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/50"
                                onClick={() =>
                                  onApproveItem(row, row.items[0])
                                }
                                disabled={isApproving || isRejecting}
                                aria-label="Aprovar"
                              >
                                <Check className="size-4" />
                              </Button>
                            )}
                            {onRejectItem && row.items.length > 0 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50"
                                onClick={() =>
                                  onRejectItem(row, row.items[0])
                                }
                                disabled={isApproving || isRejecting}
                                aria-label="Rejeitar"
                              >
                                <X className="size-4" />
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  {isExpanded && hasItems && (
                    <tr>
                      <td colSpan={7} className="bg-muted/20 p-0">
                        <div className="px-4 py-3 border-t">
                          <p className="text-xs font-medium text-muted-foreground mb-2">
                            Itens
                          </p>
                          <div className="space-y-2">
                            {row.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between py-2 px-3 rounded-lg bg-background border"
                              >
                                <div>
                                  <p className="font-medium text-sm">
                                    {item.label}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatCurrency(item.amount)}
                                  </p>
                                </div>
                                {row.canApprove && row.status === "Pendente" && (
                                  <div className="flex gap-1">
                                    {onApproveItem && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 text-green-600"
                                        onClick={() =>
                                          onApproveItem(row, item)
                                        }
                                        disabled={isApproving || isRejecting}
                                        aria-label="Aprovar item"
                                      >
                                        <Check className="size-4" />
                                      </Button>
                                    )}
                                    {onRejectItem && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 text-red-600"
                                        onClick={() =>
                                          onRejectItem(row, item)
                                        }
                                        disabled={isApproving || isRejecting}
                                        aria-label="Rejeitar item"
                                      >
                                        <X className="size-4" />
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
