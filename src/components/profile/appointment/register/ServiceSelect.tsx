"use client"

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ServiceType } from "@/lib/appointment/IAppointment"
import { SERVICE_TYPE } from "@/lib/urls"
import { useFetch } from "@/hooks/api"

type ServiceSelectProps = {
  token: string
  userRole: string
  onSelectService: (service: ServiceType) => void
}

type ServiceResponse = {
  data: ServiceType[]
}

export default function ServiceSelect({ token, userRole, onSelectService }: ServiceSelectProps) {
  const [services, setServices] = useState<ServiceType[]>([])
  const { data, get } = useFetch<ServiceResponse>("", token)

  useEffect(() => {
    get(undefined, `${SERVICE_TYPE}?page=1&size=100`)
  }, [])

  useEffect(() => {
    if (data?.data) {
      setServices(data.data)
    }
  }, [data])

  const handleSelect = (serviceId: string) => {
    const selected = services.find((s) => s.id === Number(serviceId))
    if (selected) {
      onSelectService(selected)
    }
  }

  return (
    <div className="space-y-2">
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="w-full border-myPink-tertiary focus:ring-myPink-focus">
          <SelectValue placeholder="Selecciona un servicio" />
        </SelectTrigger>
        <SelectContent>
          {services.map((service) => (
            <SelectItem key={service.id} value={String(service.id)}>
              <div>
                <p>{service.name}</p>
                <p className="text-sm text-muted-foreground">
                  {service.durationMin} min {service.price && `- $${service.price}`}
                </p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
