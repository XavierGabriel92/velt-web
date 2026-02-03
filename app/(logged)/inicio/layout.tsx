import { DashboardHeader } from "@/components/shared/dashboard-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        {children}
      </div>
  )
}
