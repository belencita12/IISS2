"use client"

import { PawPrint, Calendar, Weight, CircleDot, Info } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export const PetInfoCardSkeleton = () => {
  return (
    <div className="flex flex-col xl:flex-row xl:flex-wrap items-center gap-4 xl:gap-6 w-full">
      {/* Imagen de la mascota */}
      <div className="w-full xl:w-auto flex justify-center xl:justify-start">
        <Skeleton className="w-24 h-24 rounded-full" />
      </div>

      {/* Detalles de la mascota */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-6 flex-1 w-full">
        {[Info, PawPrint, PawPrint, Calendar, Weight, CircleDot].map((Icon, idx) => (
          <div key={idx} className="flex items-start gap-3 w-full min-w-0">
            <div className="bg-muted rounded-full p-2 flex-shrink-0">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-20" /> {/* Label */}
              <Skeleton className="h-5 w-20" /> {/* Valor */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}