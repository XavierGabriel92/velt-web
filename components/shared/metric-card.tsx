import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface MetricCardProps {
  title: string
  value: string
  change?: string
  changeType?: "positive" | "negative"
  previousPeriod?: string
  icon: LucideIcon
  className?: string
}

export function MetricCard({
  title,
  value,
  change,
  changeType,
  previousPeriod,
  icon: Icon,
  className,
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        "bg-slate-800 text-white border-slate-700",
        className
      )}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-slate-300 mb-1">{title}</p>
            <p className="text-3xl font-bold mb-2">{value}</p>
            {change && (
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-sm font-medium",
                    changeType === "positive"
                      ? "text-green-400"
                      : changeType === "negative"
                      ? "text-red-400"
                      : "text-slate-300"
                  )}
                >
                  {change}
                </span>
                {previousPeriod && (
                  <span className="text-xs text-slate-400">
                    {previousPeriod}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="shrink-0">
            <Icon className="size-8 text-slate-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

