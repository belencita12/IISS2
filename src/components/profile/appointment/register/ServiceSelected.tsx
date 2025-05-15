import type { ServiceType } from "@/lib/appointment/IAppointment"
import { Clock } from "lucide-react"

type ServiceSelectedProps = {
  service: ServiceType
}

export default function ServiceSelected({ service }: ServiceSelectedProps) {
  return (
    <div className="mt-2 p-4 border border-myPink-tertiary/50 rounded-lg bg-slate-50 text-black text-sm flex items-start gap-3">
      <div className="bg-myPink-secondary/20 p-2 rounded-full">
        <Clock className="h-5 w-5 text-myPink-primary" />
      </div>
      <div>
        <p className="font-medium text-base text-myPink-focus">{service.name}</p>
        <p className="text-gray-600">Duración: {service.durationMin} minutos</p>
        {service.price && <p className="text-gray-600">Precio: ${service.price}</p>}
      </div>
    </div>
  )
}
