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

  const prevSlide = () => setIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  const nextSlide = () => setIndex((prev) => (prev + 1) % totalSlides);

  const firstImage = images[index * 2];
  const secondImage = images[index * 2 + 1];

  return (
    <div className="relative w-full flex justify-center items-center py-4">
      <div className="relative flex items-center bg-white shadow-md rounded-lg p-4 w-full">
        {/* Botón Izquierdo */}
        <button
          onClick={prevSlide}
          className="absolute left-0 -translate-x-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300"
        >
          {<ChevronLeft className="w-6 h-6" />}
        </button>

        {/* Contenedor de Imágenes */}
        <div className="flex gap-4 w-full justify-center">
          {firstImage && (
            <div className="flex-1">
              <Image
                src={firstImage}
                alt="Imagen 1"
                width={300}
                height={200}
                className="rounded-lg object-cover w-full h-full"
                unoptimized
              />
            </div>
          )}
          {secondImage && (
            <div className="flex-1 hidden sm:block">
              <Image
                src={secondImage}
                alt="Imagen 2"
                width={300}
                height={200}
                className="rounded-lg object-cover w-full h-full"
                unoptimized
              />
            </div>
          )}
        </div>

        {/* Botón Derecho */}
        <button
          onClick={nextSlide}
          className="absolute right-0 translate-x-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300"
        >
        {<ChevronRight className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
}

