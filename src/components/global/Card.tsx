import React from "react";
import Image from "next/image";

interface ICardProps {
  title: string;
  description: string;
  image: string;
  alt: string;
  ctaText?: string;
  ctaLink?: string;
  layout?: "vertical" | "horizontal";
  imagePosition?: "top" | "bottom" | "left" | "right";
  showButton?: boolean;
  imageWidth?: number;
  imageHeight?: number;
  bgColor?: string; // Color de fondo (Tailwind)
  textColor?: string; // Color del texto (Tailwind)
  children?: React.ReactNode; // Contenido adicional
}

export function Card({
  title,
  description,
  image,
  alt,
  ctaText = "Ver más",
  ctaLink = "#",
  layout = "vertical",
  imagePosition = "top",
  showButton = true,
  imageWidth = 500,
  imageHeight = 300,
  bgColor = "bg-gray-200",
  textColor = "text-gray-900",
  children,
}: ICardProps) {
  const isHorizontal = layout === "horizontal";
  
  return (
    <div
      className={`flex ${isHorizontal ? "flex-row" : "flex-col"} w-full max-w-md md:max-w-2xl rounded-lg shadow-md hover:shadow-lg transition overflow-hidden`}
    >
      {/* Posición de la imagen */}
      {(imagePosition === "top" || imagePosition === "left") && (
        <div className={isHorizontal ? "w-1/3" : "w-full"}>
          <Image
            src={image}
            alt={alt}
            width={imageWidth}
            height={imageHeight}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Contenido de la tarjeta */}
      <div className={`p-4 flex flex-col justify-between w-full ${bgColor} ${textColor}`}>
        <div className="text-left flex flex-col gap-1 flex-1">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="mt-2 text-sm md:text-base">{description}</p>
        </div>

        {/* Contenido extra opcional (botón, enlaces, iconos, etc.) */}
        {children && <div className="mt-4">{children}</div>}

        {/* Botón opcional */}
        {showButton && !children && (
          <div className="mt-4 flex justify-end">
            <a
              href={ctaLink}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              {ctaText}
            </a>
          </div>
        )}
      </div>

      {/* Imagen en la parte inferior o derecha */}
      {(imagePosition === "bottom" || imagePosition === "right") && (
        <div className={isHorizontal ? "w-1/3" : "w-full"}>
          <Image
            src={image}
            alt={alt}
            width={imageWidth}
            height={imageHeight}
            className="w-full h-auto object-cover"
          />
        </div>
      )}
    </div>
  );
}
