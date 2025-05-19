"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface BestService {
  title: string;
  description: string;
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
];

export default function BestServices() {
  const [show, setShow] = useState(false);

  return (
    <div className="w-full">
      <div className="flex justify-center lg:justify-start mt-2">
        <Button
          onClick={() => setShow(!show)}
          className="inline-block text-white px-4 py-2 rounded bg-myPink-primary hover:bg-myPink-hover transition"
        >
          {show
            ? "Ocultar servicios destacados"
            : "Mostrar servicios destacados"}
        </Button>
      </div>

      {show && (
        <div className="mt-3 sm:mt-4 w-full flex justify-center lg:justify-start">
          <ul className="space-y-2 sm:space-y-3 w-full px-3 sm:px-0">
            {bestServices.map((service, index) => (
              <li
                key={index}
                className="bg-white p-3 sm:p-4 rounded-lg shadow w-full text-left"
              >
                <h3 className="text-sm sm:text-base md:text-lg  text-center font-semibold text-myPurple-focus">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-center md:text-base">
                  {service.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}