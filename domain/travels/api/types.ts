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

