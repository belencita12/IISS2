'use client';

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ProductosBanner from "./ProductosBanner";
import { Product } from "@/lib/products/IProducts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NotImageNicoPets from "../../../public/NotImageNicoPets.png";
import { useFetch } from "@/hooks/api/useFetch";
import { PRODUCT_API } from "@/lib/urls"; 
import { Button } from "@/components/ui/button";  

interface ProductResponse {
  data: Product[];
}

export default function Products() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);
  const router = useRouter();
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsToShow(1);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2);
      } else {
        setItemsToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const queryParams = new URLSearchParams({
    page: '1',
    size: '50'
  });
  const apiUrl = `${PRODUCT_API}?${queryParams.toString()}`;
  
  const { data, loading, error } = useFetch<ProductResponse>(
    apiUrl,
    null,
    {
      immediate: true,
      throwErrors: false,
      showToast: true,
      customErrorMessage: "Error al traer productos"
    }
  );

  const filteredProducts = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((product) => product.category !== "SERVICE");
  }, [data?.data]);

  const displayProducts = filteredProducts;
  
  const maxIndex = Math.max(0, displayProducts.length - itemsToShow);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleProductClick = (product: Product) => {
    router.push(`/shop/product/${product.id}`);
  };

  const visibleProducts = displayProducts.slice(currentIndex, currentIndex + itemsToShow);

  return (
    <div className="flex flex-col w-full">
      <section className="relative w-full min-h-[300px]">
        <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-r from-myPurple-primary to-myPink-primary opacity-90">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200')] bg-repeat opacity-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
        </div>
        <div className="relative z-10">
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
        <section className="relative py-9 bg-white mt-9">
          {displayProducts.length > itemsToShow && (
            <>
              <Button
                onClick={prevSlide}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5 text-myPurple-primary" />
              </Button>
              <Button
                onClick={nextSlide}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5 text-myPurple-primary" />
              </Button>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-myPurple-disabled p-5 rounded-lg shadow-lg text-center transition-all duration-200 hover:scale-105 cursor-pointer flex flex-col items-center gap-4"
                onClick={() => handleProductClick(product)}
              >
                <div className="w-full aspect-square relative max-w-[300px] mx-auto">
                  <Image 
                    src={product.image?.originalUrl || NotImageNicoPets.src} 
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