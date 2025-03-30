import React from "react";
import { Product } from "@/lib/admin/products/IProducts";
import { StockDetailsData } from "@/lib/stock/IStock";

interface ProductInfoProps {
  product: Product;
  stockDetails?: StockDetailsData[];
  isStockLoading?: boolean;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ 
  product, 
  stockDetails, 
  isStockLoading = false 
}) => {
  // Calcular stock total
  const totalStock = stockDetails 
    ? stockDetails.reduce((acc, detail) => acc + detail.amount, 0)
    : 0;

  return (
    <div className="space-y-2">
      {[
        { label: "Código", value: product.code },
        { label: "Precio", value: `${product.price?.toLocaleString()} Gs` },
        { label: "Costo", value: `${product.cost?.toLocaleString()} Gs` },
        { 
          label: "Stock", 
          value: isStockLoading 
            ? "Cargando..." 
            : totalStock.toString()
        },
        { label: "Categoría", value: product.category },
      ].map(({ label, value }) => (
        <div key={label} className="flex">
          <span className="text-gray-600 w-24">{label}:</span>
          <span className="flex-grow text-right">{value}</span>
        </div>
      ))}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {product.tags.map((tag, index) => (
            <span 
              key={index} 
              className="border border-black text-black px-2 py-1 text-sm rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductInfo;