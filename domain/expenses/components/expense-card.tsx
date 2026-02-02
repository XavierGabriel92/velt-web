"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { ExpenseResponse } from "../api/types"
import { Calendar, Wallet, FileCheck, FileX } from "lucide-react"
import { cn } from "@/lib/utils"

const STATE_LABELS: Record<ExpenseResponse["state"], string> = {
  Registrada: "Registrada",
  Aprovada: "Aprovada",
  Cancelada: "Cancelada",
  Rejeitada: "Rejeitada",
}

const STATE_STYLE: Record<ExpenseResponse["state"], string> = {
  Registrada: "bg-slate-100 text-slate-700",
  Aprovada: "bg-green-100 text-green-800",
  Cancelada: "bg-red-100 text-red-800",
  Rejeitada: "bg-red-100 text-red-800",
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "—"
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
    maximumFractionDigits: 2,
  }).format(value)
}

interface ExpenseCardProps {
  expense: ExpenseResponse
  className?: string
  onUploadReceipt?: (expenseId: string) => void
  compact?: boolean
}

export function ExpenseCard({
  expense,
  className,
  onUploadReceipt,
  compact = false,
}: ExpenseCardProps) {
  const hasReceipt = !!expense.comprovantesPath

  return (
    <Card className={cn("border", className)}>
      <CardContent className={cn(compact ? "p-3" : "p-4")}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground">
              {expense.description || "Sem descrição"}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5 shrink-0" />
                {formatDate(expense.expenseDate)}
              </span>
              <span className="flex items-center gap-1">
                <Wallet className="size-3.5 shrink-0" />
                {formatCurrency(expense.valor)}
              </span>
              <span className="flex items-center gap-1">
                {hasReceipt ? (
                  <FileCheck className="size-3.5 shrink-0 text-green-600" />
                ) : (
                  <FileX className="size-3.5 shrink-0 text-muted-foreground" />
                )}
                {hasReceipt ? "Comprovante" : "Sem comprovante"}
              </span>
            </div>
            {(expense.emissorId ?? expense.emissorName) && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                Solicitado por: {expense.emissorName ?? expense.emissorId}
              </p>
            )}
            {expense.category && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {expense.category}
              </p>
            )}
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
              STATE_STYLE[expense.state]
            )}
          >
            {STATE_LABELS[expense.state]}
          </span>
        </div>
        {onUploadReceipt && !hasReceipt && (
          <div className="mt-2">
            <button
              type="button"
              onClick={() => onUploadReceipt(expense.id)}
              className="text-xs text-primary hover:underline"
            >
              Anexar comprovante
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
