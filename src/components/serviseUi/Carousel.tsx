"use client";
import { useState } from "react";

interface CarouselProps {
  images: string[];
}

export default function Carousel({ images }: CarouselProps) {
  const [index, setIndex] = useState(0);

  const prevSlide = () => setIndex((index - 1 + images.length) % images.length);
  const nextSlide = () => setIndex((index + 1) % images.length);

  return (
    <div className="relative w-full flex justify-center items-center">
      <button onClick={prevSlide} className="absolute left-2 bg-gray-300 p-2 rounded">{"<"}</button>
      <img 
        src={images[index]} 
        alt={`Imagen ${index + 1} de ${images.length}`} 
        className="w-full h-48 object-cover rounded-lg" 
      />
      <button onClick={nextSlide} className="absolute right-2 bg-gray-300 p-2 rounded">{">"}</button>
    </div>
  );
}
