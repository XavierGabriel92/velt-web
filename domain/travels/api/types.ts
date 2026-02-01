export interface UpcomingTravel {
  id: string
  traveler: string
  destination: string
  date: string
  status: "Aprovado" | "Pendente" | "Rejeitado"
}

export interface TravelReportResponse {
  id: string
  companyId: string
  companyName: string
  title: string
  description?: string
  reason?: string
  startDate: string
  endDate: string
  travelIds: string[]
  expenseIds: string[]
  createdByUserId: string
  createdByUserName: string
  travelsCount: number
  expensesCount: number
  createdAt: string
  updatedAt: string
  firstTravelerName?: string
  otherTravelersCount?: number
  travelerNames?: string[]
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}

export interface TravelReportFilterRequest {
  companyId?: string
  endDateFrom?: string
  page?: number
  pageSize?: number
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
}

export interface LastFlightSearch extends FlightSearchParams {
  travelerNames?: string
  createdAt: string
}

