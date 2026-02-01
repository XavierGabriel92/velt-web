import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface ListWithButtonProps<T> {
  title: string
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  /** Extrai chave estável do item para o React (melhor que index) */
  getItemKey?: (item: T, index: number) => string | number
  buttonText: string
  onButtonClick?: () => void
  headerBadge?: number | string
  headerIcon?: LucideIcon
  /** Conteúdo extra no header (ex: seletor de mock) */
  headerExtra?: React.ReactNode
  className?: string
  emptyMessage?: string
}

export function ListWithButton<T>({
  title,
  items,
  renderItem,
  getItemKey,
  buttonText,
  onButtonClick,
  headerBadge,
  headerExtra,
  className,
  emptyMessage = "Nenhum item encontrado",
}: ListWithButtonProps<T>) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <div className="flex items-center gap-2">
            {headerBadge !== undefined && (
            <span className="bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {typeof headerBadge === "number" 
                ? `${headerBadge} ${headerBadge === 1 ? "pendente" : "pendentes"}`
                : headerBadge}
            </span>
          )}
            {headerExtra}
          </div>
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
              <div key={getItemKey?.(item, index) ?? index}>{renderItem(item, index)}</div>
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

