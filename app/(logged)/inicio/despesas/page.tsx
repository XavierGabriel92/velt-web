"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { ExpenseReportsList } from "@/domain/expenses/components/expense-reports-list"
import { ExpenseFormModal } from "@/domain/expenses/components/expense-form-modal"
import { TravelReportFormModal } from "@/domain/travel-reports/components/travel-report-form-modal"
import { ReimbursementRequestsList } from "@/domain/reimbursements/components/reimbursement-requests-list"
import { ListSkeleton } from "@/components/shared/list-skeleton"
import { useAuth } from "@/lib/auth-context"
import { useCreateExpense } from "@/domain/expenses/api/use-create-expense"
import { useUpdateExpense } from "@/domain/expenses/api/use-update-expense"
import { useDeleteExpense } from "@/domain/expenses/api/use-delete-expense"
import { useUploadReceipt } from "@/domain/expenses/api/use-upload-receipt"
import { useAddExpenseToTravelReport } from "@/domain/expenses/api/use-add-expense-to-travel-report"
import { useCreateTravelReport } from "@/domain/travel-reports/api/use-create-travel-report"
import type { ExpenseResponse, UpdateExpenseRequest } from "@/domain/expenses/api/types"
import { Wallet, Plus, DollarSign, Receipt } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type Tab = "relatorios" | "reembolsos"

export default function DespesasPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [tab, setTab] = useState<Tab>(tabParam === "reembolsos" ? "reembolsos" : "relatorios")
  const { selectedCompany } = useAuth()
  const companyId = selectedCompany?.companyId ?? null
  const [newExpenseOpen, setNewExpenseOpen] = useState(false)
  const [newReportOpen, setNewReportOpen] = useState(false)
  const [editExpense, setEditExpense] = useState<ExpenseResponse | null>(null)
  const uploadReceiptInputRef = React.useRef<HTMLInputElement>(null)
  const [expenseIdForReceipt, setExpenseIdForReceipt] = useState<string | null>(null)

  const createExpense = useCreateExpense()
  const updateExpense = useUpdateExpense()
  const deleteExpense = useDeleteExpense()
  const uploadReceipt = useUploadReceipt()
  const addExpenseToReport = useAddExpenseToTravelReport()
  const createReport = useCreateTravelReport()

  useEffect(() => {
    if (tabParam === "reembolsos") setTab("reembolsos")
    else if (tabParam === "relatorios") setTab("relatorios")
  }, [tabParam])

  const handleCreateExpense = async (
    data: Parameters<typeof createExpense.mutateAsync>[0],
    travelReportId?: string,
    receiptFile?: File
  ) => {
    const expense = await createExpense.mutateAsync(data)
    if (travelReportId) {
      await addExpenseToReport.mutateAsync({
        reportId: travelReportId,
        expenseId: expense.id,
      })
    }
    if (receiptFile) {
      await uploadReceipt.mutateAsync({ expenseId: expense.id, file: receiptFile })
    }
    toast.success(travelReportId ? "Despesa criada e vinculada ao relatório." : "Despesa criada com sucesso.")
    setNewExpenseOpen(false)
  }

  const handleEditExpense = async (
    expenseId: string,
    data: UpdateExpenseRequest,
    receiptFile?: File
  ) => {
    await updateExpense.mutateAsync({ expenseId, data })
    if (receiptFile) {
      await uploadReceipt.mutateAsync({ expenseId, file: receiptFile })
    }
    toast.success("Despesa atualizada.")
    setEditExpense(null)
    setNewExpenseOpen(false)
  }

  const handleDeleteExpense = async (expenseId: string) => {
    if (!window.confirm("Excluir esta despesa? Esta ação não pode ser desfeita.")) return
    await deleteExpense.mutateAsync(expenseId)
    toast.success("Despesa excluída.")
  }

  const handleUploadReceiptClick = (expenseId: string) => {
    setExpenseIdForReceipt(expenseId)
    uploadReceiptInputRef.current?.click()
  }

  const handleUploadReceiptFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && expenseIdForReceipt) {
      uploadReceipt.mutate(
        { expenseId: expenseIdForReceipt, file },
        {
          onSuccess: () => toast.success("Comprovante enviado."),
          onError: (err) => toast.error(err instanceof Error ? err.message : "Erro ao enviar comprovante."),
        }
      )
      setExpenseIdForReceipt(null)
    }
    e.target.value = ""
  }

  const handleCreateReport = async (
    data:
      | Parameters<typeof createReport.mutateAsync>[0]
      | import("@/domain/travel-reports/api/types").UpdateTravelReportRequest
  ) => {
    if ("companyId" in data && data.companyId) {
      await createReport.mutateAsync(data)
      toast.success("Relatório criado com sucesso.")
      setNewReportOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-2 mb-6 border-b">
          <Button
            variant="ghost"
            className={cn(
              "rounded-b-none border-b-2 border-transparent",
              tab === "relatorios" && "border-[#FF3C00] bg-transparent"
            )}
            onClick={() => {
              setTab("relatorios")
              router.replace("/inicio/despesas?tab=relatorios", { scroll: false })
            }}
          >
            <Wallet className="size-4 mr-2" />
            Relatórios de Despesas
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "rounded-b-none border-b-2 border-transparent",
              tab === "reembolsos" && "border-[#FF3C00] bg-transparent"
            )}
            onClick={() => {
              setTab("reembolsos")
              router.replace("/inicio/despesas?tab=reembolsos", { scroll: false })
            }}
          >
            <Receipt className="size-4 mr-2" />
            Solicitações de Reembolsos
          </Button>
        </div>

        {tab === "relatorios" && (
          <>
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Wallet className="size-7" />
                    Relatórios de Despesas
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Organize suas despesas em relatórios e vincule a viagens específicas
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => {
                      setEditExpense(null)
                      setNewExpenseOpen(true)
                    }}
                    disabled={!companyId}
                    className="gap-2 bg-orange-600 hover:bg-orange-700"
                  >
                    <DollarSign className="size-4" />
                    Nova Despesa
                  </Button>
                  <Button
                    onClick={() => setNewReportOpen(true)}
                    disabled={!companyId}
                    className="gap-2 bg-orange-600 hover:bg-orange-700"
                  >
                    <Plus className="size-4" />
                    Novo Relatório
                  </Button>
                </div>
              </div>
            </div>

            <ExpenseReportsList
              onEdit={(expense) => {
                setEditExpense(expense)
                setNewExpenseOpen(true)
              }}
              onDelete={handleDeleteExpense}
              onUploadReceipt={handleUploadReceiptClick}
            />
          </>
        )}

        {tab === "reembolsos" && (
          <Suspense fallback={<ListSkeleton title="Solicitações de Reembolsos" />}>
            <ReimbursementRequestsList />
          </Suspense>
        )}
      </div>

      <input
        ref={uploadReceiptInputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        aria-hidden
        onChange={handleUploadReceiptFile}
      />

      <ExpenseFormModal
        open={newExpenseOpen}
        onOpenChange={(open) => {
          if (!open) setEditExpense(null)
          setNewExpenseOpen(open)
        }}
        companyId={companyId ?? ""}
        onSubmit={handleCreateExpense}
        initialData={editExpense}
        onSubmitEdit={handleEditExpense}
      />

      {companyId && (
        <TravelReportFormModal
          open={newReportOpen}
          onOpenChange={setNewReportOpen}
          companyId={companyId}
          onSubmit={handleCreateReport}
          initialData={undefined}
          isEdit={false}
        />
      )}
    </div>
  )
}
