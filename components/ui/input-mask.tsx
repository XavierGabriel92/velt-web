"use client"

import * as React from "react"
import { useIMask } from "react-imask"
import { cn } from "@/lib/utils"

interface InputMaskProps
  extends Omit<React.ComponentProps<"input">, "onChange" | "value"> {
  mask: string
  value?: string
  onChange?: (value: string) => void
  onAccept?: (value: string) => void
}

const InputMask = React.forwardRef<HTMLInputElement, InputMaskProps>(
  ({ mask, value, onChange, onAccept, className, ...props }, ref) => {
    const { ref: imaskRef, setValue: setImaskValue } = useIMask(
      {
        mask,
        unmask: false,
      },
      {
        onAccept: (val: string) => {
          if (onChange) {
            onChange(val)
          }
          if (onAccept) {
            onAccept(val)
          }
        },
      }
    )

    // Sincroniza o valor externo com o imask
    React.useEffect(() => {
      if (value !== undefined && imaskRef.current) {
        setImaskValue(value)
      }
    }, [value, setImaskValue, imaskRef])

    // Combina as refs
    React.useImperativeHandle(ref, () => {
      return (imaskRef.current as HTMLInputElement) || null
    })

    return (
      <input
        {...props}
        ref={imaskRef as React.Ref<HTMLInputElement>}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow,border-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "hover:border-ring/50",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
      />
    )
  }
)

InputMask.displayName = "InputMask"

export { InputMask }

