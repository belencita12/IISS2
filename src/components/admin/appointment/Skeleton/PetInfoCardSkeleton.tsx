"use client"

import { PawPrint, Calendar, Weight, CircleDot, Info } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export const PetInfoCardSkeleton = () => {
  return (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Imagen de la mascota */}
          <div className="flex-shrink-0 flex justify-center w-full md:w-auto">
            <Skeleton className="w-32 h-32 rounded-full" />
          </div>

          {/* Detalles de la mascota */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4 flex-grow">
            {[Info, PawPrint, PawPrint, Calendar, Weight, CircleDot].map(
              (Icon, idx) => (
                <div key={idx} className="flex items-center gap-3 min-w-0">
                  <div className="bg-muted rounded-full p-2 flex-shrink-0">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1 w-full">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
  )
}
