"use client";
import { useState } from "react";
import Image from "next/image";

interface CarouselProps {
  images: string[];
}

export default function Carousel({ images }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const totalSlides = Math.ceil(images.length / 2); {/* Cada slide tiene 2 imágenes*/}

  const prevSlide = () => setIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  const nextSlide = () => setIndex((prev) => (prev + 1) % totalSlides);

  {/*Obtener las dos imágenes para este slide*/}
  const firstImage = images[index * 2];
  const secondImage = images[index * 2 + 1];

  return (
    <div className="relative w-full flex justify-center items-center">
      {/* Botón Izquierdo */}
      <button onClick={prevSlide} className="absolute left-2 bg-gray-300 p-2 rounded z-10">
        {"<"}
      </button>

      {/* Contenedor de Imágenes */}
      <div className="flex flex-wrap justify-center items-center gap-4 w-full max-w-4xl pt-4 px-4">
        {firstImage && (
          <div className="flex-grow min-w-[250px] max-w-[500px]">
            <Image
              src={firstImage}
              alt={`Imagen ${index * 2 + 1} de ${images.length}`}
              width={500}
              height={300}
              className="rounded-lg object-cover w-full  h-auto"
              unoptimized
            />
          </div>
        )}
        <div className="flex-grow min-w-[250px] max-w-[500px] hidden sm:block">
          {secondImage && (
            <Image
              src={secondImage}
              alt={`Imagen ${index * 2 + 2} de ${images.length}`}
              width={500}
              height={300}
              className="rounded-lg object-cover  w-full h-auto"
              unoptimized
            /> 
          )}  
        </div>

      </div>

      {/* Botón Derecho */}
      <button onClick={nextSlide} className="absolute right-2 bg-gray-300 p-2 rounded">
        {">"}
      </button>
    </div>
  );
}

