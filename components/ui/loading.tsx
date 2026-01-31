import { cn } from "@/lib/utils"

interface LoadingProps {
  /**
   * Texto a ser exibido abaixo do spinner
   */
  text?: string
  /**
   * Tamanho do spinner (padrão: "default")
   */
  size?: "sm" | "default" | "lg"
  /**
   * Classes CSS adicionais para o container
   */
  className?: string
  /**
   * Se true, ocupa a tela inteira (min-h-screen)
   */
  fullScreen?: boolean
}

/**
 * Componente de loading reutilizável
 */
export function Loading({
  text,
  size = "default",
  fullScreen = false,
  className,
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const containerClasses = cn(
    "flex items-center justify-center",
    fullScreen && "min-h-screen",
    className
  )

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div
          className={cn(
            "animate-spin rounded-full border-b-2 border-primary mx-auto",
            sizeClasses[size]
          )}
        />
        {text && (
          <p className="mt-4 text-muted-foreground">{text}</p>
        )}
      </div>
    </div>
  )
}

