import { AuthGuard } from "@/domain/auth/components/auth-guard"
import { DashboardHeader } from "@/components/shared/dashboard-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
        {children}
    </AuthGuard>
  )
}
