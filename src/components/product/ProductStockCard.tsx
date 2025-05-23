"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

interface ImageType {
  id: number;
  previewUrl: string;
  originalUrl: string;
}

interface ProductStockCardProps {
  product: {
    id: number;
    name: string;
    code: string;
    cost: number;
    iva: number;
    category: string;
    price: number;
    image: ImageType | null;
    stock: number;
  };
  onClick?: () => void; // opcional por si querés hacer algo al hacer click
}

const ProductStockCard: React.FC<ProductStockCardProps> = ({ product, onClick }) => {
  return (
    <Card
      className="overflow-hidden mb-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row p-4">
        <div className="w-[100px] h-[100px] mb-4 sm:mb-0 sm:mr-4 flex-shrink-0">
          {product.image?.originalUrl ? (
            <Image
              src={product.image.originalUrl}
              alt={product.name}
              width={100}
              height={100}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded">
              {product.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-4">{product.name}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="flex flex-col">
              <p className="text-sm text-gray-500">Código</p>
              <p className="text-sm text-gray-500 mt-2">Proveedor</p>
              <p className="text-sm text-gray-500 mt-2">Categoría</p>
              <p className="text-sm text-gray-500 mt-2">Precio Unitario</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm">{product.code}</p>
              <p className="text-sm mt-2">La Mascota S.A.</p>
              <p className="text-sm mt-2">{product.category}</p>
              <p className="text-sm mt-2">{product.price.toLocaleString()} Gs</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-500">Costo</p>
              <p className="text-sm text-gray-500 mt-2">Stock</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm">{product.cost.toLocaleString()} Gs</p>
              <p className="text-sm mt-2">{product.stock.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductStockCard;
