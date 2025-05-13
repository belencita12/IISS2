"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface BestService {
  title: string
  description: string
}

const bestServices: BestService[] = [
  {
    title: "Atención personalizada en el mostrador de información",
    description: "Recibe asistencia directa de nuestro equipo especializado.",
  },
  {
    title: "Control de salud y vacunación",
    description: "Accede a chequeos rápidos y asesoramiento sobre vacunación.",
  },
  {
    title: "Notificaciones automáticas de registros de vacunación",
    description: "Mantente informado sobre tus vacunas y próximas dosis.",
  },
  {
    title: "Disponibilidad 24/7 para asesoramiento",
    description: "Siempre listos para responder tus dudas y necesidades.",
  },
]

export default function BestServices() {
  const [show, setShow] = useState(false)

  return (
    <section className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
      <Button
        onClick={() => setShow(!show)}
        className="bg-myPink-primary hover:bg-myPink-hover text-white px-4 py-2 rounded-lg transition"
      >
        {show ? "Ocultar servicios destacados" : "Mostrar servicios destacados"}
      </Button>

      {show && (
        <ul className="space-y-3 mt-4">
          {bestServices.map((service, index) => (
            <li key={index} className="bg-white p-4 rounded-lg shadow transition-all duration-300 hover:shadow-md">
              <h3 className="text-lg font-semibold text-myPurple-primary">{service.title}</h3>
              <p className="text-gray-600 text-sm md:text-base">{service.description}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
