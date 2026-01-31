import { AuthGuard } from "@/components/auth/auth-guard"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div>
        <h1>Dashboard</h1>
        {children}
      </div>
    </AuthGuard>
  );
}