"use client"

import { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CostCenterSelector } from "@/domain/cost-centers/components/cost-center-selector"
import { useAuth } from "@/lib/auth-context"
import { useTravelReports } from "@/domain/travel-reports/api/use-travel-reports"
import { useCompanyTravelers } from "@/domain/travels/api/use-company-travelers"
import type { CreateExpenseRequest, UpdateExpenseRequest, ExpenseResponse } from "../api/types"

interface ExpenseFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyId: string
  /** Para criar: (dados, relatório?, arquivo comprovante?) */
  onSubmit: (data: CreateExpenseRequest, travelReportId?: string, receiptFile?: File) => void | Promise<void>
  /** Para editar: despesa existente; se definido, modal em modo edição */
  initialData?: ExpenseResponse | null
  /** Ao salvar em modo edição */
  onSubmitEdit?: (expenseId: string, data: UpdateExpenseRequest, receiptFile?: File) => void | Promise<void>
}

export function ExpenseFormModal({
  open,
  onOpenChange,
  companyId,
  onSubmit,
  initialData,
  onSubmitEdit,
}: ExpenseFormModalProps) {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [valor, setValor] = useState("")
  const [beneficiaryUserId, setBeneficiaryUserId] = useState("")
  const [costCenterId, setCostCenterId] = useState("")
  const [description, setDescription] = useState("")
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0]
  )
  const [category, setCategory] = useState("")
  const [travelReportId, setTravelReportId] = useState("")
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEdit = !!initialData?.id
  const { data: availableReports = [] } = useTravelReports(companyId || null)
  const { data: companyUsers = [] } = useCompanyTravelers()

  // Preencher formulário ao abrir em modo edição
  useEffect(() => {
    if (open && initialData) {
      setValor(String(initialData.valor))
      setBeneficiaryUserId(initialData.userId)
      setCostCenterId(initialData.costCenterId)
      setDescription(initialData.description ?? "")
      setCategory(initialData.category ?? "")
      setExpenseDate(
        initialData.expenseDate
          ? new Date(initialData.expenseDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0]
      )
      setTravelReportId("")
      setReceiptFile(null)
    }
  }, [open, initialData])

  // Default "Para quem é" to current user when modal opens (criação) and company users load
  useEffect(() => {
    if (open && !initialData && user?.userId && companyUsers.length > 0 && !beneficiaryUserId) {
      setBeneficiaryUserId(user.userId)
    }
  }, [open, initialData, user?.userId, companyUsers.length, beneficiaryUserId])

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setBeneficiaryUserId("")
      setReceiptFile(null)
    }
  }, [open])

  const effectiveBeneficiary = beneficiaryUserId || user?.userId || ""

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const numValor = parseFloat(valor.replace(",", "."))
    if (isNaN(numValor) || numValor <= 0) {
      setError("Valor deve ser maior que zero")
      return
    }
    if (!costCenterId.trim()) {
      setError("Selecione um centro de custo")
      return
    }
    if (!user?.userId) {
      setError("Usuário não identificado. Faça login novamente.")
      return
    }
    if (!effectiveBeneficiary.trim()) {
      setError("Selecione para quem é a despesa")
      return
    }

    setSubmitting(true)
    try {
      const receipt = receiptFile ?? undefined
      if (isEdit && initialData && onSubmitEdit) {
        const updateData: UpdateExpenseRequest = {
          valor: numValor,
          costCenterId,
          description: description.trim() || undefined,
          expenseDate: expenseDate || undefined,
          category: category.trim() || undefined,
          userId: effectiveBeneficiary,
        }
        const res = onSubmitEdit(initialData.id, updateData, receipt)
        if (res && typeof (res as Promise<unknown>).then === "function") {
          await (res as Promise<unknown>)
        }
      } else {
        const data: CreateExpenseRequest = {
          companyId,
          userId: effectiveBeneficiary,
          valor: numValor,
          costCenterId,
          origin: "External",
          description: description.trim() || undefined,
          expenseDate: expenseDate || undefined,
          category: category.trim() || undefined,
        }
        const res = onSubmit(data, travelReportId || undefined, receipt)
        if (res && typeof (res as Promise<unknown>).then === "function") {
          await (res as Promise<unknown>)
        }
      }
      onOpenChange(false)
      setValor("")
      setBeneficiaryUserId("")
      setCostCenterId("")
      setDescription("")
      setCategory("")
      setTravelReportId("")
      setReceiptFile(null)
    } catch (err) {
      console.error(isEdit ? "Erro ao atualizar despesa:" : "Erro ao criar despesa:", err)
      setError(
        err instanceof Error ? err.message : (isEdit ? "Erro ao atualizar despesa. Tente novamente." : "Erro ao criar despesa. Tente novamente.")
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Despesa" : "Nova Despesa"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Altere os dados da despesa." : "Preencha os dados da despesa. Você pode anexar o comprovante aqui ou depois."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="expense-valor">Valor (R$) *</Label>
            <Input
              id="expense-valor"
              type="text"
              inputMode="decimal"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0,00"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Para quem é a despesa *</Label>
            <Select
              value={effectiveBeneficiary || "none"}
              onValueChange={(v) => setBeneficiaryUserId(v === "none" ? "" : v)}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Selecione o beneficiário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Selecione o beneficiário</SelectItem>
                {companyUsers.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {[u.firstName, u.lastName].filter(Boolean).join(" ") || u.email || u.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Usuário da empresa que será atribuído à despesa (relatórios/dashboard). O reembolso será pago a quem criou a despesa.
            </p>
          </div>
          <CostCenterSelector
            companyId={companyId}
            value={costCenterId}
            onChange={setCostCenterId}
            required
          />
          <div>
            <Label htmlFor="expense-description">Descrição</Label>
            <Textarea
              id="expense-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              maxLength={1000}
              placeholder="Descrição da despesa"
              className="mt-1.5"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expense-date">Data da despesa</Label>
              <Input
                id="expense-date"
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="expense-category">Categoria</Label>
              <Input
                id="expense-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                maxLength={100}
                placeholder="Ex: Alimentação, Transporte"
                className="mt-1.5"
              />
            </div>
          </div>
          {!isEdit && (
            <div>
              <Label>Vincular a relatório</Label>
              <Select
                value={travelReportId || "none"}
                onValueChange={(v) => setTravelReportId(v === "none" ? "" : v)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Nenhum (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum (opcional)</SelectItem>
                  {availableReports.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Opcional. Você também pode vincular depois na lista de relatórios.
              </p>
            </div>
          )}
          <div>
            <Label>Comprovante (opcional)</Label>
            <div className="mt-1.5 flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="block w-full text-sm text-muted-foreground file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-primary-foreground file:text-sm"
                onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {receiptFile ? `Arquivo: ${receiptFile.name}` : "Imagem ou PDF. Pode anexar agora ou depois na lista."}
            </p>
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar despesa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
