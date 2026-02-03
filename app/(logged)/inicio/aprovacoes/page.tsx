"use client"

import { Suspense } from "react"
import { ApprovalsScreen } from "@/domain/approvals/components/approvals-screen"
import { ListSkeleton } from "@/components/shared/list-skeleton"

export default function AprovacoesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<ListSkeleton title="Aprovações" />}>
          <ApprovalsScreen />
        </Suspense>
      </div>
    </div>
  )
}
