"use client"

import { Skeleton } from "@/components/ui/skeleton"

export const EmployeeInfoCardSkeleton = () => {
  return (
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4 p-4 bg-muted/30 rounded-lg">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" /> 
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
  )
}