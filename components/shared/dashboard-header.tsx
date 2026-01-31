"use client"

import * as React from "react"
import { Logo } from "@/components/shared/logo"
import { Button } from "@/components/ui/button"
import { getAuthUser } from "@/lib/auth"
import { cn } from "@/lib/utils"

export function DashboardHeader() {
  const [user, setUser] = React.useState<any>(null)

  React.useEffect(() => {
    const authUser = getAuthUser()
    setUser(authUser)
  }, [])

  const getUserInitials = () => {
    if (!user) return "U"
    const firstName = user.firstName || ""
    const lastName = user.lastName || ""
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U"
  }

  const navItems = [
    { label: "Início", href: "/inicio" },
    { label: "Viagens", href: "#" },
    { label: "Aprovações", href: "#" },
    { label: "Despesas", href: "#" },
    { label: "Gestão", href: "#" },
  ]

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="shrink-0">
            <Logo />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className={cn(
                  "rounded-full",
                  item.label === "Início" && "bg-primary text-primary-foreground"
                )}
                onClick={() => {
                  // Placeholder - não faz nada por enquanto
                }}
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* User Avatar */}
          <div className="shrink-0">
            <div className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              {getUserInitials()}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

