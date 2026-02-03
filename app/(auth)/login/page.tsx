import { Logo } from "@/components/shared/logo"
import { LoginForm } from "@/domain/auth/components/login-form"

export default function Login() {
  return (
    <div className="min-h-screen bg-[#1E293B] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Logo and Description */}
        <div className="hidden md:flex flex-col gap-8 items-start">
          <Logo />
          <h1 className="text-2xl font-normal leading-8 text-white">
            Bem-vindo de volta!
          </h1>
          <p className="text-lg leading-7 text-[#64748B] max-w-md">
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