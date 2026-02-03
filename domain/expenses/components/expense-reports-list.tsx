"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { useTravelReportsList } from "@/domain/travel-reports/api/use-travel-reports"
import { useExpenses } from "../api/use-expenses"
import { useCreateReimbursementRequest } from "@/domain/reimbursements/api/use-create-reimbursement-request"
import { useReimbursementRequestsQuery } from "@/domain/reimbursements/api/use-reimbursement-requests"
import { ChevronDown, ChevronRight, Calendar, Receipt, Pencil, Trash2, Banknote } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { ExpenseResponse } from "../api/types"

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

function formatDateShort(dateStr: string | undefined): string {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

/** Tipo/categoria da despesa para exibição na tabela */
function expenseTypeLabel(expense: ExpenseResponse): string {
  return expense.category ?? (expense.origin === "VeltSale" ? "Viagem" : "Outros")
}

/** Quem deve receber o reembolso: reimburseToUserId ?? emissorId ?? userId */
function getReimburseToUserId(expense: ExpenseResponse): string {
  return expense.reimburseToUserId ?? expense.emissorId ?? expense.userId
}

/** Linha da tabela de despesas (como no print) */
function ExpenseTableRow({
  expense,
  currentUserId,
  hasExistingReimbursementRequest,
  onEdit,
  onDelete,
  onUploadReceipt,
  onRequestReimbursement,
}: {
  expense: ExpenseResponse
  currentUserId?: string | null
  /** Despesa já possui solicitação de reembolso (pendente, aprovada ou rejeitada). */
  hasExistingReimbursementRequest?: boolean
  onEdit?: (expense: ExpenseResponse) => void
  onDelete?: (expenseId: string) => void | Promise<void>
  onUploadReceipt?: (expenseId: string) => void
  onRequestReimbursement?: (expense: ExpenseResponse) => void
}) {
  const hasReceipt = !!expense.comprovantesPath
  const canRequestReimbursement =
    currentUserId &&
    getReimburseToUserId(expense) === currentUserId &&
    hasReceipt &&
    !hasExistingReimbursementRequest &&
    onRequestReimbursement

  return (
    <tr className="border-b last:border-0 hover:bg-muted/30">
      <td className="py-2 px-3 text-sm">{expenseTypeLabel(expense)}</td>
      <td className="py-2 px-3 text-sm" title={expense.description ? undefined : "Sem descrição"}>
        {expense.description || "—"}
      </td>
      <td className="py-2 px-3 text-sm">{formatDateShort(expense.expenseDate)}</td>
      <td className="py-2 px-3 text-sm">{formatCurrency(expense.valor)}</td>
      <td className="py-2 px-3">
        <span
            className={cn(
              "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
              hasReceipt ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            )}
          >
            {hasReceipt ? "Com comprovante" : "Sem comprovante"}
          </span>
      </td>
      <td className="py-2 px-3">
        <div className="flex items-center gap-1 flex-wrap">
          {onEdit && (
            <button
              type="button"
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
              title="Editar despesa"
              onClick={() => onEdit(expense)}
            >
              <Pencil className="size-4" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive"
              title="Excluir despesa"
              onClick={() => onDelete(expense.id)}
            >
              <Trash2 className="size-4" />
            </button>
          )}
          {!hasReceipt && onUploadReceipt && (
            <button
              type="button"
              onClick={() => onUploadReceipt(expense.id)}
              className="text-xs text-primary hover:underline"
              title="Anexar comprovante a esta despesa"
            >
              Anexar comprovante
            </button>
          )}
          {canRequestReimbursement && (
            <button
              type="button"
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs"
              title="Solicitar reembolso desta despesa"
              onClick={() => onRequestReimbursement(expense)}
            >
              <Banknote className="size-4 shrink-0" />
              Solicitar reembolso
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}

interface ExpenseReportsListProps {
  onEdit?: (expense: ExpenseResponse) => void
  onDelete?: (expenseId: string) => void | Promise<void>
  onUploadReceipt?: (expenseId: string) => void
}

export function ExpenseReportsList({
  onEdit,
  onDelete,
  onUploadReceipt,
}: ExpenseReportsListProps = {}) {
  const { user, selectedCompany } = useAuth()
  const companyId = selectedCompany?.companyId ?? null
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [expenseForReimbursement, setExpenseForReimbursement] = useState<ExpenseResponse | null>(null)
  const [declaredPaidWithPersonalFunds, setDeclaredPaidWithPersonalFunds] = useState(false)
  const createReimbursementRequest = useCreateReimbursementRequest()
  const { data: reimbursementRequests = [] } = useReimbursementRequestsQuery()
  const expenseIdsWithReimbursementRequest = new Set(
    reimbursementRequests.map((r) => r.expenseId)
  )

  const { data: reports = [], isLoading: reportsLoading } = useTravelReportsList({
    companyId: companyId ?? undefined,
    pageSize: 50,
  })

  const { data: allExpenses = [] } = useExpenses(
    companyId ? { companyId } : null
  )

  const reportsWithExpenses = reports.map((report) => {
    const expenses = (report.expenseIds ?? []).length
      ? allExpenses.filter((e) =>
          (report.expenseIds ?? []).includes(e.id)
        )
      : []
    const totalValue = expenses.reduce((sum, e) => sum + e.valor, 0)
    return { report, expenses, totalValue }
  })

  if (!companyId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center py-6">
            Selecione uma empresa para ver os relatórios de despesas.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (reportsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Relatórios de Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Carregando...
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!reportsWithExpenses.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Relatórios de Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhum relatório encontrado. Crie um novo relatório ou adicione despesas.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {reportsWithExpenses.map(({ report, expenses, totalValue }) => {
        const isExpanded = expandedId === report.id
        const hasExpenses = expenses.length > 0
        const createdDate = report.createdAt ? formatDate(report.createdAt) : "—"
        return (
          <Card key={report.id} className="overflow-hidden">
            <button
              type="button"
              className={cn(
                "w-full flex items-center gap-3 p-4 text-left",
                "hover:bg-muted/30 transition-colors"
              )}
              onClick={() => setExpandedId(isExpanded ? null : report.id)}
            >
              <span className="shrink-0 text-muted-foreground">
                {isExpanded ? (
                  <ChevronDown className="size-5" />
                ) : (
                  <ChevronRight className="size-5" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-lg">{report.title}</p>
                {report.description && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {report.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5 shrink-0" />
                    Criado em {createdDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Receipt className="size-3.5 shrink-0" />
                    {expenses.length} despesa{expenses.length !== 1 ? "s" : ""}
                  </span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(totalValue)}
                  </span>
                </div>
              </div>
            </button>
            {isExpanded && (
              <div className="border-t bg-muted/20 px-4 pb-4 pt-2">
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  Despesas vinculadas a este relatório
                </p>
                {hasExpenses ? (
                  <div className="overflow-x-auto rounded-md border bg-card">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-2 px-3 text-left font-medium">Categoria</th>
                          <th className="py-2 px-3 text-left font-medium">Descrição</th>
                          <th className="py-2 px-3 text-left font-medium">Data da despesa</th>
                          <th className="py-2 px-3 text-left font-medium">Valor</th>
                          <th className="py-2 px-3 text-left font-medium">Comprovante anexado</th>
                          <th className="py-2 px-3 text-left font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenses.map((expense) => (
                          <ExpenseTableRow
                            key={expense.id}
                            expense={expense}
                            currentUserId={user?.userId}
                            hasExistingReimbursementRequest={expenseIdsWithReimbursementRequest.has(expense.id)}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onUploadReceipt={onUploadReceipt}
                            onRequestReimbursement={(exp) => {
                              setExpenseForReimbursement(exp)
                              setDeclaredPaidWithPersonalFunds(false)
                            }}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-4">
                    Nenhuma despesa vinculada. Adicione despesas ao relatório.
                  </p>
                )}
              </div>
            )}
          </Card>
        )
      })}

      <Dialog
        open={!!expenseForReimbursement}
        onOpenChange={(open) => {
          if (!open) {
            setExpenseForReimbursement(null)
            setDeclaredPaidWithPersonalFunds(false)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar reembolso</DialogTitle>
            <DialogDescription>
              {expenseForReimbursement && (
                <>
                  Despesa: {expenseForReimbursement.description || expenseForReimbursement.category || "—"} —{" "}
                  {formatCurrency(expenseForReimbursement.valor)}. Confirme se pagou com recursos próprios.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-2">
            <Checkbox
              id="declaredPaidWithPersonalFunds"
              checked={declaredPaidWithPersonalFunds}
              onCheckedChange={(checked) => setDeclaredPaidWithPersonalFunds(checked === true)}
            />
            <Label htmlFor="declaredPaidWithPersonalFunds" className="text-sm font-normal cursor-pointer">
              Pagou com recursos próprios?
            </Label>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setExpenseForReimbursement(null)
                setDeclaredPaidWithPersonalFunds(false)
              }}
            >
              Cancelar
            </Button>
            <Button
              disabled={
                !expenseForReimbursement ||
                !expenseForReimbursement.comprovantesPath ||
                createReimbursementRequest.isPending
              }
              onClick={async () => {
                if (!expenseForReimbursement) return
                if (!expenseForReimbursement.comprovantesPath) {
                  toast.error("Anexe um comprovante à despesa antes de solicitar reembolso.")
                  return
                }
                try {
                  await createReimbursementRequest.mutateAsync({
                    expenseId: expenseForReimbursement.id,
                    declaredPaidWithPersonalFunds,
                  })
                  toast.success("Solicitação de reembolso enviada.")
                  setExpenseForReimbursement(null)
                  setDeclaredPaidWithPersonalFunds(false)
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Erro ao solicitar reembolso.")
                }
              }}
            >
              {createReimbursementRequest.isPending ? "Enviando…" : "Solicitar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
