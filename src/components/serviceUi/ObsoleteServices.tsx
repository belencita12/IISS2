"use client";
import { useState,  } from "react";
import { Button } from "@/components/ui/button";

interface ObsoleteService {
  title: string;
  description: string;
}

const obsoleteServices: ObsoleteService[] = [
  { title: "Mensaje desde el mostrador de información", description: "Reemplazado por chatbots y asistentes virtuales." },
  { title: "Control de saliva y vacunación", description: "Métodos más modernos han mejorado la eficacia." },
  { title: "Notificaciones de registros de vacunación", description: "Ahora automatizadas con SMS y apps." },
  { title: "Disponibilidad 24/7 para asesoría", description: "Optimizada con IA y FAQs interactivas." },
];

export default function ObsoleteServices() {
  const [show, setShow] = useState(false);

  return (
    <section className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
      <Button
        onClick={() => setShow(!show)}
        className=" text-white px-4 py-2 rounded-lg hover:bg-gray-300 transition"
      >
        {show ? "Ocultar servicios obsoletos" : "Mostrar servicios obsoletos"}
      </Button>

      {show && (
        <ul className="space-y-3 mt-4">
          {obsoleteServices.map((service, index) => (
            <li key={index} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
 