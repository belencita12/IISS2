'use client';

import { useState, useMemo } from "react";
import Image from "next/image";
import ProductosBanner from "./ProductosBanner";
import { Product } from "@/lib/products/IProducts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NotImageNicoPets from "../../../public/NotImageNicoPets.png";
import { useFetch } from "@/hooks/api/useFetch";
import { PRODUCT_API } from "@/lib/urls"; 

const staticProducts = [
  { name: "Alimentos", image: "/veterinaria6.png" },
  { name: "Higiene", image: "/hig1.jpg" },
  { name: "Medicamentos", image: "/medicamentos2.jpg" },
];

interface ProductResponse {
  data: Product[];
}

export default function Products() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Construir la URL con parámetros de paginación
  const queryParams = new URLSearchParams({
    page: '1',
    size: '50'
  });
  const apiUrl = `${PRODUCT_API}?${queryParams.toString()}`;
  
  const { data, loading, error } = useFetch<ProductResponse>(
    apiUrl,
    null, // Sin token de autenticación
    {
      immediate: true,
      throwErrors: false,
      showToast: true,
      customErrorMessage: "Error al traer productos"
    }
  );

  // Filtrar productos que no sean de categoría "SERVICE"
  const filteredProducts = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((product) => product.category !== "SERVICE");
  }, [data?.data]);

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : staticProducts;
  
  const itemsToShow = 3;
  const maxIndex = Math.max(0, displayProducts.length - itemsToShow);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const visibleProducts = displayProducts.slice(currentIndex, currentIndex + itemsToShow);

  return (
    <div className="flex flex-col w-full">
      <section className="relative flex flex-col sm:flex-row gap-5 py-5 bg-white w-full min-h-[300px]">
        <div className="sm:w-1/4 w-full">
          <Image
            src="/productos9.jpg"
            alt="Productos"
            width={150}
            height={150}
            className="object-contain rounded-md aspect-square w-full h-full"
          />
        </div>
        <div className="sm:w-3/4 w-full">
          <ProductosBanner />
        </div>
      </section>

      {loading && (
        <section className="py-10 bg-white mt-10">
          <p className="text-center">Cargando productos...</p>
        </section>
      )}
      
      {error && (
        <section className="py-10 bg-white mt-10">
          <p className="text-center text-red-500">{error.message}</p>
        </section>
      )}

      {!loading && !error && displayProducts.length === 0 && (
        <section className="py-10 bg-white mt-10">
          <p className="text-center">No hay productos disponibles.</p>
        </section>
      )}

      {!loading && !error && displayProducts.length > 0 && (
        <section className="relative py-10 bg-white mt-10">
          {/* Botones de navegación */}
          {displayProducts.length > itemsToShow && (
            <>
              <button
                onClick={prevSlide}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5 text-myPurple-primary" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5 text-myPurple-primary" />
              </button>
            </>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleProducts.map((product) => (
              <div 
                key={'id' in product ? product.id : product.name} 
                className="bg-myPurple-disabled p-4 rounded-lg shadow-lg text-center transition-all duration-200 hover:scale-105 cursor-pointer flex flex-col items-center gap-4"
              >
                <div className="w-full aspect-square relative">
                  <Image 
                    src={'id' in product ? (product.image?.originalUrl || NotImageNicoPets.src) : product.image} 
                    alt={product.name} 
                    fill
                    quality={100}
                    className="rounded-md object-cover" 
                  />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-myPink-primary">{product.name}</h3>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}