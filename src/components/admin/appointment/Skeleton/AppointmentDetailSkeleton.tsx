"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, CircleDot, Info, Mail, MapPin, PawPrint, Phone, User, Weight } from "lucide-react"

export const AppointmentDetailSkeleton = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <Skeleton className="h-10 w-24" /> {/* Botón volver */}
        <Skeleton className="h-8 w-48" /> {/* Título */}
        <div className="hidden sm:block w-[72px]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal: cita, mascota, propietario */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skeleton de cita */}
          <div className="border rounded-lg p-6 space-y-6">
            <div className="flex justify-between items-start flex-col sm:flex-row sm:items-center gap-4">
              <div className="space-y-1">
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-full" />
            </div>
          </div>

          {/* Skeleton de mascota */}
          <div className="border rounded-lg p-6 space-y-4">
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
          </div>

          {/* Skeleton de propietario */}
          <div className="border rounded-lg p-6 space-y-4">
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
                  <Skeleton className="h-3 w-24" /> 
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>

        {/* empleado */}
        <div className="space-y-6">
          <div className="border rounded-lg p-6 space-y-4">
             <Skeleton className="h-4 w-40" /> 
           <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4 p-4 bg-muted/30 rounded-lg">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" /> 
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  )
}