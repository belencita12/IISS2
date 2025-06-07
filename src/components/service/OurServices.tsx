"use client";
import React from "react";
import Image from "next/image";
import { ServiceCard } from "@/components/service/ServiceCard";
import Carousel from "@/components/service/Carousel";
import BestServices from "@/components/service/BestServices";
import { Loader2, AlertCircle } from "lucide-react";
import { useFetch } from "@/hooks/api/useFetch";
import { SERVICE_TYPE } from "@/lib/urls";
import type { ServiceType } from "@/lib/service-types/IServiceType";
import NotImageNicoPets from "../../../public/NotImageNicoPets.png";
import ServiciosBanner from "../unauthorizePage/ServiciosBanner";
interface ServiceResponse {
  data: ServiceType[];
}

export default function OurServices() {
  const queryParams = new URLSearchParams({ page: "1" });
  const apiUrl = `${SERVICE_TYPE}?${queryParams.toString()}`;
  const { data, loading, error } = useFetch<ServiceResponse>(apiUrl, null, {
    immediate: true,
    throwErrors: false,
    showToast: true,
    customErrorMessage: "Error al obtener los servicios",
  });

  const services: ServiceType[] = data?.data ?? [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-myPurple-primary" />
        <span className="text-gray-600">Cargando servicios...</span>
      </div>
    );
  }

  if (error || !services.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <span className="text-gray-600">No hay servicios para mostrar.</span>
      </div>
    );
  }

  const bestServices = services.slice(4, 8).map((s) => ({
  id: s.id,
  title: s.name,
  description: s.description,
  image: s.img?.originalUrl ?? NotImageNicoPets.src,
  alt: `Imagen de ${s.name}`,
}));


  const serviceCards = services.slice(0, 2);

  return (
    <div className="w-full space-y-4 sm:space-y-6 mt-4 sm:mt-6">
       <div className="relative z-10">
                    <ServiciosBanner />
                </div>
      <div className="bg-white w-full">
        <section className="w-full px-0 sm:px-0">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-7 w-full px-3 sm:px-6">
            <div className="w-full lg:w-[30%] flex justify-center lg:justify-start">
              <div className="relative w-full aspect-[4/3] min-h-[200px] sm:min-h-[256px] md:min-h-[320px] lg:min-h-[384px] rounded-lg overflow-hidden shadow-xl group">
                <Image
                  src="/services.jpg"
                  alt="Servicios para mascotas"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 40vw, 30vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            <div className="w-full lg:w-[70%] flex flex-col justify-center lg:min-h-[384px] py-4 lg:py-0">
              <div className="flex flex-col gap-3 lg:gap-4 px-3 sm:px-6">
                <div className="text-center lg:text-left flex flex-col gap-1">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-myPurple-focus to-myPink-primary bg-clip-text text-transparent">
                    Dale a tu mascota el cuidado que se merece.
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-myPink-primary to-myPurple-primary bg-clip-text text-transparent">
                    ¡Tu tranquilidad y su felicidad son nuestra prioridad!
                  </p>
                </div>
                <div className="mt-3 sm:mt-1 w-full">
                  <BestServices services={bestServices} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="space-y-4 sm:space-y-6 w-full px-3 sm:px-6">
        <div className="space-y-4">
          {serviceCards.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.name}
              description={service.description}
              image={service.img?.originalUrl ?? NotImageNicoPets.src}
              alt={`Imagen de ${service.name}`}
              ctaText="Más información"
              ctaLink={`/services/${service.id}`}
            />
          ))}
        </div>
        <Carousel items={services} />
      </div>
    </div>
  );
}
