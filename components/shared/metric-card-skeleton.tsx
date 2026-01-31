import { MetricCard } from "./metric-card"
import { LucideIcon } from "lucide-react"
import { Loading } from "@/components/ui/loading"

interface MetricCardSkeletonProps {
  title: string
  icon: LucideIcon
}

export function MetricCardSkeleton({ title, icon: Icon }: MetricCardSkeletonProps) {
  return (
    <div className="bg-slate-800 text-white border-slate-700 rounded-xl border py-6 shadow-sm">
      <div className="px-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-slate-300 mb-1">{title}</p>
            <div className="h-9 w-20 bg-slate-700 rounded mb-2 animate-pulse" />
            <div className="h-4 w-32 bg-slate-700 rounded animate-pulse" />
          </div>
          <div className="shrink-0">
            <Icon className="size-8 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  )
}

