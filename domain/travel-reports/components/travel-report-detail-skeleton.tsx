"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Loading } from "@/components/ui/loading"

export function TravelReportDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between gap-2">
            <div className="h-7 w-64 rounded bg-muted animate-pulse" />
            <div className="h-6 w-24 rounded-full bg-muted animate-pulse" />
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            <div className="h-4 w-40 bg-muted rounded animate-pulse" />
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-4 w-48 bg-muted rounded animate-pulse mt-2" />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border">
                <CardHeader className="pb-2">
                  <div className="h-5 w-24 bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <Loading size="sm" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="border-b">
          <div className="h-6 w-40 rounded bg-muted animate-pulse" />
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 border-b last:border-0 flex items-center justify-between gap-2">
                <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
