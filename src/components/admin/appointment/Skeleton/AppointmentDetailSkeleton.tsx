"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const AppointmentDetailSkeleton = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap justify-between items-start gap-2">
          <div className="min-w-0">
            <CardTitle className="text-base">
              <Skeleton className="h-5 w-40" />
            </CardTitle>
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Programación */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
          </div>

          {/* Servicios */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-14 w-full rounded-lg" />
          </div>

          {/* Estado */}
          <div className="md:col-span-2 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-14 w-full rounded-lg" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
