"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

const PUBLIC_ROUTES = ["/login", "/reset-password"]

export function AuthRedirect() {
  const { needsCompanySelection, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

    // Autenticado mas precisa selecionar empresa
    if (
      isAuthenticated &&
      needsCompanySelection &&
      pathname !== "/select-company" &&
      !isPublicRoute
    ) {
      router.push("/select-company")
      return
    }

    // Na página de seleção mas já tem empresa
    if (pathname === "/select-company" && !needsCompanySelection) {
      router.push("/inicio")
      return
    }

    // Não autenticado em rota protegida (inicio e filhos)
    if (
      !isAuthenticated &&
      !isPublicRoute &&
      pathname !== "/select-company" &&
      pathname.startsWith("/inicio")
    ) {
      router.push("/login")
    }
  }, [loading, isAuthenticated, needsCompanySelection, pathname, router])

  return null
}
