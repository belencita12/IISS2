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
    <div className="w-full bg-gray-100 p-3 sm:p-4">
      {/* Layout: fila en lg, columna debajo */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-7">
        {/* Imagen */}
        <div className="w-full lg:w-[30%] lg:min-w-[200px] flex-shrink-0 flex justify-center lg:justify-start">
          <div className="w-full md:max-w-md lg:max-w-none h-40 sm:h-64 md:h-80 lg:h-96 relative">
            <Image
              src={image}
              alt={alt}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 40vw, 30vw"
              priority
            />
          </div>
        </div>

        {/* Texto + botón */}
        <div className="w-full lg:w-[70%] flex flex-col justify-center lg:min-h-[384px] py-4 lg:py-0">
          <div className="flex flex-col gap-3 lg:gap-4">
            <div className="text-center lg:text-left flex flex-col gap-1">
              <h3 className="text-xl sm:text-2xl font-semibold text-myPurple-focus">
                {title}
              </h3>
              <p className="mt-1 lg:mt-2 text-sm sm:text-base text-center lg:text-justify">
                {description}
              </p>
            </div>

            <div className="flex justify-center lg:justify-start mt-2">
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
    </div>
  );
}
