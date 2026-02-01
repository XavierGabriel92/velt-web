"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import type { UserCompanyDto } from "@/domain/auth/api/types"
import { ChevronDown } from "lucide-react"

export function CompanySelector() {
  const { user, selectedCompany, selectCompany } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const validCompanies = (user?.companies || []).filter(
    (c: UserCompanyDto) => c.companyId && c.companyId.trim() !== ""
  )

  // Suprimir seletor quando usuário tem apenas 1 empresa
  if (!user || validCompanies.length <= 1) {
    return null
  }

  const handleSelectCompany = (company: UserCompanyDto) => {
    selectCompany(company)
    setIsOpen(false)
    router.refresh()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
      >
        <span className="max-w-[150px] truncate">
          {selectedCompany?.companyName || "Selecionar empresa"}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            <div className="py-1">
              {validCompanies.map((company) => (
                <button
                  key={company.companyId}
                  type="button"
                  onClick={() => handleSelectCompany(company)}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    selectedCompany?.companyId === company.companyId
                      ? "bg-primary/10 text-primary dark:bg-primary/20"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  <div className="font-medium">{company.companyName}</div>
                  {company.roles && company.roles.length > 0 && (
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {company.roles.join(", ")}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
