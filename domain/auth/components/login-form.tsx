"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { User, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { InputMask } from "@/components/ui/input-mask"
import { useLogin } from "../api/use-login"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Função de validação de CPF
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/

// Remove a máscara do CPF, retornando apenas os números
function removeCpfMask(cpf: string): string {
  return cpf.replace(/\D/g, "")
}

const loginSchema = z.object({
  cpf: z
    .string()
    .min(1, "CPF é obrigatório")
    .refine(
      (value) => {
        const numbers = removeCpfMask(value)
        return numbers.length === 11
      },
      { message: "CPF deve ter 11 dígitos" }
    )
    .refine(
      (value) => cpfRegex.test(value),
      { message: "CPF inválido" }
    ),
  password: z
    .string()
    .min(1, "Senha é obrigatória"),
  rememberMe: z.boolean(),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false)
  const router = useRouter()
  const { refreshFromStorage } = useAuth()

  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
      cpf: "514.178.960-86",
      password: "Teste123!",
    },
  })

  const cpfValue = watch("cpf")
  const cpfRegister = register("cpf")

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Remove a máscara do CPF antes de enviar
      const cpfWithoutMask = removeCpfMask(data.cpf)

      const response = await loginMutation.mutateAsync({
        documentNumber: cpfWithoutMask,
        password: data.password,
      })

      refreshFromStorage()

      toast.success("Login realizado com sucesso!", {
        description: `Bem-vindo, ${response.firstName}!`,
      })

      setTimeout(() => {
        router.push("/inicio")
      }, 500)
    } catch (error) {
      // Tratar erro do TanStack Query
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao fazer login"
      
      // Mostrar toast de erro
      toast.error("Erro ao fazer login", {
        description: errorMessage,
      })
      
      setError("root", { message: errorMessage })
    }
  }

  return (
    <Card className="w-full max-w-md bg-gray-100 dark:bg-gray-800">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* CPF Field */}
          <div className="space-y-2">
            <Label htmlFor="cpf" className="flex items-center gap-2">
              <User className="size-4" />
              CPF
            </Label>
            <InputMask
              mask="000.000.000-00"
              value={cpfValue || ""}
              onChange={(value) => {
                setValue("cpf", value, { shouldValidate: true })
              }}
              onBlur={cpfRegister.onBlur}
              id="cpf"
              placeholder="000.000.000-00"
              aria-invalid={errors.cpf ? "true" : "false"}
            />
            {errors.cpf && (
              <p className="text-sm text-destructive">{errors.cpf.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="size-4" />
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                {...register("password")}
                aria-invalid={errors.password ? "true" : "false"}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="size-4 cursor-pointer" />
                ) : (
                  <Eye className="size-4 cursor-pointer" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-end">
            {/* <div className="flex items-center gap-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) =>
                  setValue("rememberMe", checked === true)
                }
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm font-normal cursor-pointer"
              >
                Lembrar de mim
              </Label>
            </div> */}
            <Link
              href="/reset-password"
              className="text-sm text-primary hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>

          {/* Error Message */}
          {errors.root && (
            <p className="text-sm text-destructive text-center">
              {errors.root.message}
            </p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Entrando..." : "Entrar →"}
          </Button>

          {/* No Access Message */}
          <p className="text-sm text-center text-muted-foreground">
            Não tem acesso? Entre em contato com o{" "}
            <Link
              href="#"
              className="text-primary hover:underline"
            >
              administrador do sistema
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

