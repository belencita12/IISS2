"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchBar from "@/components/global/SearchBar";
import { Product } from "@/lib/products/IProducts";

type ProductSearchProps = {
  searchProducts: Product[];
  quantity: number;
  onQuantityChange: (value: number) => void;
  onSearch: (query: string) => void;
  onAddProduct: (product: Product) => void;
};

export default function ProductSearch({
  searchProducts,
  quantity,
  onQuantityChange,
  onSearch,
  onAddProduct,
}: ProductSearchProps) {
  return (
    <div>
      <SearchBar
        onSearch={onSearch}
        placeholder="Buscar por nombre del producto..."
      />
      <div className="flex flex-col gap-2 mt-2">
        {searchProducts.length > 0 ? (
          searchProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-2 justify-between"
            >
              <span className="text-sm flex-1">
                {product.name} - {product.price} USD
              </span>
              <Input
                type="number"
                placeholder="Cantidad"
                className="w-24"
                value={quantity}
                min={1}
                onChange={(e) => onQuantityChange(Number(e.target.value))}
              />
              <Button
                variant="outline"
                type="button"
                onClick={() => onAddProduct(product)}
              >
                Agregar
              </Button>
            </div>
          ))
        ) : (
          <span className="text-sm text-gray-500">
            No hay productos para mostrar.
          </span>
        )}
      </div>
    </div>
  );
}
