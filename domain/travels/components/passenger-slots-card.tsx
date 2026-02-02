"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useCompanyTravelers } from "../api/use-company-travelers"
import { useAuth } from "@/lib/auth-context"
import { User, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Traveler, PassengerFormData, FlightOption } from "../api/types"

export interface PassengerSlotState {
  travelerId: string | null
  formData: PassengerFormData
  expanded: boolean
}

export function slotLabel(
  index: number,
  adults: number,
  children: number,
  infants: number
): { type: "adulto" | "criança" | "bebê"; number: number } {
  if (index < adults) return { type: "adulto", number: index + 1 }
  if (index < adults + children) return { type: "criança", number: index - adults + 1 }
  return { type: "bebê", number: index - adults - children + 1 }
}

function slotLabelDisplay(index: number, adults: number, children: number, infants: number): string {
  const { type, number } = slotLabel(index, adults, children, infants)
  const cap = type.charAt(0).toUpperCase() + type.slice(1)
  return `${cap} ${number}`
}

interface PassengerSlotsCardProps {
  /** Total de passageiros (adultos + crianças + bebês) */
  passengerCount: number
  adults: number
  children: number
  infants: number
  initialTravelerIds: string[]
  companyId: string | null
  companyName?: string
  selectedOutbound: FlightOption
  selectedReturn: FlightOption | null
  onTravelerIdsChange: (ids: string[]) => void
  className?: string
}

function travelerToFormData(t: Traveler): PassengerFormData {
  return {
    firstName: t.firstName ?? "",
    lastName: t.lastName ?? "",
    email: t.email ?? "",
    phone: t.phoneNumber ?? "",
    document: t.documentNumber ?? "",
    gender: "",
    passport: t.documentType === "Passport" ? t.documentNumber ?? "" : "",
  }
}

const NEW_TRAVELER_VALUE = "__new__"

export function PassengerSlotsCard({
  passengerCount,
  adults,
  children,
  infants,
  initialTravelerIds,
  companyId,
  companyName,
  selectedOutbound,
  selectedReturn,
  onTravelerIdsChange,
  className,
}: PassengerSlotsCardProps) {
  const { user, selectedCompany } = useAuth()
  const { data: companyTravelers } = useCompanyTravelers()
  const isB2C = companyName === "B2C Consumer"

  const initialSlots = useMemo((): PassengerSlotState[] => {
    const list: PassengerSlotState[] = []
    const travelersList = isB2C && user
      ? [{ id: user.userId, firstName: user.firstName ?? "Eu", lastName: user.lastName ?? "", email: user.email ?? "" }]
      : (companyTravelers ?? [])
    for (let i = 0; i < passengerCount; i++) {
      const tid = initialTravelerIds[i] ?? null
      const t = tid ? travelersList.find((x) => x.id === tid) : null
      list.push({
        travelerId: tid,
        formData: t ? travelerToFormData(t as Traveler) : { firstName: "", lastName: "", email: "" },
        expanded: false,
      })
    }
    return list
  }, [passengerCount, initialTravelerIds, isB2C, user, companyTravelers])

  const [slots, setSlots] = useState<PassengerSlotState[]>(initialSlots)

  useEffect(() => {
    setSlots(initialSlots)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passengerCount, initialTravelerIds.join(","), isB2C, companyTravelers?.length, user?.userId])

  const ids = useMemo(
    () => slots.map((s) => s.travelerId).filter((id): id is string => id != null),
    [slots]
  )

  useEffect(() => {
    onTravelerIdsChange(ids)
  }, [ids.join(","), onTravelerIdsChange])

  const setSlot = useCallback((index: number, update: Partial<PassengerSlotState>) => {
    setSlots((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], ...update }
      return next
    })
  }, [])

  const toggleExpanded = useCallback((index: number) => {
    setSlots((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], expanded: !next[index].expanded }
      return next
    })
  }, [])

  const availableTravelers = useMemo(() => {
    const selected = new Set(slots.map((s) => s.travelerId).filter(Boolean))
    if (isB2C && user) {
      return selected.has(user.userId) ? [] : [{ id: user.userId, firstName: user.firstName ?? "Eu", lastName: user.lastName ?? "", email: user.email ?? "" }]
    }
    return (companyTravelers ?? []).filter((t) => !selected.has(t.id))
  }, [slots, isB2C, user, companyTravelers])

  const selectTraveler = useCallback(
    (slotIndex: number, travelerId: string) => {
      if (travelerId === NEW_TRAVELER_VALUE) {
        setSlot(slotIndex, {
          travelerId: null,
          formData: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            document: "",
            gender: "",
            passport: "",
          },
          expanded: true,
        })
        return
      }
      const t = isB2C && user && user.userId === travelerId
        ? { id: user.userId, firstName: user.firstName ?? "Eu", lastName: user.lastName ?? "", email: user.email ?? "" }
        : (companyTravelers ?? []).find((x) => x.id === travelerId)
      if (!t) return
      setSlot(slotIndex, {
        travelerId,
        formData: travelerToFormData(t as Traveler),
        expanded: true,
      })
    },
    [isB2C, user, companyTravelers, setSlot]
  )

  const clearSlot = useCallback(
    (index: number) => {
      setSlot(index, {
        travelerId: null,
        formData: { firstName: "", lastName: "", email: "" },
        expanded: false,
      })
    },
    [setSlot]
  )

  return (
    <Card
      className={`rounded-2xl border border-[#E5E7EB] bg-white shadow-sm ${className ?? ""}`}
    >
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold text-[#1E293B] mb-1">
          Quem vai viajar?
        </h3>
        <p className="text-sm text-[#64748B] mb-4">
          Preencha os dados do passageiro exatamente como no documento
        </p>
        <div className="space-y-3">
          {slots.map((slot, index) => (
            <div
              key={index}
              data-testid={`passenger-slot-${index + 1}`}
              className="rounded-xl border border-[#E5E7EB] bg-[#FCFCFA] overflow-hidden"
            >
              {!slot.travelerId && !slot.expanded ? (
                <div className="p-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm text-[#64748B]">
                    <User className="size-4 shrink-0 text-[#FF3C00]" />
                    <span>{slotLabelDisplay(index, adults, children, infants)}</span>
                  </div>
                  {isB2C && index === 0 && user ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-[#E5E7EB]"
                      onClick={() => selectTraveler(index, user.userId)}
                    >
                      Eu mesmo
                    </Button>
                  ) : !isB2C && companyId ? (
                    <Select
                      value=""
                      onValueChange={(id) => id && selectTraveler(index, id)}
                    >
                      <SelectTrigger className="w-[200px] rounded-xl border-[#E5E7EB]">
                        <SelectValue placeholder="Selecionar viajante" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NEW_TRAVELER_VALUE}>Novo</SelectItem>
                        {availableTravelers.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.id === user?.userId ? "Eu mesmo" : `${t.firstName} ${t.lastName}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : null}
                </div>
              ) : !slot.travelerId && slot.expanded ? (
                /* Novo: formulário em branco */
                <div className="p-3 border-b border-[#E5E7EB]">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#1E293B]">
                      <User className="size-4 shrink-0 text-[#FF3C00]" />
                      <span>{slotLabelDisplay(index, adults, children, infants)} (novo)</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-[#64748B]"
                      onClick={() => setSlot(index, { expanded: false })}
                    >
                      Cancelar
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`p${index}-firstName`}>Nome *</Label>
                      <Input
                        id={`p${index}-firstName`}
                        value={slot.formData.firstName}
                        onChange={(e) =>
                          setSlot(index, {
                            formData: { ...slot.formData, firstName: e.target.value },
                          })
                        }
                        placeholder="Digite seu nome"
                        className="rounded-xl border-[#E5E7EB]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`p${index}-lastName`}>Sobrenome *</Label>
                      <Input
                        id={`p${index}-lastName`}
                        value={slot.formData.lastName}
                        onChange={(e) =>
                          setSlot(index, {
                            formData: { ...slot.formData, lastName: e.target.value },
                          })
                        }
                        placeholder="Digite seu sobrenome"
                        className="rounded-xl border-[#E5E7EB]"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor={`p${index}-email`}>E-mail *</Label>
                      <Input
                        id={`p${index}-email`}
                        type="email"
                        value={slot.formData.email}
                        onChange={(e) =>
                          setSlot(index, {
                            formData: { ...slot.formData, email: e.target.value },
                          })
                        }
                        placeholder="Digite seu e-mail"
                        className="rounded-xl border-[#E5E7EB]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`p${index}-phone`}>Celular *</Label>
                      <Input
                        id={`p${index}-phone`}
                        value={slot.formData.phone ?? ""}
                        onChange={(e) =>
                          setSlot(index, {
                            formData: { ...slot.formData, phone: e.target.value },
                          })
                        }
                        placeholder="(11) 99999-9999"
                        className="rounded-xl border-[#E5E7EB]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`p${index}-birthDate`}>Data de Nascimento *</Label>
                      <Input
                        id={`p${index}-birthDate`}
                        type="date"
                        value={slot.formData.birthDate ?? ""}
                        onChange={(e) =>
                          setSlot(index, {
                            formData: { ...slot.formData, birthDate: e.target.value },
                          })
                        }
                        className="rounded-xl border-[#E5E7EB]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`p${index}-document`}>CPF *</Label>
                      <Input
                        id={`p${index}-document`}
                        value={slot.formData.document ?? ""}
                        onChange={(e) =>
                          setSlot(index, {
                            formData: { ...slot.formData, document: e.target.value },
                          })
                        }
                        placeholder="000.000.000-00"
                        className="rounded-xl border-[#E5E7EB]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`p${index}-gender`}>Sexo</Label>
                      <Select
                        value={
                          slot.formData.gender === "" || slot.formData.gender == null
                            ? "na"
                            : slot.formData.gender
                        }
                        onValueChange={(v) =>
                          setSlot(index, {
                            formData: {
                              ...slot.formData,
                              gender: v === "na" ? "" : v,
                            },
                          })
                        }
                      >
                        <SelectTrigger id={`p${index}-gender`} className="rounded-xl border-[#E5E7EB]">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Masculino</SelectItem>
                          <SelectItem value="F">Feminino</SelectItem>
                          <SelectItem value="O">Outro</SelectItem>
                          <SelectItem value="na">Não informar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`p${index}-passport`}>Passaporte (opcional)</Label>
                      <Input
                        id={`p${index}-passport`}
                        value={slot.formData.passport ?? ""}
                        onChange={(e) =>
                          setSlot(index, {
                            formData: { ...slot.formData, passport: e.target.value },
                          })
                        }
                        placeholder="Número do passaporte"
                        className="rounded-xl border-[#E5E7EB]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-full p-3 flex items-center justify-between gap-2">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleExpanded(index)}
                      onKeyDown={(e) =>
                        e.key === "Enter" || e.key === " "
                          ? (e.preventDefault(), toggleExpanded(index))
                          : null
                      }
                      className="flex-1 flex items-center gap-3 min-w-0 text-left hover:bg-[#F1F5F9] rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF3C00]/30"
                    >
                      <div className="size-9 shrink-0 rounded-full bg-[#E5E7EB] flex items-center justify-center">
                        <User className="size-4 text-[#64748B]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-[#1E293B] truncate">
                          {slot.formData.firstName} {slot.formData.lastName}
                        </p>
                      </div>
                      {slot.expanded ? (
                        <ChevronUp className="size-4 text-[#64748B] shrink-0" />
                      ) : (
                        <ChevronDown className="size-4 text-[#64748B] shrink-0" />
                      )}
                    </div>
                  </div>
                  {slot.expanded && (
                    <div className="border-t border-[#E5E7EB] p-4 bg-white">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`p${index}-firstName`}>Nome *</Label>
                          <Input
                            id={`p${index}-firstName`}
                            value={slot.formData.firstName}
                            onChange={(e) =>
                              setSlot(index, {
                                formData: { ...slot.formData, firstName: e.target.value },
                              })
                            }
                            placeholder="Digite seu nome"
                            className="rounded-xl border-[#E5E7EB]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`p${index}-lastName`}>Sobrenome *</Label>
                          <Input
                            id={`p${index}-lastName`}
                            value={slot.formData.lastName}
                            onChange={(e) =>
                              setSlot(index, {
                                formData: { ...slot.formData, lastName: e.target.value },
                              })
                            }
                            placeholder="Digite seu sobrenome"
                            className="rounded-xl border-[#E5E7EB]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`p${index}-email`}>E-mail *</Label>
                          <Input
                            id={`p${index}-email`}
                            type="email"
                            value={slot.formData.email}
                            onChange={(e) =>
                              setSlot(index, {
                                formData: { ...slot.formData, email: e.target.value },
                              })
                            }
                            placeholder="Digite seu e-mail"
                            className="rounded-xl border-[#E5E7EB]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`p${index}-phone`}>Celular *</Label>
                          <Input
                            id={`p${index}-phone`}
                            value={slot.formData.phone ?? ""}
                            onChange={(e) =>
                              setSlot(index, {
                                formData: { ...slot.formData, phone: e.target.value },
                              })
                            }
                            placeholder="(11) 99999-9999"
                            className="rounded-xl border-[#E5E7EB]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`p${index}-birthDate`}>Data de Nascimento *</Label>
                          <Input
                            id={`p${index}-birthDate`}
                            type="date"
                            value={slot.formData.birthDate ?? ""}
                            onChange={(e) =>
                              setSlot(index, {
                                formData: { ...slot.formData, birthDate: e.target.value },
                              })
                            }
                            className="rounded-xl border-[#E5E7EB]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`p${index}-document`}>CPF *</Label>
                          <Input
                            id={`p${index}-document`}
                            value={slot.formData.document ?? ""}
                            onChange={(e) =>
                              setSlot(index, {
                                formData: { ...slot.formData, document: e.target.value },
                              })
                            }
                            placeholder="000.000.000-00"
                            className="rounded-xl border-[#E5E7EB]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`p${index}-gender`}>Sexo</Label>
                          <Select
                            value={
                              slot.formData.gender === "" ||
                              slot.formData.gender == null
                                ? "na"
                                : slot.formData.gender
                            }
                            onValueChange={(v) =>
                              setSlot(index, {
                                formData: {
                                  ...slot.formData,
                                  gender: v === "na" ? "" : v,
                                },
                              })
                            }
                          >
                            <SelectTrigger id={`p${index}-gender`} className="rounded-xl border-[#E5E7EB]">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="M">Masculino</SelectItem>
                              <SelectItem value="F">Feminino</SelectItem>
                              <SelectItem value="O">Outro</SelectItem>
                              <SelectItem value="na">Não informar</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`p${index}-passport`}>Passaporte (opcional)</Label>
                          <Input
                            id={`p${index}-passport`}
                            value={slot.formData.passport ?? ""}
                            onChange={(e) =>
                              setSlot(index, {
                                formData: { ...slot.formData, passport: e.target.value },
                              })
                            }
                            placeholder="Número do passaporte"
                            className="rounded-xl border-[#E5E7EB]"
                          />
                        </div>
                      </div>
                      {!isB2C && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="mt-3 text-[#64748B]"
                          onClick={() => clearSlot(index)}
                        >
                          Trocar viajante
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
