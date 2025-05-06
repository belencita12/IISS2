import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const ProductSkeleton = () => {
  return (
    <section className="w-full p-6 bg-white rounded-lg shadow-sm text-center">
      <div className="relative">
        {/* Botón izquierdo */}
        <button
          disabled
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 p-2 rounded-full shadow-md"
          aria-label="Producto anterior"
        >
          <ChevronLeft className="h-6 w-6 text-purple-600" />
        </button>

        {/* Contenedor del skeleton */}
        <div className="flex gap-4 overflow-hidden px-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2">
              <div className="border rounded-lg p-4 h-full">
                <Skeleton className="w-full h-40 mb-4 rounded-lg" />
                <Skeleton className="w-3/4 h-5 mb-2 mx-auto" />
                <Skeleton className="w-1/2 h-4 mb-3 mx-auto" />
                <Skeleton className="w-full h-9 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Botón derecho */}
        <button
          disabled
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 p-2 rounded-full shadow-md"
          aria-label="Siguiente producto"
        >
          <ChevronRight className="h-6 w-6 text-purple-600" />
        </button>
      </div>
    </section>
  );
};