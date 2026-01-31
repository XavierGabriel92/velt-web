"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { Loading } from "@/components/ui/loading"

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * Componente que protege rotas autenticadas
 * Redireciona para /login se o usuário não estiver autenticado
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    // Verificar autenticação apenas no cliente
    if (typeof window === "undefined") {
      setIsChecking(false)
      return
    }

    const checkAuth = () => {
      const authenticated = isAuthenticated()
      setIsAuth(authenticated)
      setIsChecking(false)

      if (!authenticated) {
        // Salvar a URL atual para redirecionar após login
        const returnUrl = pathname !== "/login" ? pathname : undefined
        const loginUrl = returnUrl 
          ? `/login?returnUrl=${encodeURIComponent(returnUrl)}`
          : "/login"
        
        router.push(loginUrl)
      }
    }

    checkAuth()
  }, [router, pathname])

  // Mostrar loading enquanto verifica autenticação
  if (isChecking) {
    return <Loading text="Verificando autenticação..." fullScreen />
  }

  // Se não estiver autenticado, não renderizar nada (já redirecionou)
  if (!isAuth) {
    return null
  }

  return <>{children}</>
}

