import React from "react";
import { PurchaseDetail } from "@/lib/purchases/IPurchaseDetail";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

/**
 * Componente para mostrar los detalles de un producto en la compra.
 * Incluye imagen, nombre, etiquetas, código, categoría, precio, costo y cantidad.
 */
interface PurchaseProductCardProps {
  detail: PurchaseDetail;
}

const PurchaseProductCard: React.FC<PurchaseProductCardProps> = ({ detail }) => {
  const { product, quantity } = detail;
  
  return (
    <div>
      <Card className="overflow-hidden mb-4">
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
                {product.name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              <div className="col-span-1 md:col-span-3">
                <h3 className="text-lg font-semibold">{product.name || "Producto sin nombre"}</h3>
              </div>
              <div className="col-span-1 flex flex-wrap gap-1 items-center">
                {product.tags?.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="px-2 py-1 text-sm text-gray-500 font-normal"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="flex flex-col">
                <p className="text-sm text-gray-500">Código</p>
                <p className="text-sm text-gray-500 mt-2">Categoría</p>
                <p className="text-sm text-gray-500 mt-2">Precio Unitario</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm">{product.code || "N/A"}</p>
                <p className="text-sm mt-2">{product.category || "Sin categoría"}</p>
                <p className="text-sm mt-2">{product.price?.toLocaleString() || "0"} Gs</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-gray-500">Costo</p>
                <p className="text-sm text-gray-500 mt-2">Cantidad</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm">{product.cost?.toLocaleString() || "0"} Gs</p>
                <p className="text-sm mt-2">{quantity}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PurchaseProductCard;
