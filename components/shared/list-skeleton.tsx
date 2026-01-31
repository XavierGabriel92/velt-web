import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/loading"

interface ListSkeletonProps {
  title: string
}

export function ListSkeleton({ title }: ListSkeletonProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <Loading size="sm" />
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="secondary" className="w-full" disabled>
          Carregando...
        </Button>
      </CardFooter>
    </Card>
  )
}

