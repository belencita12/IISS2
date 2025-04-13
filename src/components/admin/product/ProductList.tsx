"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/admin/product/ProductCard"; 
import ProductFilters from "@/components/admin/product/filter/ProductFilter";
import { useProductList } from "@/hooks/product/useProductList";
import { useProductTag } from "@/hooks/product/useProductTag";
import GenericPagination from "@/components/global/GenericPagination";
import ProductListSkeleton from "./skeleton/ProductListSkeleton"; 

interface ProductListProps {
  token: string;
}

export default function ProductListPage({ token }: ProductListProps) {
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Hook para filtrado por tags
  const { 
    filteredProducts: tagFilteredProducts, 
    isTagFiltering, 
    fetchFilteredProducts,
    tagPagination,
    handleTagPageChange,
    setTagPageSize
  } = useProductTag(token);

  // Hook para filtrado normal
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

  // Sincronizar tamaño de página
  useEffect(() => {
    if (pagination.pageSize !== tagPagination.pageSize) {
      setTagPageSize(pagination.pageSize);
    }
  }, [pagination.pageSize, tagPagination.pageSize, setTagPageSize]);

  // Combinar los resultados de los filtros
  const displayedProducts = useMemo(() => {
    if (selectedTags.length > 0) {
      // Si hay tags, intersectamos con los productos filtrados
      const filteredIds = new Set(products.map(p => p.id));
      return tagFilteredProducts.filter(product => filteredIds.has(product.id));
    }
    return products;
  }, [selectedTags, products, tagFilteredProducts]);

  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
    fetchFilteredProducts(tags);
  };

  const preventInvalidKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "e") e.preventDefault();
  };

  const handleCardClick = (productId: string) => {
    router.push(`/dashboard/products/${productId}`);
  };

  // Determinar qué paginación usar
  const isFilteringByTags = selectedTags.length > 0;
  const currentPagination = isFilteringByTags ? tagPagination : pagination;
  const currentHandlePageChange = isFilteringByTags ? handleTagPageChange : handlePageChange;
  const loading = isLoading || (isFilteringByTags && isTagFiltering);

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <div className="mb-2">
        <ProductFilters
          filters={inputFilters}
          setFilters={setInputFilters}
          onSearch={handleSearch}
          preventInvalidKeys={preventInvalidKeys}
          selectedTags={selectedTags}
          onTagsChange={handleTagsChange}
          token={token}
        />
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/products/register`)}
          className="px-6"
        >
          Agregar
        </Button>
      </div>
      
      {loading ? (
        <ProductListSkeleton />
      ) : displayedProducts.length === 0 ? (
        <p className="text-center py-4">No hay productos disponibles</p>
      ) : (
        displayedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            stock={stockMap[product.id] || 0}
            onClick={handleCardClick}
          />
        ))
      )}
      
      <GenericPagination
        handlePreviousPage={() => currentHandlePageChange(currentPagination.currentPage - 1)}
        handlePageChange={currentHandlePageChange}
        handleNextPage={() => currentHandlePageChange(currentPagination.currentPage + 1)}
        currentPage={currentPagination.currentPage}
        totalPages={currentPagination.totalPages}
      />
    </div>
  );
}
