"use client";

import { Input } from "@/components/ui/input";
import SearchBar from "@/components/global/SearchBar";
import GenericTable, { Column, TableAction } from "@/components/global/GenericTable";
import { Product } from "@/lib/products/IProducts";
import PurchaseSearchSkeleton from "./skeleton/PurchaseSearchSkeleton";

type ProductSearchProps = {
  searchProducts: Product[];
  onSearch: (query: string) => void;
  onAddProduct: (product: Product, quantity: number) => void;
  getQuantity: (productId: string) => number;
  setQuantity: (productId: string, quantity: number) => void;
  resetSearch: () => void;
  isLoading?: boolean;
  searchQuery?: string;
  hasSearched?: boolean;
};

export default function ProductSearch({
  searchProducts,
  onSearch,
  onAddProduct,
  getQuantity,
  setQuantity,
  resetSearch,
  isLoading = false,
  hasSearched = false,
}: ProductSearchProps) {
  const columns: Column<Product>[] = [
    { header: "Código", accessor: "code" },
    { header: "Nombre", accessor: "name" },
    {
      header: "Cantidad",
      accessor: (product) => (
        <Input
          type="number"
          className="w-24"
          min={1}
          onKeyDown={(e) => {
            if (e.key === "-" || e.key === "e") e.preventDefault();
          }}
          value={getQuantity(product.id)}
          onChange={(e) => setQuantity(product.id, Number(e.target.value))}
        />
      ),
    },
  ];

  const actions: TableAction<Product>[] = [
    {
      label: "Agregar",
      icon: (
        <div className="px-4 py-2 border border-black bg-white text-black rounded-md">
          Agregar
        </div>
      ),
      onClick: (product) => {
        onAddProduct(product, getQuantity(product.id));
        resetSearch();
      },
    },
  ];

  return (
    <div className="w-full">
      <SearchBar
        onSearch={onSearch}
        debounceDelay={400}
        placeholder="Buscar por nombre del producto..."
      />
      {isLoading ? (
        <PurchaseSearchSkeleton />
      ) : searchProducts && searchProducts.length > 0 ? (
        <GenericTable<Product>
          data={searchProducts}
          columns={columns}
          actions={actions}
          actionsTitle=""
          isLoading={false}
          skeleton={<PurchaseSearchSkeleton />}
        />
      ) : (
        hasSearched &&
        !isLoading && (
          <p className="text-center mt-4">No se encontró el producto.</p>
        )
      )}
    </div>
  );
}
