/**
 * Booking Session - Estratégia Híbrida de Navegação
 *
 * DECISÃO DE ARQUITETURA (validar em PR):
 * Usamos sessionStorage para persistir os dados da seleção de voos entre a página
 * de busca e a página de finalização. Isso permite:
 *
 * - Evitar refetch da API ao navegar para /finalizar
 * - Manter os objetos completos (FlightOption) com preços, datas, companhias, etc.
 * - Limpeza automática ao fechar a aba (sessionStorage é escopo da aba)
 *
 * O QUE ARMAZENAMOS:
 * - selectedOutbound: voo de ida selecionado
 * - selectedReturn: voo de volta (opcional)
 * - searchParams: parâmetros da busca (origem, destino, datas, passageiros)
 * - timestamp: para validar TTL (Time-To-Live)
 *
 * O QUE NÃO ARMAZENAMOS (segurança):
 * - Tokens de autenticação (ficam em auth_token / auth_user)
 * - Dados sensíveis do usuário
 * - Dados de pagamento
 *
 * Os dados de voo são metadados públicos de seleção (origem, destino, preços).
 * O backend sempre valida e revalida o request na hora da reserva.
 */

import type { FlightOption, FlightSearchParams } from "@/domain/travels/api/types"

/** Chave usada no sessionStorage */
export const BOOKING_SESSION_KEY = "velt_booking_session"

/** TTL em milissegundos (30 minutos). Após isso, a sessão é considerada expirada. */
export const BOOKING_SESSION_TTL_MS = 30 * 60 * 1000

export interface BookingSessionData {
  selectedOutbound: FlightOption
  selectedReturn: FlightOption | null
  searchParams: Partial<FlightSearchParams>
  /** Session ID from flight search API; required for confirm-flight */
  searchSessionId?: string
  timestamp: number
}

/**
 * Salva a sessão de reserva no sessionStorage.
 * Chamar na página de busca antes de navegar para /inicio/viagens/finalizar.
 *
 * @param data - Dados da seleção de voos e parâmetros da busca
 */
export function saveBookingSession(data: BookingSessionData): void {
  if (typeof window === "undefined") return
  try {
    const payload = {
      ...data,
      timestamp: Date.now(),
    }
    sessionStorage.setItem(BOOKING_SESSION_KEY, JSON.stringify(payload))
  } catch (e) {
    console.error("[booking-session] Erro ao salvar sessão:", e)
  }
}

/**
 * Recupera a sessão de reserva do sessionStorage.
 * Retorna null se não existir, estiver expirada (TTL) ou em caso de erro.
 *
 * Fluxo: na página /finalizar, chamar ao montar. Se null, redirecionar para
 * /inicio/viagens/busca com toast de "Sessão expirada".
 *
 * @returns Dados da sessão ou null
 */
export function getBookingSession(): BookingSessionData | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(BOOKING_SESSION_KEY)
    if (!raw) return null

    const data = JSON.parse(raw) as BookingSessionData & { timestamp?: number }
    const ts = data.timestamp ?? 0

    if (Date.now() - ts > BOOKING_SESSION_TTL_MS) {
      clearBookingSession()
      return null
    }

    if (!data.selectedOutbound) return null
    return data as BookingSessionData
  } catch {
    clearBookingSession()
    return null
  }
}

/**
 * Limpa a sessão de reserva.
 * Chamar após conclusão da reserva ou quando o usuário cancelar/voltar.
 */
export function clearBookingSession(): void {
  if (typeof window === "undefined") return
  try {
    sessionStorage.removeItem(BOOKING_SESSION_KEY)
  } catch (e) {
    console.error("[booking-session] Erro ao limpar sessão:", e)
  }
}
