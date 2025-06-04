"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceType } from "@/lib/service-types/IServiceType";
import NotImageNicoPets from "../../../public/NotImageNicoPets.png";
import Link from "next/link";

interface CarouselProps {
  items: ServiceType[];
}

export default function Carousel({ items }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsToShow(1);
      else if (window.innerWidth < 1024) setItemsToShow(2);
      else setItemsToShow(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, items.length - itemsToShow);
  const nextSlide = () =>
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  const visibleItems = items.slice(currentIndex, currentIndex + itemsToShow);

  return (
    <div className="relative py-10 w-full bg-white">
      {items.length === 0 && (
        <p className="text-center">No hay datos para mostrar.</p>
      )}

      {items.length > 0 && (
        <div className="relative w-full">
          {items.length > itemsToShow && (
            <>
              <Button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
              >
                <ChevronLeft className="w-5 h-5 text-myPurple-primary" />
              </Button>
              <Button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
              >
                <ChevronRight className="w-5 h-5 text-myPurple-primary" />
              </Button>
            </>
          )}
          <div
            className={`grid gap-4 transition-all duration-300 ${
              itemsToShow === 1
                ? "grid-cols-1"
                : itemsToShow === 2
                ? "grid-cols-2"
                : "grid-cols-3"
            }`}
          >
            {visibleItems.map((item) => (
              <Link
                key={item.id}
                href={`/services/${item.id}`}
                className="bg-myPurple-disabled p-5 rounded-lg shadow-md text-center hover:scale-105 transition-all cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="relative aspect-square w-full max-w-[300px] mx-auto">
                  <Image
                    src={item.img?.originalUrl || NotImageNicoPets}
                    alt={item.name}
                    fill
                    quality={100}
                    className="object-cover rounded-md"
                  />
                </div>
                 <h3 className="text-lg font-bold text-myPurple-focus group-hover:text-myPurple-primary transition-colors duration-300 mt-3">
                  {item.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
