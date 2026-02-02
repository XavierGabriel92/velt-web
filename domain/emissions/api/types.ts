export interface Ticket {
  id: string
  travelItemId: string
  fileName: string
  contentType: string
  fileSize: number
  description?: string
  uploadedAt: string
  uploadedByUserName: string
}
