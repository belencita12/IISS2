"use client"

import { User, Phone, Mail, MapPin, Briefcase } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export const OwnerInfoCardSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Foto e info principal */}
      <div className="flex flex-col xl:flex-row items-center xl:items-start gap-4 xl:gap-6">
        <div className="w-full xl:w-auto flex justify-center xl:justify-start">
          <Skeleton className="w-24 h-24 rounded-full" />
        </div>
        <div className="text-center xl:text-left flex-1 min-w-0">
          <Skeleton className="h-4 w-20 mx-auto xl:mx-0 mb-2" /> {/* Label: Nombre */}
          <Skeleton className="h-6 w-40 mx-auto xl:mx-0" />       {/* Valor: Nombre */}
        </div>
      </div>

      {/* Información de contacto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
        {[Mail, Phone, MapPin, Briefcase].map((Icon, idx) => (
          <div
            className="flex items-start gap-3 p-3 rounded-lg"
            key={idx}
          >
            <div className="bg-muted rounded-full p-2 flex-shrink-0">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-1 w-full">
              <Skeleton className="h-4 w-24" /> {/* Label */}
              <Skeleton className="h-5 w-full" /> {/* Valor */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}