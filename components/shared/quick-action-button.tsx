import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface QuickActionButtonProps {
  title: string
  icon: LucideIcon
  onClick?: () => void
  badge?: number
  className?: string
}

export function QuickActionButton({
  title,
  icon: Icon,
  onClick,
  badge,
  className,
}: QuickActionButtonProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Icon className="size-8 text-primary" />
            {badge !== undefined && badge > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full size-5 flex items-center justify-center">
                {badge > 99 ? "99+" : badge}
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-center">{title}</p>
        </div>
      </CardContent>
    </Card>
  )
}

