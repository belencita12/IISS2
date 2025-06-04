'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ServiciosBanner from "./ServiciosBanner";
import { ServiceType } from "@/lib/service-types/IServiceType";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NotImageNicoPets from "../../../public/NotImageNicoPets.png";
import { SERVICE_TYPE } from "@/lib/urls";
import { useFetch } from "@/hooks/api/useFetch";
import { Button } from "@/components/ui/button";



interface ServiceResponse {
    data: ServiceType[];
}

export default function Services() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(3);
    const router = useRouter();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setItemsToShow(1);
            } else if (window.innerWidth < 1024) {
                setItemsToShow(2);
            } else {
                setItemsToShow(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const queryParams = new URLSearchParams({
        page: '1',
        size: '50'
    });
    const apiUrl = `${SERVICE_TYPE}?${queryParams.toString()}`;
    
    const { data, loading, error } = useFetch<ServiceResponse>(
        apiUrl,
        null,
        {
            immediate: true,
            throwErrors: false,
            showToast: true,
            customErrorMessage: "Error al obtener los tipos de servicios"
        }
    );

    const services = data?.data || [];
    const displayServices = services;
    
    const maxIndex = Math.max(0, displayServices.length - itemsToShow);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    };

    const handleServiceClick = (service: ServiceType) => {
        router.push(`/services/${service.id}`);
    };

    const visibleServices = displayServices.slice(currentIndex, currentIndex + itemsToShow);

    return (
        <div className="flex flex-col w-full">
            <section className="relative w-full min-h-[300px]">
                <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-r from-myPurple-primary to-myPink-primary opacity-90">
                    <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200')] bg-repeat opacity-10"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
                </div>
                <div className="relative z-10">
                    <ServiciosBanner />
                </div>
            </section>

            {loading && (
                <section className="py-10 bg-white mt-10">
                    <p className="text-center">Cargando servicios...</p>
                </section>
            )}
            
            {error && (
                <section className="py-10 bg-white mt-10">
                    <p className="text-center text-red-500">{error.message}</p>
                </section>
            )}

            {!loading && !error && displayServices.length === 0 && (
                <section className="py-10 bg-white mt-10">
                    <p className="text-center">No hay servicios disponibles.</p>
                </section>
            )}

            {!loading && !error && displayServices.length > 0 && (
                <section className="relative py-9 bg-white mt-9">
                    {displayServices.length > itemsToShow && (
                        <>
                            <Button
                                onClick={prevSlide}
                                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
                            >
                                <ChevronLeft className="w-5 h-5 text-myPurple-primary" />
                            </Button>
                            <Button
                                onClick={nextSlide}
                                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
                            >
                                <ChevronRight className="w-5 h-5 text-myPurple-primary" />
                            </Button>
                        </>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visibleServices.map((service) => (
                        <div 
                        key={service.id} 
                        className="bg-myPink-disabled p-5 rounded-lg shadow-lg text-center flex flex-col items-center gap-4"
                        >
                        <div className="w-full aspect-square relative max-w-[300px] mx-auto">
                            <Image 
                            src={service.img?.originalUrl || NotImageNicoPets.src} 
                            alt={service.name} 
                            fill
                            quality={100}
                            className="rounded-md object-cover" 
                            />
                        </div>
                        <h3 className="font-semibold text-sm sm:text-base text-myPink-primary">{service.name}</h3>
                        </div>
                    ))}
                    </div>
                </section>
            )}
        </div>
    );
}