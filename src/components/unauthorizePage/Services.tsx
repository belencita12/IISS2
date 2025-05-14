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
        description: "Atención médica para tu mascota. Las reservas online son un sistema muy cómodo que te permite realizar citas veterinarias las 24 horas del día y desde cualquier lugar. Podrás consultar la disponibilidad de clínicas veterinarias de un vistazo, incluso durante tu viaje al trabajo o durante tu pausa del almuerzo",
        image: "/veterinaria.jpg",
        carousel: ["/vacuna4.jpg", "/vacuna5.jpg", "/pelu1.jpg", "/pelu2.jpg"]
    },
    {
        title: "Peluquería",
        description: "Cortes y aseo para tu mascota. Lavar con champú a un gato que odia los baños puede ser todo un desafío. Tu amado gato ha regresado de una escapada, o estás preocupado por el olor o la suciedad alrededor de su parte trasera, así que es hora de darle un champú.",
        image: "/peluu.jpg",
        carousel: ["/pelu1.jpg", "/pelu2.jpg", "/castracion1.jpg", "/castracion2.jpg"]
    },
    {
        title: "Castración",
        description: "La castración es un procedimiento veterinario seguro y recomendado para prevenir enfermedades y mejorar la calidad de vida de tu mascota. Ayuda a reducir el riesgo de infecciones, evita camadas no deseadas y contribuye a un comportamiento más equilibrado.",
        image: "/castracion.jpg",
        carousel: ["/castracion1.jpg", "/castracion2.jpg", "/vacuna4.jpg", "/vacuna5.jpg"]
    }
];

export default function Servicios() {
    return (
        <div className="w-full px-3 sm:px-[6%] space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            {/* Sección principal con imagen y texto */}
            <div className="bg-white w-full">
                <section className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                    <div className="w-full sm:w-[30%] flex-shrink-0 py-3 sm:py-5">
                        <Image
                            src="/services.jpg"
                            alt="Service"
                            width={340}
                            height={340}
                            className="w-full object-cover aspect-square rounded-md"
                            priority
                        />
                    </div>

                    <div className="flex-1 flex flex-col px-3 sm:px-6 py-3 sm:py-5 sm:mt-16 md:mt-24">
                        <div className="text-center sm:text-left flex flex-col gap-2 sm:gap-3">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-myPurple-focus">
                                Nuestros servicios
                            </h2>
                            <p className="text-sm sm:text-base md:text-lg text-center sm:text-justify">
                                Explora nuestros servicios y dale a tu mascota el cuidado que se merece.
                            </p>
                            <p className="text-sm sm:text-base md:text-lg font-bold">
                                ¡Tu tranquilidad y su felicidad son nuestra prioridad!
                            </p>
                        </div>

                        <div className="mt-3 sm:mt-5 w-full">
                            <BestServices />
                        </div>
                    </div>
                </section>
            </div>

            {/* Listado de servicios */}
            <div className="space-y-4 sm:space-y-6 w-full">
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