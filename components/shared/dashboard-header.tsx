"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/shared/logo"
import { Button } from "@/components/ui/button"
import { CompanySelector } from "@/components/shared/company-selector"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

export function DashboardHeader() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const getUserInitials = () => {
    if (!user) return "U"
    const firstName = user.firstName || ""
    const lastName = user.lastName || ""
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U"
  }

  const navItems = [
    { label: "Início", href: "/inicio" },
    { label: "Viagens", href: "/inicio/viagens" },
    { label: "Aprovações", href: "#" },
    { label: "Despesas", href: "/inicio/despesas" },
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
            {navItems.map((item) => {
              const isActive =
                item.href !== "#" &&
                (item.href === "/inicio"
                  ? pathname === "/inicio"
                  : pathname.startsWith(item.href))
              return (
                <Button
                  key={item.label}
                  variant="ghost"
                  className={cn(
                    "rounded-full",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                  asChild
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              )
            })}
          </nav>

          {/* Company Selector + User */}
          <div className="flex shrink-0 items-center gap-3">
            <CompanySelector />
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {user.firstName} {user.lastName}
                </span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Sair
                </Button>
                <div className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  {getUserInitials()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

