// src/components/Card.tsx

import React from "react";
import Image from "next/image";

interface ICardProps {
  title: string;
  description: string;
  image: string;
  alt: string;
  ctaText: string;
  ctaLink: string;
  imageWidth?: number;
  imageHeight?: number;
}

export function Card({
  title,
  description,
  image,
  alt,
  ctaText,
  ctaLink,
  imageWidth = 500,
  imageHeight = 300,
}: ICardProps) {
  return (
    <div className="rounded-lg shadow-md hover:shadow-lg transition p-4">
      {/* Imagen en la parte superior */}
      <div className="rounded-t-lg overflow-hidden">
        <Image
          src={image}
          alt={alt}
          width={imageWidth}
          height={imageHeight}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Contenido de la tarjeta */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>

      {/* Botón de llamada a la acción */}
      <div className="mt-4">
        <a
          href={ctaLink}
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {ctaText}
        </a>
      </div>
    </div>
  );
}
