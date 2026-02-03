"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useReimbursementRequests } from "../api/use-reimbursement-requests"
import type { ReimbursementRequestResponse, ReimbursementRequestState } from "../api/types"
import { Receipt, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

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
    maximumFractionDigits: 2,
  }).format(value)
}

function stateLabel(state: ReimbursementRequestState): string {
  switch (state) {
    case "Pending":
      return "Pendente"
    case "Approved":
      return "Aprovado"
    case "Rejected":
      return "Rejeitado"
    default:
      return state
  }
}

function stateClass(state: ReimbursementRequestState): string {
  switch (state) {
    case "Pending":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
    case "Approved":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
    case "Rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function RequestRow({ request }: { request: ReimbursementRequestResponse }) {
  const title =
    request.expenseDescription?.trim() ||
    (request.expenseAmount != null ? `Despesa — ${formatCurrency(request.expenseAmount)}` : null) ||
    `Despesa ref. ${request.expenseId.slice(0, 8)}…`

  return (
    <li className="flex items-center justify-between gap-3 p-4 rounded-lg border bg-card hover:bg-muted/20 transition-colors">
      <div className="min-w-0 flex-1 flex flex-col gap-1">
        <span className="text-sm font-medium text-foreground truncate" title={title}>
          {title}
        </span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="size-3 shrink-0" />
          Solicitado em {formatDate(request.createdAt)}
          {request.expenseAmount != null && request.expenseDescription?.trim() && (
            <> · {formatCurrency(request.expenseAmount)}</>
          )}
        </span>
      </div>
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0",
          stateClass(request.state)
        )}
      >
        {stateLabel(request.state)}
      </span>
    </li>
  )
}

export function ReimbursementRequestsList() {
  const { data: requests } = useReimbursementRequests()

  if (!requests?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Receipt className="size-5" />
            Solicitações de Reembolsos
          </CardTitle>
          <p className="text-sm text-muted-foreground font-normal mt-1">
            Acompanhe aqui as solicitações de reembolso que você enviou. Quando houver alguma, aparecerão a descrição da despesa, o valor e o status (Pendente, Aprovado ou Rejeitado).
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhuma solicitação de reembolso. Solicite pelo botão &quot;Solicitar reembolso&quot; na lista de despesas de um relatório.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Receipt className="size-5" />
          Solicitações de Reembolsos
        </CardTitle>
        <p className="text-sm text-muted-foreground font-normal mt-1">
          Acompanhe as solicitações que você enviou. Cada item mostra a despesa, o valor e o status.
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {requests.map((request) => (
            <RequestRow key={request.id} request={request} />
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
