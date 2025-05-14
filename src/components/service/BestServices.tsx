"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface BestService {
  title: string;
  description: string;
}

const bestServices: BestService[] = [
  { title: "Atención personalizada en el mostrador de información", description: "Recibe asistencia directa de nuestro equipo especializado." },
  { title: "Control de salud y vacunación", description: "Accede a chequeos rápidos y asesoramiento sobre vacunación." },
  { title: "Notificaciones automáticas de registros de vacunación", description: "Mantente informado sobre tus vacunas y próximas dosis." },
  { title: "Disponibilidad 24/7 para asesoramiento", description: "Siempre listos para responder tus dudas y necesidades." },
];

export default function BestServices() {
  const [show, setShow] = useState(false);
  
  return (
    <div className="w-full">
      <Button
        onClick={() => setShow(!show)}
        className="w-full sm:w-auto text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg bg-myPink-secondary hover:bg-myPink-hover"
      >
        {show ? "Ocultar servicios destacados" : "Mostrar servicios destacados"}
      </Button>
      
      {show && (
        <div className="mt-3 sm:mt-4 w-full">
          <ul className="space-y-2 sm:space-y-3">
            {bestServices.map((service, index) => (
              <li key={index} className="bg-white p-3 sm:p-4 rounded-lg shadow text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-semibold text-myPurple-focus">{service.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{service.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}