import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface IServiceCardProps {
  title: string;
  description: string;
  image: string;
  alt: string;
  ctaText: string;
  ctaLink: string;
}

export function ServiceCard({
  title,
  description,
  image,
  alt,
  ctaText,
  ctaLink,
}: IServiceCardProps) {
  return (

    <div className="flex w-full flex-wrap md:flex-nowrap">
      {/* Imagen en la parte izq */}
      <div className="w-full md:w-[30%] flex-shrink-0">
        <Image
          src={image}
          alt={alt}
          width={340}
          height={340}
          className="w-full h-auto object-cover aspect-square"
        />
      </div>


      {/* Contenido de la tarjeta */}
      <div className="bg-gray-200 p-[3%] flex flex-col justify-between w-full md:w-[70%]">
        <div className="text-left flex flex-col gap-1 flex-1 ">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="mt-2 text-gray-600 text-justify text-xs xl:text-lg lg:text-base">{description}</p>
        </div>
        <div className="flex w-full justify-end">
          {/* Botón de llamada a la acción */}
          <div className="mt-4">
            <Button>
              <a
                href={ctaLink}
                className="inline-block text-white px-4 py-2 rounded hover:bg-black-600 transition"
              >
                {ctaText}
              </a>
            </Button>

          </div>
        </div>
      </div>

    </div>
  );
}
