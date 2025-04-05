"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/admin/product/ProductCard"; 
import ProductFilters from "@/components/admin/product/filter/ProductFilter";
import { useProductList } from "@/hooks/product/useProductList";
import { useProductTag } from "@/hooks/product/useProductTag";
import GenericPagination from "@/components/global/GenericPagination";  

interface ProductListProps {
  token: string;
}

export default function ProductListPage({ token }: ProductListProps) {
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Usamos el hook mejorado con soporte de paginación
  const { 
    filteredProducts, 
    isTagFiltering, 
    fetchFilteredProducts,
    tagPagination,
    handleTagPageChange,
    setTagPageSize
  } = useProductTag(token);

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

  useEffect(() => {
    if (pagination.pageSize !== tagPagination.pageSize) {
      setTagPageSize(pagination.pageSize);
    }
  }, [pagination.pageSize, tagPagination.pageSize, setTagPageSize]);

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

  const isFiltering = selectedTags.length > 0;
  const loading = isFiltering ? isTagFiltering : isLoading;
  const displayedProducts = isFiltering ? filteredProducts : products;

  const currentPagination = isFiltering ? tagPagination : pagination;
  const currentHandlePageChange = isFiltering ? handleTagPageChange : handlePageChange;

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
          variant="default"
          onClick={() => router.push(`/dashboard/products/register`)}
          className="bg-black text-white hover:bg-gray-800"
        >
          Crear Producto
        </Button>
      </div>
      {loading ? (
        <p className="text-center py-4">Cargando productos...</p>
      ) : displayedProducts.length === 0 && !loading ? (
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