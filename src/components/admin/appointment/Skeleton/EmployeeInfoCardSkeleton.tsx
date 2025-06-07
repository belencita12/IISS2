"use client"

import { Skeleton } from "@/components/ui/skeleton"

export const EmployeeInfoCardSkeleton = () => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
      <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
      <div className="space-y-2 w-full">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  )
}