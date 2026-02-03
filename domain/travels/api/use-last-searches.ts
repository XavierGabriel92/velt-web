"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import type { FlightSearchParams, LastFlightSearch } from "./types"

const STORAGE_KEY_PREFIX = "velt_last_flight_searches_"
const MAX_SEARCHES = 5

function getStorageKey(userId: string) {
  return `${STORAGE_KEY_PREFIX}${userId}`
}

export function useLastSearches() {
  const { user } = useAuth()
  const [searches, setSearches] = useState<LastFlightSearch[]>([])

  const loadSearches = useCallback(() => {
    if (typeof window === "undefined" || !user?.userId) {
      setSearches([])
      return
    }
    try {
      const stored = localStorage.getItem(getStorageKey(user.userId))
      if (stored) {
        const parsed = JSON.parse(stored) as LastFlightSearch[]
        setSearches(Array.isArray(parsed) ? parsed.slice(0, MAX_SEARCHES) : [])
      } else {
        setSearches([])
      }
    } catch {
      setSearches([])
    }
  }, [user?.userId])

  useEffect(() => {
    loadSearches()
  }, [loadSearches])

  const saveSearch = useCallback(
    (params: FlightSearchParams, travelerNames?: string) => {
      if (!user?.userId) return
      const newSearch: LastFlightSearch = {
        ...params,
        travelerNames,
        createdAt: new Date().toISOString(),
      }
      setSearches((prev) => {
        const filtered = prev.filter(
          (s) =>
            !(
              s.origin === newSearch.origin &&
              s.destination === newSearch.destination &&
              s.departureDate === newSearch.departureDate &&
              s.returnDate === newSearch.returnDate &&
              s.adults === newSearch.adults
            )
        )
        const updated = [newSearch, ...filtered].slice(0, MAX_SEARCHES)
        try {
          localStorage.setItem(getStorageKey(user.userId), JSON.stringify(updated))
        } catch {
          // ignore storage errors
        }
        return updated
      })
    },
    [user?.userId]
  )

  const getLastSearches = useCallback(() => searches, [searches])

  return { searches, saveSearch, getLastSearches, refresh: loadSearches }
}
