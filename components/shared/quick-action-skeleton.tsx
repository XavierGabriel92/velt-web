import { Card, CardContent } from "@/components/ui/card"
import { Loading } from "@/components/ui/loading"

export function QuickActionSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-3">
          <Loading size="sm" />
        </div>
      </CardContent>
    </Card>
  )
}

