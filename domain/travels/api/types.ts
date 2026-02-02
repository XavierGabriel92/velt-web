export interface UpcomingTravel {
  id: string
  traveler: string
  destination: string
  date: string
  status: "Aprovado" | "Pendente" | "Rejeitado"
}

export interface FlightsMetrics {
  currentMonth: number
  previousMonth: number
  change: number
  changeType: "positive" | "negative"
}

// Flight search types
export type TripType = "RoundTrip" | "OneWay"
export type CabinClass = "Economy" | "Business"

export interface FlightSearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  tripType: TripType
  adults: number
  children?: number
  infants?: number
  cabinClass: CabinClass
  travelerIds?: string[]
}

export interface Traveler {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  documentType?: string
  documentNumber?: string
}

/** Dados do formulário por passageiro (expandido). birthDate/gender/passport podem não existir no backend. */
export interface PassengerFormData {
  firstName: string
  lastName: string
  email: string
  birthDate?: string
  phone?: string
  document?: string
  gender?: string
  passport?: string
}

export interface LastFlightSearch extends FlightSearchParams {
  travelerNames?: string
  createdAt: string
}

// Flight search API response (align with backend FlightSearchResult / test-direct)
export interface BaggageAllowance {
  checkedBaggageCount?: number
  checkedBaggageWeight?: number
  carryOnCount: number
  carryOnWeight: number
}

export interface FlightOption {
  id: string
  hash?: string
  returnFlightHash?: string
  airline: string
  origin: string
  destination: string
  departureDate: string
  arrivalDate?: string
  returnDate?: string
  price: number
  priceInCash: number
  priceInMiles: number
  basePriceCash: number
  basePriceMiles: number
  milesRequired: number
  embarkationTax: number
  fareTypeMiles?: string
  fareTypeCash?: string
  finalPrice?: number
  isFromCombination: boolean
  combinationId?: string
  correlatedReturnFlights?: string[]
  combinationTotalPrice?: number
  combinationTotalMiles?: number
  combinationTotalEmbarkationTax?: number
  isOutbound: boolean
  isReturn: boolean
  flightNumber?: string
  cabinClass: string
  stops: number
  duration: string
  baggageAllowance?: BaggageAllowance
  airportChange?: boolean
}

export interface FlightSearchResponse {
  searchSessionId: string
  provider: string
  status: "completed" | "failed" | "in_progress"
  flights: FlightOption[]
  minimumPrice?: number
  errorMessage?: string
  processedAt: string
}

export interface ReturnFlightSearchRequest {
  originalSearchSessionId: string
  selectedOutboundFlightId: string
  selectedOutboundHash?: string
  returnDate: string
  adults: number
  children?: number
  infants?: number
  cabinClass: CabinClass
  userId?: string
  travelerIds?: string[]
}

export interface ReturnFlightsResponse {
  searchSessionId: string
  correlatedFlights: FlightOption[]
  otherFlights: FlightOption[]
  status: "completed" | "failed"
  errorMessage?: string
  processedAt: string
}

// Confirm flight (B2B creates Travel; B2C returns payment initiation)
export interface ConfirmFlightRequest {
  searchSessionId: string
  selectedFlightId: string
  returnFlightId?: string
  travelerIds: string[]
  companyId: string
  travelReportId?: string
  costCenterId?: string
  title?: string
}

export interface ConfirmFlightResponse {
  travelId: string
  travelItemId: string
  status: string
  requiresApproval: boolean
  validationViolations?: string[]
}

/** B2C: API returns payment initiation instead of Travel */
export interface InitiatePaymentResponse {
  paymentToken: string
  flightData: SignedFlightData
  totalPrice: number
  departureDate: string
  signatureTimestamp: string
}

export interface SignedFlightData {
  searchSessionId: string
  flightId: string
  returnFlightId?: string | null
  totalPrice: number
  departureDate: string
  companyId: string
  travelerIds: string[]
  signature: string
  airline?: string
  origin?: string
  destination?: string
  flightNumber?: string | null
}

// Policy validation (B2B before confirm)
export interface ValidatePolicyRequest {
  companyId: string
  productType: "Hotel" | "Aereo" | "AluguelCarro"
  userId: string
  price: number
  deadlineDate?: string
  travelerIds?: string[]
  isRoundTrip?: boolean
}

export interface PolicyValidationResultDto {
  isValid: boolean
  violations: string[]
  requiresSecondLevel?: boolean
  policyId?: string
  policyName?: string
}

