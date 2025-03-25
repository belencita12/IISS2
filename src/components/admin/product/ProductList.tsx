"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/admin/product/ProductCard"; 
import ProductFilters from "@/components/admin/product/ProductFilter";

import { useProductList } from "@/hooks/product/useProductList";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface ProductListProps {
  token: string;
}
export default function ProductListPage({ token }: ProductListProps) {
  const router = useRouter();

  const {
    products,
    stockMap,
    isLoading,
    pagination,
    inputFilters,
    setInputFilters,
    handleSearch,
    handlePageChange,
  } = useProductList(token);

  const preventInvalidKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "e") e.preventDefault();
  };

  const handleCardClick = (productId: string) => {
    router.push(`/dashboard/products/${productId}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <ProductFilters
        filters={inputFilters}
        setFilters={setInputFilters}
        onSearch={handleSearch}
        preventInvalidKeys={preventInvalidKeys}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Button
          variant="default"
          onClick={() => router.push(`/dashboard/products/register`)}
          className="bg-black text-white hover:bg-gray-800"
        >
          Crear Producto
        </Button>
      </div>

      {isLoading ? (
        <p className="text-center py-4">Cargando productos...</p>
      ) : products.length === 0 ? (
        <p className="text-center py-4">No hay productos disponibles</p>
      ) : (
        products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            stock={stockMap[product.id] || 0}
            onClick={handleCardClick}
          />
        ))
      )}

      {/* Paginación */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              className={pagination.currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={pagination.currentPage === page}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              className={pagination.currentPage >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
