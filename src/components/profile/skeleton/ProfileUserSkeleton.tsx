"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function ProfileUserSkeleton() {
  return (
    <div className="py-6 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-violet-300 via-violet-500 to-fuchsia-300 h-24 relative px-4 flex items-center text-white">
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
            <Skeleton className="w-32 h-32 rounded-full border-4 border-white shadow-md" />
          </div>
        </div>

        <div className="pt-20 pb-6 px-6">
          <div className="text-center mb-6">
            <Skeleton className="h-6 w-40 mx-auto mb-2" />
            <Skeleton className="h-4 w-28 mx-auto" />
          </div>

          <div className="space-y-4 bg-gray-50 rounded-xl p-5">
            <InfoSkeleton />
            <div className="border-t border-gray-200 pt-4" />
            <InfoSkeleton />
            <div className="border-t border-gray-200 pt-4" />
            <InfoSkeleton />
          </div>

          <div className="mt-6 flex justify-center">
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoSkeleton() {
  return (
    <div className="flex items-start">
      <Skeleton className="w-5 h-5 rounded-full mr-3 mt-0.5" />
      <div className="flex-1">
        <Skeleton className="h-4 w-24 mb-1" />
        <Skeleton className="h-5 w-full" />
      </div>
    </div>
  )
}
