"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { getAuthUser } from "./auth"
import { clearAuth } from "./auth"
import type { AuthResponse, UserCompanyDto } from "@/domain/auth/api/types"

const SELECTED_COMPANY_KEY = "velt_selected_company"

interface AuthContextType {
  user: AuthResponse | null
  selectedCompany: UserCompanyDto | null
  loading: boolean
  logout: () => void
  selectCompany: (company: UserCompanyDto | null) => void
  refreshFromStorage: () => void
  isAuthenticated: boolean
  needsCompanySelection: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function getValidCompanies(user: AuthResponse | null): UserCompanyDto[] {
  if (!user?.companies) return []
  return user.companies.filter(
    (c) => c.companyId && c.companyId.trim() !== ""
  )
}

function syncUserAndCompany(
  setUser: (u: AuthResponse | null) => void,
  setSelectedCompany: (c: UserCompanyDto | null) => void
) {
  const savedUser = getAuthUser() as AuthResponse | null
  if (!savedUser) {
    setUser(null)
    setSelectedCompany(null)
    return
  }

  setUser(savedUser)
  const validCompanies = getValidCompanies(savedUser)

  if (validCompanies.length === 0 && savedUser.companies?.length) {
    clearAuth()
    if (typeof window !== "undefined") {
      localStorage.removeItem(SELECTED_COMPANY_KEY)
    }
    setUser(null)
    setSelectedCompany(null)
    return
  }

  const savedCompanyStr = typeof window !== "undefined" ? localStorage.getItem(SELECTED_COMPANY_KEY) : null
  let savedCompany: UserCompanyDto | null = null
  if (savedCompanyStr) {
    try {
      savedCompany = JSON.parse(savedCompanyStr) as UserCompanyDto
    } catch {
      savedCompany = null
    }
  }

  const savedExists = savedCompany && validCompanies.some((c) => c.companyId === savedCompany!.companyId)

  if (savedExists) {
    setSelectedCompany(savedCompany)
  } else if (validCompanies.length === 1) {
    setSelectedCompany(validCompanies[0])
    if (typeof window !== "undefined") {
      localStorage.setItem(SELECTED_COMPANY_KEY, JSON.stringify(validCompanies[0]))
    }
  } else if (validCompanies.length > 1) {
    setSelectedCompany(null)
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null)
  const [selectedCompany, setSelectedCompany] = useState<UserCompanyDto | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshFromStorage = useCallback(() => {
    syncUserAndCompany(setUser, setSelectedCompany)
  }, [])

  useEffect(() => {
    refreshFromStorage()
    setLoading(false)
  }, [refreshFromStorage])

  const selectCompany = useCallback((company: UserCompanyDto | null) => {
    setSelectedCompany(company)
    if (company) {
      localStorage.setItem(SELECTED_COMPANY_KEY, JSON.stringify(company))
    } else {
      localStorage.removeItem(SELECTED_COMPANY_KEY)
    }
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    setUser(null)
    setSelectedCompany(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem(SELECTED_COMPANY_KEY)
    }
  }, [])

  const needsCompanySelection =
    !!user &&
    user.companies &&
    user.companies.length > 1 &&
    !selectedCompany

  return (
    <AuthContext.Provider
      value={{
        user,
        selectedCompany,
        loading,
        logout,
        selectCompany,
        refreshFromStorage,
        isAuthenticated: !!user,
        needsCompanySelection,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
