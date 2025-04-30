"use client";
import React from "react";
import Image from "next/image";
import { Product } from "@/lib/products/IProducts";
import { getCategoryLabel } from "@/lib/products/utils/categoryLabel";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  onClick: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  // Ruta de la imagen por defecto en public/
  const defaultImageSrc = "/NotImageNicoPets.png";

  return (
    <div
      className="flex w-full max-w-[550px] min-w-[280px] h-[250px] m-2 rounded-lg shadow-md
                    hover:shadow-lg transition-shadow duration-300 overflow-hidden
                    bg-white text-gray-900"
    >
      {/* Columna de imagen: 40% */}
      <div className="w-[45%] relative h-full overflow-hidden rounded-l-lg">
        <Image
          src={product.image?.originalUrl || defaultImageSrc}
          alt={product.name}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Columna de información: 60% */}
      <div className="w-[65%] p-4 flex flex-col justify-between">
        <div className="space-y-2 overflow-hidden">
          {product.tags && (
            <div className="flex flex-wrap gap-1 mb-1 max-h-[32px] overflow-hidden">
              {product.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-600 text-[10px] font-medium
                             px-2 py-0.5 rounded-full border border-gray-300 truncate"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h3 className="text-md font-semibold line-clamp-2">{product.name}</h3>

          <div className="grid grid-cols-[1fr_0.6fr] gap-x-10 gap-y-2 text-xs">
            <div className="truncate">
              <span className="text-gray-600">Código:</span>
              <p className="font-medium truncate">{product.code || "-"}</p>
            </div>
            <div className="flex flex-col truncate">
              <span className="text-gray-600">Precio:</span>
              <p className="font-medium truncate">
                {product.price.toLocaleString()} Gs
              </p>
            </div>
            <div className="truncate">
              <span className="text-gray-600">Proveedor:</span>
              <p className="font-medium truncate">La Mascota S.A.</p>
            </div>
            <div className="flex flex-col truncate">
              <span className="text-gray-600">Costo:</span>
              <p className="font-medium truncate">
                {product.cost?.toLocaleString() || "-"} Gs
              </p>
            </div>
            <div className="truncate">
              <span className="text-gray-600">Categoría:</span>
              <p className="font-medium truncate">
                {getCategoryLabel(product.category)}
              </p>
            </div>
            <div className="flex flex-col truncate">
              <span className="text-gray-600">Cantidad:</span>
              <p className="font-medium truncate">{product.quantity}</p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => onClick(product.id)}
          className="mt-2 w-full py-1 text-xs bg-gray-900 hover:bg-gray-800
                     text-white rounded-md"
        >
          Ver detalles
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;