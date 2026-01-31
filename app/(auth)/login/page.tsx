import { Logo } from "@/components/shared/logo"
import { LoginForm } from "@/domain/auth/components/login-form"

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-800 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Logo and Description */}
        <div className="hidden md:flex flex-col gap-6 text-white">
          <Logo />
          <p className="text-lg text-slate-200 max-w-md">
            Acesse sua conta para gerenciar viagens corporativas, aprovar
            solicitações e controlar despesas de forma simples e eficiente.
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex justify-center md:justify-end">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}