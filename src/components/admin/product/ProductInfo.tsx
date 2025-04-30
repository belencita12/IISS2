"use client";

import React from "react";
import type { Product } from "@/lib/products/IProducts";
import { getCategoryLabel } from "@/lib/products/utils/categoryLabel";

interface ProductInfoProps {
  product: Product;
  isStockLoading: boolean;   
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  isStockLoading = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Descripción completa primero */}
      <div>
        <h3 className="text-sm font-medium text-gray-500">Descripción</h3>
        <p>{product.description}</p>
      </div>

      {/* Datos en 2 columnas: cantidad primero, luego etiquetas, luego precio y categoría, y costo al final */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cantidad en primera columna */}
        <div>
          <h3 className="text-sm font-medium text-gray-500">Precio</h3>
          <p>{product.price?.toLocaleString()} Gs</p>
        </div>


        {/* Etiquetas en segunda columna, alineado a la derecha */}
        <div className="justify-self-end">
          <h3 className="text-sm font-medium text-gray-500 text-right">Categoría</h3>
          <p className="text-right">{getCategoryLabel(product.category)}</p>
        </div>

        {/* Precio en primera columna (segunda fila) */}
        <div>
          <h3 className="text-sm font-medium text-gray-500">Costo</h3>
          <p>{product.cost?.toLocaleString()} Gs</p>
        </div>
        
        {/* Categoría en segunda columna (segunda fila), alineado a la derecha */}
        <div className="justify-self-end">
          {product.tags && product.tags.length > 0 && (
            <>
              <h3 className="text-sm font-medium text-gray-500 text-right">Etiqueta/s</h3>
              <div className="flex flex-wrap gap-2 mt-1 justify-end">
                {product.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded-md border border-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
        {/* Costo en primera columna (tercera fila) */}
        <div>
          <h3 className="text-sm font-medium text-gray-500">Cantidad</h3>
          <p>{isStockLoading ? "Cargando..." : product.quantity.toString()}</p>
        </div>
       

        {/* Placeholder vacío para mantener grid */}
        <div />
      </div>
    </div>
  );
};

export default ProductInfo;