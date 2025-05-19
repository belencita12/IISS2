"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  images: string[];
}

export default function Carousel({ images }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const totalSlides = Math.ceil(images.length / 2);

  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  const nextSlide = () => setIndex((prev) => (prev + 1) % totalSlides);

  const firstImage = images[index * 2];
  const secondImage = images[index * 2 + 1];

  return (
    <div className="relative w-full flex justify-center items-center py-2 sm:py-4">
      <div className="relative flex items-center bg-white shadow-md rounded-lg p-2 sm:p-4 w-full">
        {/* Botón Izquierdo */}
        <button
          onClick={prevSlide}
          className="absolute left-0 -translate-x-2 sm:-translate-x-3 bg-gray-200 p-1 sm:p-2 rounded-full shadow-md hover:bg-gray-300 z-10"
          aria-label="Anterior imagen"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-myPurple-primary" />
        </button>

        {/* Contenedor de Imágenes */}
        <div className="flex gap-2 sm:gap-4 w-full justify-center">
          {firstImage && (
            <div className="flex-1">
              <Image
                src={firstImage || "/placeholder.svg"}
                alt="Imagen de servicio"
                width={800}
                height={600}
                className="rounded-lg object-cover w-full h-45 sm:h-64 md:h-70"
              />
            </div>
          )}
          {secondImage && (
            <div className="flex-1 hidden sm:block">
              <Image
                src={secondImage || "/placeholder.svg"}
                alt="Imagen de servicio"
                width={800}
                height={600}
                className="rounded-lg object-cover w-full h-45 sm:h-64 md:h-70"
              />
            </div>
          )}
        </div>

        {/* Botón Derecho */}
        <button
          onClick={nextSlide}
          className="absolute right-0 translate-x-2 sm:translate-x-3 bg-gray-200 p-1 sm:p-2 rounded-full shadow-md hover:bg-gray-300 z-10"
          aria-label="Siguiente imagen"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-myPurple-primary" />
        </button>
      </div>
    </div>
  );
}