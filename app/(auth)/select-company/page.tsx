"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import type { UserCompanyDto } from "@/domain/auth/api/types"
import { Logo } from "@/components/shared/logo"
import { ChevronRight } from "lucide-react"

export default function SelectCompanyPage() {
  const { user, selectedCompany, selectCompany, loading, needsCompanySelection, isAuthenticated } =
    useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (!needsCompanySelection && selectedCompany) {
      router.push("/inicio")
      return
    }

    if (!user?.companies || user.companies.length === 0) {
      router.push("/inicio")
    }
  }, [loading, isAuthenticated, needsCompanySelection, selectedCompany, user, router])

  const handleSelectCompany = (company: UserCompanyDto) => {
    selectCompany(company)
    router.push("/inicio")
  }

  const validCompanies = (user?.companies || []).filter(
    (c: UserCompanyDto) => c.companyId && c.companyId.trim() !== ""
  )

  if (loading || !needsCompanySelection) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  if (!user?.companies?.length) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <main className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Selecione uma Empresa</h1>
          <p className="mt-2 text-muted-foreground">
            Você está vinculado a múltiplas empresas. Selecione qual deseja usar agora.
          </p>
        </div>

        <div className="space-y-3">
          {validCompanies.map((company) => (
            <button
              key={company.companyId}
              type="button"
              onClick={() => handleSelectCompany(company)}
              className="flex w-full items-center justify-between rounded-lg border-2 border-gray-200 bg-gray-50 p-6 text-left transition-all hover:border-primary hover:bg-primary/5 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary dark:hover:bg-primary/10"
            >
              <div>
                <h3 className="text-lg font-semibold">{company.companyName}</h3>
                {company.roles && company.roles.length > 0 && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {company.roles.join(", ")}
                  </p>
                )}
              </div>
              <ChevronRight className="h-6 w-6 text-muted-foreground" />
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Você pode trocar de empresa a qualquer momento no menu superior.
        </p>
      </main>
    </div>
  )
}
