"use client"
import type React from "react"
import type { Product } from "@/lib/products/IProducts"
import type { StockDetailsData } from "@/lib/stock/IStock"
import { Badge } from "@/components/ui/badge"
import { getCategoryLabel } from "@/lib/products/utils/categoryLabel"
import { DollarSign, Package, Tag, FileText } from "lucide-react"

interface ProductInfoProps {
  product: Product
  stockDetails?: StockDetailsData[]
  isStockLoading?: boolean
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, isStockLoading = false }) => {
  return (
    <div className="space-y-4">
      {/* Descripción */}
      <div className="flex items-start gap-2">
        <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-gray-500">Descripción</h3>
          <p>{product.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Información de precios */}
        <div className="flex items-start gap-2">
          <DollarSign className="h-5 w-5 text-gray-500 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-500">Precio</h3>
            <p className="font-bold">{product.price?.toLocaleString()} Gs</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <DollarSign className="h-5 w-5 text-gray-500 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-500">Costo</h3>
            <p>{product.cost?.toLocaleString()} Gs</p>
          </div>
        </div>

        {/* Información de categoría */}
        <div className="flex items-start gap-2">
          <Tag className="h-5 w-5 text-gray-500 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-500">Categoría</h3>
            <p>{getCategoryLabel(product.category)}</p>
          </div>
        </div>

        {/* Información de inventario */}
        <div className="flex items-start gap-2">
          <Package className="h-5 w-5 text-gray-500 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-500">Cantidad</h3>
            <p>{isStockLoading ? "Cargando..." : product.quantity.toString()}</p>
          </div>
        </div>
      </div>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {product.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="px-2 py-1 text-sm text-gray-500 font-normal">
              #{tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductInfo
