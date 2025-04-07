import React from "react";
import Image from "next/image";

interface ICardProps {
  title: string;
  description: string;
  image?: string;
  alt?: string;
  ctaText?: string;
  ctaLink?: string;
  layout?: "vertical" | "horizontal";
  imagePosition?: "top" | "bottom" | "left" | "right";
  showButton?: boolean;
  imageWidth?: number;
  imageHeight?: number;
  bgColor?: string;
  textColor?: string;
  children?: React.ReactNode;
}

export function Card({
  title,
  description,
  image,
  alt = "Imagen del card",
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
  const showImage = !!image; 

  return (
    <div
      className={`flex ${
        isHorizontal ? "flex-row" : "flex-col"
      } w-full rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-transform duration-300 overflow-hidden`}
    >
      {/* Imagen en top o left */}
      {showImage && (imagePosition === "top" || imagePosition === "left") && (
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

      {/* Contenido */}
      <div
        className={`p-4 flex flex-col justify-between w-full ${bgColor} ${textColor}`}
      >
        <div className="text-left flex flex-col gap-1 flex-1">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="mt-2 text-sm md:text-base">{description}</p>
        </div>

        {children && <div className="mt-4">{children}</div>}

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

      {/* Imagen en bottom o right */}
      {showImage &&
        (imagePosition === "bottom" || imagePosition === "right") && (
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
