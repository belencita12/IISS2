"use client";
import { useState } from "react";
import Image from "next/image";

interface CarouselProps {
  images: string[];
}

export default function Carousel({ images }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const totalSlides = Math.ceil(images.length / 2); // Cada slide tiene 2 imágenes

  const prevSlide = () => setIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  const nextSlide = () => setIndex((prev) => (prev + 1) % totalSlides);

  // Obtener las dos imágenes para este slide
  const firstImage = images[index * 2];
  const secondImage = images[index * 2 + 1];

  return (
    <div className="relative w-full flex justify-center items-center">
      {/* Botón Izquierdo */}
      <button onClick={prevSlide} className="absolute left-2 bg-gray-300 p-2 rounded">
        {"<"}
      </button>

      {/* Contenedor de Imágenes */}
      <div className="flex space-x-4">
        {firstImage && (
          <Image
            src={firstImage}
            alt={`Imagen ${index * 2 + 1} de ${images.length}`}
            width={300}
            height={200}
            className="rounded-lg object-cover"
            unoptimized
          />
        )}
        {secondImage && (
          <Image
            src={secondImage}
            alt={`Imagen ${index * 2 + 2} de ${images.length}`}
            width={300}
            height={200}
            className="rounded-lg object-cover"
            unoptimized
          />
        )}
      </div>

      {/* Botón Derecho */}
      <button onClick={nextSlide} className="absolute right-2 bg-gray-300 p-2 rounded">
        {">"}
      </button>
    </div>
  );
}

