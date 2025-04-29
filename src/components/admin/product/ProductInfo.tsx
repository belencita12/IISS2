"use client";
import type React from "react";
import type { Product } from "@/lib/products/IProducts";
import type { StockDetailsData } from "@/lib/stock/IStock";
import { getCategoryLabel } from "@/lib/products/utils/categoryLabel";

interface ProductInfoProps {
  product: Product;
  stockDetails?: StockDetailsData[];
  isStockLoading?: boolean;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  isStockLoading = false,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Descripción</h3>
          <p>{product.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start gap-2">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Precio</h3>
            <p>{product.price?.toLocaleString()} Gs</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Costo</h3>
            <p>{product.cost?.toLocaleString()} Gs</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Categoría</h3>
            <p>{getCategoryLabel(product.category)}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Cantidad</h3>
            <p>
              {isStockLoading ? "Cargando..." : product.quantity.toString()}
            </p>
          </div>
        </div>
      </div>

      {product.tags && product.tags.length > 0 && (
        <div className="flex items-start gap-2 flex-col">
          <h3 className="text-sm font-medium text-gray-500">Etiqueta/s</h3>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded-md border border-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
