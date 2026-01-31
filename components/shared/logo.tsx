import * as React from "react"
import { cn } from "@/lib/utils"

interface LogoProps extends React.ComponentProps<"div"> {
  className?: string
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {/* Placeholder para o SVG da logo - será substituído posteriormente */}
      <div className="flex items-center gap-2">
        <div className="size-8 rounded bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-xl">V</span>
        </div>
        <span className="text-2xl font-bold text-primary">velt</span>
      </div>
    </div>
  )
}

