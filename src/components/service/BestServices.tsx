"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BestService {
  id: number;
  title: string;
  description: string;
  image?: string;
  alt?: string;
}

interface BestServicesProps {
  services: BestService[];
}

const fixedServices: BestService[] = [
  {
    id: 1,
    title: "Control de salud y vacunación",
    description:
      "Realiza chequeos veterinarios rápidos y recibe orientación personalizada sobre el calendario de vacunación de tu mascota.",
  },
  {
    id: 2,
    title: "Notificaciones automáticas de registros de vacunación",
    description:
      "Recibe alertas oportunas sobre vacunas aplicadas y recordatorios para las próximas dosis, sin preocuparte por llevar el control manualmente.",
  },
  {
    id: 3,
    title: "Asesoramiento disponible las 24 horas",
    description:
      "Accede a soporte veterinario en cualquier momento del día para resolver tus dudas o atender emergencias.",
  },
];

export default function BestServices({ services }: BestServicesProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="w-full">
      <div className="flex justify-center lg:justify-start mt-2">
        <Button
          onClick={() => setShow(!show)}
          className="group relative bg-white border-2 border-myPurple-primary text-myPurple-primary hover:bg-myPurple-primary hover:text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-myPink-primary/10 to-myPurple-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex items-center gap-2">
            {show ? (
              <Minus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
            ) : (
              <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
            )}
            <span>
              {show ? "Ocultar destacados" : "Ver servicios destacados"}
            </span>
          </div>
        </Button>
      </div>

      <div
        className={`transition-all duration-700 ease-out overflow-hidden ${
          show ? "max-h-[3000px] opacity-100 mt-6" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        {/* Informacion estatica como cards*/}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-3 sm:px-0 mb-6">
          {fixedServices.map((service, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <h3 className="text-base sm:text-lg font-semibold text-myPurple-focus mb-2">
                {service.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Servicios dinámicos*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service, index) => (
            <Link
              key={service.id}
              href={`/services/${service.id}`}
              className="group relative bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-myPurple-tertiary"
              style={{ animationDelay: show ? `${index * 100}ms` : "0ms" }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-myPink-primary to-myPurple-primary" />
              <div className="relative w-full h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg">
                <Image
                  src={service.image || "/placeholder.svg"}
                  alt={service.alt || service.title}
                  fill
                  className="object-cover rounded-md transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 639px) 100vw, 50vw"
                  quality={100}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h3 className="text-lg font-bold text-myPurple-focus group-hover:text-myPurple-primary transition-colors duration-300 mt-3">
                {service.title}
              </h3>
              <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                {service.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
