"use client"

import { User, Phone, Mail, MapPin } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export const OwnerInfoCardSkeleton = () => {
  return (
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* Imagen del propietario */}
          <div className="flex-shrink-0 flex justify-center w-full md:w-auto">
            <Skeleton className="w-32 h-32 rounded-full" />
          </div>

          {/* Datos del propietario */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {[User, Phone, Mail, MapPin].map((Icon, idx) => (
              <div
                className="flex items-start gap-3 min-w-0"
                key={idx}
              >
                <div className="bg-muted rounded-full p-2 flex-shrink-0">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-1 w-full">
                  <Skeleton className="h-3 w-24" /> {/* Label */}
                  <Skeleton className="h-4 w-full" /> {/* Valor */}
                </div>
              </div>
            ))}
          </div>
        </div>
  )
}