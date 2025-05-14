import React from "react";
import Image from "next/image";
import { ServiceCard } from "@/components/service/ServiceCard";
import Carousel from "@/components/service/Carousel";
import BestServices from "@/components/service/BestServices";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "NicoPets",
  description: "Servicios y productos para tus mascotas",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

const services = [
  {
    title: "Veterinaria",
    description:
      "Atención médica para tu mascota. Las reservas online son un sistema muy cómodo que te permite realizar citas veterinarias las 24 horas del día y desde cualquier lugar. Podrás consultar la disponibilidad de clínicas veterinarias de un vistazo, incluso durante tu viaje al trabajo o durante tu pausa del almuerzo",
    image: "/veterinaria.jpg",
    carousel: ["/vacuna6.jpg", "/vacuna5.jpg", "/pelu1.jpg", "/pelu2.jpg"],
  },
  {
    title: "Peluquería",
    description:
      "Cortes y aseo para tu mascota. Lavar con champú a un gato que odia los baños puede ser todo un desafío. Tu amado gato ha regresado de una escapada, o estás preocupado por el olor o la suciedad alrededor de su parte trasera, así que es hora de darle un champú.",
    image: "/peluu.jpg",
    carousel: [
      "/pelu1.jpg",
      "/pelu2.jpg",
      "/castracion1.jpg",
      "/castracion2.jpg",
    ],
  },
  {
    title: "Castración",
    description:
      "La castración es un procedimiento veterinario seguro y recomendado para prevenir enfermedades y mejorar la calidad de vida de tu mascota. Ayuda a reducir el riesgo de infecciones, evita camadas no deseadas y contribuye a un comportamiento más equilibrado.",
    image: "/castracion.jpg",
    carousel: [
      "/castracion1.jpg",
      "/castracion2.jpg",
      "/vacuna6.jpg",
      "/vacuna5.jpg",
    ],
  },
];

export default function OurServices() {
  return (
    <div className="w-full space-y-4 sm:space-y-6 mt-4 sm:mt-6">
      {/* Sección principal con imagen y texto */}
      <div className="bg-white w-full">
        <section className="w-full px-0 sm:px-0"> {/* quitamos padding */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-7 w-full px-3 sm:px-6"> {/* padding solo interno */}
            {/* Imagen */}
            <div className="w-full lg:w-[30%] lg:min-w-[200px] flex-shrink-0 flex justify-center lg:justify-start">
              <div className="w-full md:max-w-md lg:max-w-none">
                <div className="relative w-full aspect-[4/3] min-h-[200px] sm:min-h-[256px] md:min-h-[320px] lg:min-h-[384px]">
                  <Image
                    src="/services.jpg"
                    alt="Servicios para mascotas"
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 40vw, 30vw"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Texto */}
            <div className="w-full lg:w-[70%] flex flex-col justify-center lg:min-h-[384px] py-4 lg:py-0">
              <div className="flex flex-col gap-3 lg:gap-4 px-3 sm:px-6"> {/* padding en el texto */}
                <div className="text-center lg:text-left flex flex-col gap-1">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-myPurple-focus">
                    Nuestros servicios
                  </h2>
                  <p className="mt-1 md:mt-2 text-sm sm:text-base md:text-lg text-center lg:text-justify">
                    Explora nuestros servicios y dale a tu mascota el cuidado que se merece.
                  </p>
                  <p className="text-sm sm:text-base md:text-lg font-bold">
                    ¡Tu tranquilidad y su felicidad son nuestra prioridad!
                  </p>
                </div>

                <div className="mt-3 sm:mt-1 w-full">
                  <BestServices />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Listado de servicios */}
      <div className="space-y-4 sm:space-y-6 w-full px-3 sm:px-6">
        {services.map((service, index) => (
          <div key={index}>
            <ServiceCard
              title={service.title}
              description={service.description}
              image={service.image}
              alt={`Imagen de ${service.title}`}
              ctaText="Más información"
              ctaLink={`/servicios/${service.title.toLowerCase()}`}
            />
            <Carousel images={service.carousel} />
          </div>
        ))}
      </div>
    </div>
  );
}
