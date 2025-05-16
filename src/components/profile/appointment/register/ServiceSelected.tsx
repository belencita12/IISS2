import type { ServiceType } from "@/lib/appointment/IAppointment"
import { Stethoscope } from "lucide-react"

type ServiceSelectedProps = {
  service: ServiceType
}

export default function ServiceSelected({ service }: ServiceSelectedProps) {
  return (
    <div className="flex items-center p-3">
      <div className="bg-white p-2 rounded-full mr-3">
        <Stethoscope className="h-5 w-5 text-myPink-primary" />
      </div>
      <div>
        <p className="font-medium text-myPink-focus">Servicio: {service.name}</p>
        <div className="flex gap-3 text-gray-600 text-sm"> Precio:
          {service.price && (
            <span className="flex items-center">
              {service.price.toLocaleString()} Gs.
            </span>
          )}
        </div>
      </div>
    </div>
  )
}