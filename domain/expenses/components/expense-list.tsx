"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { useExpenses } from "../api/use-expenses"
import { ExpenseCard } from "./expense-card"
import { ExpenseFormModal } from "./expense-form-modal"
import { useCreateExpense } from "../api/use-create-expense"
import { useAddExpenseToTravelReport } from "../api/use-add-expense-to-travel-report"
import { useUploadReceipt } from "../api/use-upload-receipt"
import { Wallet } from "lucide-react"
import type { ExpenseFilterRequest, ExpenseState } from "../api/types"
import { toast } from "sonner"

const STATE_OPTIONS: { value: ExpenseState; label: string }[] = [
  { value: "Registrada", label: "Registrada" },
  { value: "Aprovada", label: "Aprovada" },
  { value: "Cancelada", label: "Cancelada" },
  { value: "Rejeitada", label: "Rejeitada" },
]

export function ExpenseList() {
  const { selectedCompany } = useAuth()
  const companyId = selectedCompany?.companyId ?? null
  const [modalOpen, setModalOpen] = useState(false)
  const [stateFilter, setStateFilter] = useState<ExpenseState | "">("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const filter: ExpenseFilterRequest | null = companyId
    ? {
        companyId,
        ...(stateFilter ? { state: stateFilter as ExpenseState } : undefined),
        ...(dateFrom ? { dateFrom: dateFrom + "T00:00:00" } : undefined),
        ...(dateTo ? { dateTo: dateTo + "T23:59:59" } : undefined),
      }
    : null

  const { data: expenses = [], isLoading } = useExpenses(filter)
  const createMutation = useCreateExpense()
  const addExpenseToReport = useAddExpenseToTravelReport()
  const uploadMutation = useUploadReceipt()

  const handleCreateSubmit = async (
    data: Parameters<typeof createMutation.mutateAsync>[0],
    travelReportId?: string
  ) => {
    const expense = await createMutation.mutateAsync(data)
    if (travelReportId) {
      await addExpenseToReport.mutateAsync({
        reportId: travelReportId,
        expenseId: expense.id,
      })
      toast.success("Despesa criada e vinculada ao relatório.")
    } else {
      toast.success("Despesa criada com sucesso.")
    }
  }

  const handleUploadReceipt = (expenseId: string) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*,.pdf"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        uploadMutation.mutate(
          { expenseId, file },
          {
            onSuccess: () => toast.success("Comprovante enviado."),
            onError: (err) =>
              toast.error(err instanceof Error ? err.message : "Erro ao enviar comprovante."),
          }
        )
      }
    }
    input.click()
  }

  if (!companyId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center py-6">
            Selecione uma empresa para listar despesas.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="size-5" />
            Despesas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-md border px-3 py-2 text-sm"
              aria-label="Data inicial"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="rounded-md border px-3 py-2 text-sm"
              aria-label="Data final"
            />
            <Select
              value={stateFilter}
              onValueChange={(v) => setStateFilter(v as ExpenseState | "")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setDateFrom("")
                setDateTo("")
                setStateFilter("")
              }}
            >
              Limpar filtros
            </Button>
          </div>

          {isLoading ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Carregando despesas...
            </p>
          ) : expenses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhuma despesa encontrada com os filtros selecionados.
            </p>
          ) : (
            <ul className="space-y-2">
              {expenses.map((expense) => (
                <li key={expense.id}>
                  <ExpenseCard
                    expense={expense}
                    onUploadReceipt={handleUploadReceipt}
                  />
                </li>
              ))}
            </ul>
          )}

          <Button
            className="w-full"
            variant="secondary"
            onClick={() => setModalOpen(true)}
          >
            Nova Despesa
          </Button>
        </CardContent>
      </Card>

      <ExpenseFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        companyId={companyId}
        onSubmit={handleCreateSubmit}
      />
    </>
  )
}
