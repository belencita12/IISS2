"use client"

import { Badge } from "@/components/ui/badge"

const statusColors = {
  PENDING: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  IN_PROGRESS: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  COMPLETED: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  CANCELLED: "bg-rose-100 text-rose-800 hover:bg-rose-100",
} as const

const statusLabels = {
  PENDING: "Pendiente",
  IN_PROGRESS: "Confirmada",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
} as const

type AppointmentStatus = keyof typeof statusLabels

interface StatusBadgeProps {
  status: AppointmentStatus
  className?: string
}

export const StatusBadge = ({ status, className = "" }: StatusBadgeProps) => {
  return (
    <Badge className={`${statusColors[status]} ${className} text-sm font-medium`}>
      {statusLabels[status]}
    </Badge>
  )
}