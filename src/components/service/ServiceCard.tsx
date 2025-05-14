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
    <div className="w-full bg-gray-200 p-3 sm:p-4">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-7">
        {/* Imagen con altura fija */}
        <div className="w-full md:w-[30%] flex-shrink-0">
          <Image
            src={image}
            alt={alt}
            width={340}
            height={340}
            className="w-full aspect-square object-cover rounded-lg"
            priority
          />
        </div>

        {/* Texto + botón con altura adaptativa */}
        <div className="w-full md:w-[70%] flex flex-col justify-center md:min-h-[300px] py-4 md:py-0">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="text-center md:text-left flex flex-col gap-1">
              <h3 className="text-xl sm:text-2xl font-semibold text-myPurple-focus">{title}</h3>
              <p className="mt-1 md:mt-2 text-gray-600 text-sm sm:text-base md:text-lg text-center md:text-justify">
                {description}
              </p>
            </div>
            <div className="flex justify-center md:justify-start mt-2">
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