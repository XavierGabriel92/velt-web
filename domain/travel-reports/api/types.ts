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
  startDateFrom?: string
  startDateTo?: string
  createdByUserId?: string
  search?: string
  page?: number
  pageSize?: number
}

export interface CreateTravelReportRequest {
  companyId: string
  title: string
  description?: string
  reason?: string
  startDate: string
  endDate: string
}

export interface UpdateTravelReportRequest {
  title?: string
  description?: string
  reason?: string
  startDate?: string
  endDate?: string
}
