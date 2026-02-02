export interface CostCenter {
  id: string
  companyId: string
  code: string
  name: string
  value?: number
  period?: string | number
  isActive: boolean
  createdAt: string
  updatedAt: string
}
