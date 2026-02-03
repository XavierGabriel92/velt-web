"use client"

import { useState, useMemo } from "react"
import { useCompanyTravelers } from "../api/use-company-travelers"
import { useAuth } from "@/lib/auth-context"
import { Label } from "@/components/ui/label"
import { ChevronDown, User } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import type { Traveler } from "../api/types"

const SELECTOR_BASE =
  "flex items-center justify-between gap-2 h-9 px-3 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#1E293B] hover:bg-gray-50"

interface TravelerSelectProps {
  value: string[]
  onChange: (travelerIds: string[]) => void
  maxSelection: number
  disabled?: boolean
}

export function TravelerSelect({
  value,
  onChange,
  maxSelection,
  disabled,
}: TravelerSelectProps) {
  const { user } = useAuth()
  const { data: travelers, isLoading } = useCompanyTravelers()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTravelers = useMemo(() => {
    if (!searchQuery.trim()) return travelers
    const q = searchQuery.toLowerCase()
    return travelers.filter(
      (t) =>
        t.firstName.toLowerCase().includes(q) ||
        t.lastName.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q)
    )
  }, [travelers, searchQuery])

  const toggleTraveler = (travelerId: string) => {
    const isSelected = value.includes(travelerId)
    if (isSelected) {
      onChange(value.filter((id) => id !== travelerId))
    } else {
      if (value.length >= maxSelection) return
      onChange([...value, travelerId])
    }
  }

  const handleConclude = () => {
    setIsOpen(false)
  }

  const handleClear = () => {
    onChange([])
  }

  const getDisplayText = () => {
    if (value.length === 0) return "Selecionar viajante"
    if (value.length === 1) {
      const t = travelers.find((x) => x.id === value[0])
      return t
        ? t.id === user?.userId
          ? "Eu mesmo"
          : `${t.firstName} ${t.lastName}`
        : "1 selecionado"
    }
    const first = travelers.find((x) => x.id === value[0])
    const name = first
      ? first.id === user?.userId
        ? "Eu mesmo"
        : `${first.firstName} ${first.lastName}`
      : "Viajante"
    return `${name} + ${value.length - 1}`
  }

  return (
    <div className="flex flex-row items-center gap-2">
      <Label className="text-sm font-medium text-[#1E293B] shrink-0">
        Viajante:
      </Label>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled || isLoading}
          className={`${SELECTOR_BASE} w-[200px] disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span className="flex items-center gap-2 truncate">
            <User className="h-4 w-4 shrink-0 text-[#FF6600]" />
            {isLoading ? "Carregando..." : getDisplayText()}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-[#64748B] opacity-50 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute left-0 top-full z-20 mt-1 w-80 rounded-xl border border-[#E2E8F0] bg-white shadow-lg">
              <div className="p-4">
                <p className="text-xs text-[#64748B] mb-3">
                  Selecione até {maxSelection} viajante(s) (adultos)
                </p>
                <Input
                  placeholder="Buscar viajante..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-4 h-9 border-[#E2E8F0] rounded-xl text-sm"
                />
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {filteredTravelers.map((traveler) => (
                    <label
                      key={traveler.id}
                      className={`flex items-center gap-2 cursor-pointer rounded-lg px-2 py-2 hover:bg-gray-50 ${
                        value.includes(traveler.id) ? "bg-primary/5" : ""
                      }`}
                    >
                      <Checkbox
                        checked={value.includes(traveler.id)}
                        onCheckedChange={() => toggleTraveler(traveler.id)}
                        disabled={
                          !value.includes(traveler.id) &&
                          value.length >= maxSelection
                        }
                      />
                      <span className="text-sm text-[#1E293B]">
                        {traveler.id === user?.userId
                          ? "Eu mesmo"
                          : `${traveler.firstName} ${traveler.lastName}`}
                      </span>
                    </label>
                  ))}
                  {filteredTravelers.length === 0 && (
                    <p className="py-4 text-center text-sm text-[#64748B]">
                      Nenhum viajante encontrado
                    </p>
                  )}
                </div>
                <div className="mt-4 flex justify-between border-t border-[#E2E8F0] pt-3">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-sm text-[#64748B] hover:text-[#1E293B]"
                  >
                    Limpar
                  </button>
                  <button
                    type="button"
                    onClick={handleConclude}
                    className="text-sm font-medium text-[#FF6600] hover:underline"
                  >
                    Concluir
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
