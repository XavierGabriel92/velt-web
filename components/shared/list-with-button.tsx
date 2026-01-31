import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface ListWithButtonProps<T> {
  title: string
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  buttonText: string
  onButtonClick?: () => void
  headerBadge?: number | string
  headerIcon?: LucideIcon
  className?: string
  emptyMessage?: string
}

export function ListWithButton<T>({
  title,
  items,
  renderItem,
  buttonText,
  onButtonClick,
  headerBadge,
  className,
  emptyMessage = "Nenhum item encontrado",
}: ListWithButtonProps<T>) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {headerBadge !== undefined && (
            <span className="bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {typeof headerBadge === "number" 
                ? `${headerBadge} ${headerBadge === 1 ? "pendente" : "pendentes"}`
                : headerBadge}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {emptyMessage}
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index}>{renderItem(item, index)}</div>
            ))}
          </div>
        )}
      </CardContent>
      {buttonText && (
        <CardFooter className="border-t pt-4">
          <Button
            variant="secondary"
            className="w-full"
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

