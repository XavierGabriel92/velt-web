"use client"

import { useState } from "react"
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
import type {
  CreateTravelReportRequest,
  UpdateTravelReportRequest,
  TravelReportResponse,
} from "../api/types"

interface TravelReportFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyId: string
  onSubmit: (
    data: CreateTravelReportRequest | UpdateTravelReportRequest
  ) => void | Promise<void>
  initialData?: TravelReportResponse
  isEdit?: boolean
}

export function TravelReportFormModal({
  open,
  onOpenChange,
  companyId,
  onSubmit,
  initialData,
  isEdit = false,
}: TravelReportFormModalProps) {
  const [title, setTitle] = useState(initialData?.title ?? "")
  const [description, setDescription] = useState(initialData?.description ?? "")
  const [reason, setReason] = useState(initialData?.reason ?? "")
  const [startDate, setStartDate] = useState(
    initialData?.startDate ? initialData.startDate.split("T")[0] : ""
  )
  const [endDate, setEndDate] = useState(
    initialData?.endDate ? initialData.endDate.split("T")[0] : ""
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError("Título é obrigatório")
      return
    }
    if (!startDate || !endDate) {
      setError("Data de início e fim são obrigatórias")
      return
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError("Data de fim deve ser maior ou igual à data de início")
      return
    }

    setSubmitting(true)
    try {
      if (isEdit && initialData) {
        const updateData: UpdateTravelReportRequest = {
          title: title.trim(),
          description: description.trim() || undefined,
          reason: reason.trim() || undefined,
          startDate,
          endDate,
        }
        const res = onSubmit(updateData)
        if (res && typeof (res as Promise<unknown>).then === "function") {
          await (res as Promise<unknown>)
        }
      } else {
        const createData: CreateTravelReportRequest = {
          companyId,
          title: title.trim(),
          description: description.trim() || undefined,
          reason: reason.trim() || undefined,
          startDate,
          endDate,
        }
        const res = onSubmit(createData)
        if (res && typeof (res as Promise<unknown>).then === "function") {
          await (res as Promise<unknown>)
        }
      }
      onOpenChange(false)
    } catch (err) {
      console.error("Erro ao salvar relatório:", err)
      setError("Erro ao salvar relatório. Tente novamente.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={true} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar Relatório de Viagem</DialogTitle>
          <DialogDescription>Preencha os dados para criar um novo relatório.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="report-title">Título *</Label>
            <Input
              id="report-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              placeholder="Título do relatório"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="report-description">Descrição</Label>
            <Textarea
              id="report-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={1000}
              placeholder="Descrição opcional"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="report-reason">Razão/Motivo</Label>
            <Input
              id="report-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              placeholder="Motivo da viagem"
              className="mt-1.5"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="report-startDate">Data de Início *</Label>
              <Input
                id="report-startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="report-endDate">Data de Fim *</Label>
              <Input
                id="report-endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1.5"
              />
            </div>
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
              {submitting ? "Salvando..." : isEdit ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
