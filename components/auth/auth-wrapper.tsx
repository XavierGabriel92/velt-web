"use client"

import { AuthProvider } from "@/lib/auth-context"
import { AuthRedirect } from "@/domain/auth/components/auth-redirect"

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthRedirect />
      {children}
    </AuthProvider>
  )
}
