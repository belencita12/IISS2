"use client";

import { useEffect, useState, useRef } from "react";
import { getProductByTag } from "@/lib/products/getProductByTag";
import { PetData } from "@/lib/pets/IPet";
import { Product } from "@/lib/products/IProducts";
import { Card } from "@/components/product/ProductCardCliente";
import NotImageNicoPets from "../../../public/NotImageNicoPets.png";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RecommendedProductsProps {
  clientId: number;
  token: string;
  pets: PetData[];  // Recibir las mascotas como prop
}

export const RecommendedProducts = ({
  clientId,
  token,
  pets,  // Recibir las mascotas aquí
}: RecommendedProductsProps) => {
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const itemsPerView = 4;

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const speciesTags = Array.from(
          new Set(pets.map((p) => p.species.name.toLowerCase()))
        );
    
        if (speciesTags.length === 0) {
          setRecommended([]);
          return;
        }
    
        // Hacer una sola llamada con todos los tags
        const products = await getProductByTag(speciesTags, token);
        
        const unique = Object.values(
          products.reduce((acc, prod) => {
            acc[prod.id] = prod;
            return acc;
          }, {} as Record<string, Product>)
        );
    
        setRecommended(unique);
      } catch (err) {
        console.error(err);
        toast("error", "No se pudieron cargar recomendaciones");
      } finally {
        setLoading(false);
      }
    };

    if (pets && pets.length > 0 && token) {
      fetchRecommendations();
    } else {
      setLoading(false);
      setRecommended([]);
    }
  }, [pets, token]); 

  // Crear un array de productos circulares para el efecto infinito
  const circularProducts = [...recommended, ...recommended, ...recommended];
  const startIndex = recommended.length; // Comenzamos en la segunda copia

  // Navegar a la izquierda
  const prevSlide = () => {
    if (isTransitioning || recommended.length === 0) return;
    
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
    
    // Si llegamos al inicio de la primera copia, saltar al mismo ítem en la segunda copia
    if (currentIndex === 0) {
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.transition = 'none';
          setCurrentIndex(recommended.length);
          
          // Forzar un reflow para aplicar el cambio inmediatamente
          carouselRef.current.getBoundingClientRect();
          
          // Restaurar la transición para futuros movimientos
          setTimeout(() => {
            if (carouselRef.current) {
              carouselRef.current.style.transition = 'transform 500ms ease-in-out';
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
    if (isTransitioning || recommended.length === 0) return;
    
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
    
    // Si llegamos al final de la segunda copia, saltar al mismo ítem en la primera copia
    if (currentIndex === startIndex + recommended.length - 1) {
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.transition = 'none';
          setCurrentIndex(startIndex);
          
          // Forzar un reflow para aplicar el cambio inmediatamente
          carouselRef.current.getBoundingClientRect();
          
          // Restaurar la transición para futuros movimientos
          setTimeout(() => {
            if (carouselRef.current) {
              carouselRef.current.style.transition = 'transform 500ms ease-in-out';
              setIsTransitioning(false);
            }
          }, 50);
        }
      }, 500);
    } else {
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // Inicializar el índice cuando los productos están listos
  useEffect(() => {
    if (recommended.length > 0) {
      setCurrentIndex(startIndex);
    }
  }, [recommended, startIndex]);

  if (loading) return <p className="text-center">Cargando recomendaciones…</p>;
  if (recommended.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-sm text-center">
      <h2 className="text-3xl font-bold text-purple-600">Productos recomendados</h2>
      <p className="text-gray-500 mt-1 text-sm">
        Basado en las mascotas que tienes registradas
      </p>
      <Button className="bg-white text-pink-500 border border-pink-500 mt-3 hover:bg-pink-600 hover:text-white">
        <Link href="/user-profile/product">Ver más</Link>
      </Button>

      <div className="relative overflow-hidden mt-6">
        {/* Botón de navegación izquierda */}
        <button 
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/70 p-2 rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all"
          aria-label="Producto anterior"
        >
          <ChevronLeft className="h-6 w-6 text-purple-600" />
        </button>
        
        {/* Carrusel de productos con efecto infinito */}
        <div 
          ref={carouselRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${(100 / circularProducts.length) * currentIndex}%)`,
            width: `${circularProducts.length * 25}%`, // 25% es para que cada producto ocupe 1/4 del ancho visible
          }}
        >
          {circularProducts.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              onClick={() =>
                router.push(`/user-profile/product/${product.id}`)
              }
              className="cursor-pointer px-2 box-border"
              style={{ width: `${100 / circularProducts.length}%` }}
            >
              <Card
                title={product.name}
                price={`${product.price.toLocaleString()} Gs.`}
                image={product.image?.originalUrl ?? NotImageNicoPets.src}
                ctaText="Ver detalles"
                ctaLink={`/user-profile/product/${product.id}`}
                tags={product.tags}
              />
            </div>
          ))}
        </div>
        
        {/* Botón de navegación derecha */}
        <button 
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/70 p-2 rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all"
          aria-label="Siguiente producto"
        >
          <ChevronRight className="h-6 w-6 text-purple-600" />
        </button>
      </div>
    </section>
  );
};