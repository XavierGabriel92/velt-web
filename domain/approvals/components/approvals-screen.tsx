"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Plane, FileText, Search, Filter } from "lucide-react"
import { usePendingApprovals } from "../api/use-pending-approvals"
import { usePendingReimbursements } from "../api/use-pending-reimbursements"
import { useAuth } from "@/lib/auth-context"
import { ApprovalsTravelTab } from "./approvals-travel-tab"
import { ApprovalsReimbursementTab } from "./approvals-reimbursement-tab"
import { ApprovalLegacySection } from "./approval-legacy-section"
import { cn } from "@/lib/utils"

type Tab = "viagens" | "despesas"

export function ApprovalsScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [tab, setTab] = useState<Tab>(
    tabParam === "despesas" ? "despesas" : "viagens"
  )

  useEffect(() => {
    if (tabParam === "despesas") setTab("despesas")
    else if (tabParam === "viagens") setTab("viagens")
  }, [tabParam])
  const [search, setSearch] = useState("")

  const { user, selectedCompany } = useAuth()
  const userId = user?.userId ?? ""
  const companyId = selectedCompany?.companyId

  const { data: travelApprovals = [] } = usePendingApprovals(userId, companyId)
  const { data: reimbursementRequests = [] } =
    usePendingReimbursements(companyId)

  const travelPendingCount = travelApprovals.filter(
    (a) => a.viewContext === "awaiting_my_approval" && a.canApprove
  ).length
  const reimbursementPendingCount = reimbursementRequests.filter(
    (r) => r.state === "Pending"
  ).length
  const totalPending = travelPendingCount + reimbursementPendingCount

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="size-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold">
              Aprovações de Viagens Corporativas
            </h1>
            <p className="text-muted-foreground">
              {totalPending} solicitações pendentes de aprovação para análise
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar por funcionário, departamento ou destino..."
              className="w-full pl-9 pr-4 py-2 rounded-md border bg-background text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="size-4" />
            Filtros
          </Button>
        </div>

        <div className="flex gap-2 border-b">
          <Button
            variant="ghost"
            className={cn(
              "rounded-b-none border-b-2 border-transparent",
              tab === "viagens" && "border-primary"
            )}
            onClick={() => {
              setTab("viagens")
              router.replace("/inicio/aprovacoes?tab=viagens", { scroll: false })
            }}
          >
            <Plane className="size-4 mr-2" />
            Solicitações de viagem
            {travelPendingCount > 0 && (
              <span className="ml-1 rounded-full bg-amber-500 px-1.5 py-0.5 text-xs text-white">
                {travelPendingCount}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "rounded-b-none border-b-2 border-transparent",
              tab === "despesas" && "border-primary"
            )}
            onClick={() => {
              setTab("despesas")
              router.replace("/inicio/aprovacoes?tab=despesas", { scroll: false })
            }}
          >
            <FileText className="size-4 mr-2" />
            Relatórios de despesas
            {reimbursementPendingCount > 0 && (
              <span className="ml-1 rounded-full bg-amber-500 px-1.5 py-0.5 text-xs text-white">
                {reimbursementPendingCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {tab === "viagens" && <ApprovalsTravelTab />}
      {tab === "despesas" && <ApprovalsReimbursementTab />}

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Histórico (já aprovados)</h2>
        <ApprovalLegacySection />
      </div>
    </div>
  )
}
