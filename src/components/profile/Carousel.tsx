"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
}

export const Carousel = <T extends { id: string | number }>({
  items,
  renderItem,
}: CarouselProps<T>) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemWidth, setItemWidth] = useState(0);

  // Crear un array de items circulares para el efecto infinito
  const circularItems = [...items, ...items, ...items];
  const startIndex = items.length;

  // Calcular el ancho de los ítems basado en el contenedor
  useEffect(() => {
    const updateItemWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Mostrar 1 ítem en móvil, 2 en tablet, 4 en desktop
        const itemsToShow = containerWidth < 768 ? 1 : containerWidth < 1024 ? 2 : 5;
        setItemWidth(containerWidth / itemsToShow);
      }
    };

    updateItemWidth();
    window.addEventListener('resize', updateItemWidth);
    return () => window.removeEventListener('resize', updateItemWidth);
  }, []);

  // Navegar a la izquierda
  const prevSlide = () => {
    if (isTransitioning || items.length === 0) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);

    if (currentIndex === 0) {
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.transition = "none";
          setCurrentIndex(items.length);

          carouselRef.current.getBoundingClientRect();

          setTimeout(() => {
            if (carouselRef.current) {
              carouselRef.current.style.transition =
                "transform 500ms ease-in-out";
              setIsTransitioning(false);
            }
          }, 50);
        }
      }, 500);
    } else {
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // Navegar a la derecha
  const nextSlide = () => {
    if (isTransitioning || items.length === 0) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);

    if (currentIndex === startIndex + items.length - 1) {
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.transition = "none";
          setCurrentIndex(startIndex);

          carouselRef.current.getBoundingClientRect();

          setTimeout(() => {
            if (carouselRef.current) {
              carouselRef.current.style.transition =
                "transform 500ms ease-in-out";
              setIsTransitioning(false);
            }
          }, 50);
        }
      }, 500);
    } else {
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // Inicializar el índice cuando los items están listos
  useEffect(() => {
    if (items.length > 0) {
      setCurrentIndex(startIndex);
    }
  }, [items, startIndex]);

  if (items.length === 0) return null;

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Botón de navegación izquierda */}
      <button
        onClick={prevSlide}
        disabled={isTransitioning}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/70 p-2 rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all"
        aria-label="Producto anterior"
      >
        <ChevronLeft className="h-6 w-6 text-purple-600" />
      </button>

      {/* Carrusel con efecto infinito */}
      <div className="w-full overflow-hidden">
        <div
          ref={carouselRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * itemWidth}px)`,
            width: `${circularItems.length * itemWidth}px`,
          }}
        >
          {circularItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex-shrink-0"
              style={{ width: `${itemWidth}px` }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>

      {/* Botón de navegación derecha */}
      <button
        onClick={nextSlide}
        disabled={isTransitioning}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/70 p-2 rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all"
        aria-label="Siguiente producto"
      >
        <ChevronRight className="h-6 w-6 text-purple-600" />
      </button>
    </div>
  );
};