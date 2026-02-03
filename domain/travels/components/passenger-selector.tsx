"use client"

import { useState } from "react"
import { ChevronDown, Users } from "lucide-react"

interface PassengerSelectorProps {
  adults: number
  children: number
  infants: number
  onChange: (adults: number, children: number, infants: number) => void
  disabled?: boolean
}

export function PassengerSelector({
  adults,
  children,
  infants,
  onChange,
  disabled,
}: PassengerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const total = adults + children + infants
  const displayText =
    total === 1
      ? "1 passageiro"
      : `${total} passageiros`

  const increment = (type: "adults" | "children" | "infants", delta: number) => {
    if (type === "adults") {
      const newAdults = Math.max(1, adults + delta)
      onChange(newAdults, children, infants)
    } else if (type === "children") {
      const newChildren = Math.max(0, children + delta)
      onChange(adults, newChildren, infants)
    } else {
      const newInfants = Math.max(0, infants + delta)
      onChange(adults, children, newInfants)
    }
  }

  const selectorClass =
    "flex items-center justify-between gap-2 h-9 px-3 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#1E293B] hover:bg-gray-50 disabled:opacity-50"

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`${selectorClass} min-w-[120px]`}
      >
        <Users className="h-4 w-4 shrink-0 text-[#64748B] opacity-50" />
        <span>{displayText}</span>
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
          <div className="absolute left-0 top-full z-20 mt-1 w-56 rounded-xl border border-[#E2E8F0] bg-white shadow-lg p-4">
            <div className="space-y-4">
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-[#1E293B]">
                    Adultos
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => increment("adults", -1)}
                    disabled={adults <= 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-medium text-[#1E293B]">
                    {adults}
                  </span>
                  <button
                    type="button"
                    onClick={() => increment("adults", 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Children */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-[#1E293B]">
                    Crianças
                  </div>
                  <div className="text-xs text-[#64748B]">Até 12 anos</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => increment("children", -1)}
                    disabled={children <= 0}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-medium text-[#1E293B]">
                    {children}
                  </span>
                  <button
                    type="button"
                    onClick={() => increment("children", 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Infants */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-[#1E293B]">Bebês</div>
                  <div className="text-xs text-[#64748B]">Até 2 anos</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => increment("infants", -1)}
                    disabled={infants <= 0}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-medium text-[#1E293B]">
                    {infants}
                  </span>
                  <button
                    type="button"
                    onClick={() => increment("infants", 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
