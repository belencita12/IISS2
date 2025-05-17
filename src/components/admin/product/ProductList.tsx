"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/admin/product/ProductCard";
import ProductFilters from "@/components/admin/product/filter/ProductFilter";
import { useProductList } from "@/hooks/product/useProductList";
import { useProductTag } from "@/hooks/product/useProductTag";
import GenericPagination from "@/components/global/GenericPagination";
import ProductListSkeleton from "./skeleton/ProductListSkeleton";
import { Product } from "@/lib/products/IProducts";
import { useTranslations } from "next-intl";

interface ProductListProps {
  token: string;
}

export default function ProductListPage({ token }: ProductListProps) {
  const router = useRouter();

  const b = useTranslations("Button");
  const p = useTranslations("ProductDetail");
  const e = useTranslations("Error");

  // Hook para filtrado normal
  const {
    products,
    isLoading,
    pagination,
    inputFilters,
    setInputFilters,
    handleSearch,
    handlePageChange,
  } = useProductList(token);

  // Hook para filtrado por tags
  const {
    filteredProducts: tagFilteredProducts,
    isTagFiltering,
    fetchFilteredProducts,
    tagPagination,
    handleTagPageChange,
    syncPageSize,
    selectedTags,
    getFilteredProductIds,
    recalculatePagination,
  } = useProductTag(token, pagination.pageSize);

  // Estado para almacenar productos combinados
  const [combinedProducts, setCombinedProducts] = useState<Product[]>([]);

  useEffect(() => {
    syncPageSize(pagination.pageSize);
  }, [pagination.pageSize, syncPageSize]);

  const combineFilters = useCallback(() => {
    if (selectedTags.length === 0) {
      return;
    }

    const tagProductIds = getFilteredProductIds();

    // Filtrar productos que coincidan con tags Y con otros filtros
    const filteredByBoth = products.filter(
      (product) =>
        tagProductIds.has(product.id) &&
        (inputFilters.category
          ? product.category === inputFilters.category
          : true)
    );

    // Recalcular paginación
    recalculatePagination(filteredByBoth.length);

    const startIndex = (tagPagination.currentPage - 1) * tagPagination.pageSize;
    const endIndex = Math.min(
      startIndex + tagPagination.pageSize,
      filteredByBoth.length
    );

    setCombinedProducts(filteredByBoth.slice(startIndex, endIndex));
  }, [
    selectedTags,
    products,
    inputFilters.category,
    getFilteredProductIds,
    recalculatePagination,
    tagPagination.currentPage,
    tagPagination.pageSize,
  ]);

  useEffect(() => {
    if (selectedTags.length > 0) {
      combineFilters();
    } else {
      setCombinedProducts([]);
    }
  }, [selectedTags, products, inputFilters.category, combineFilters]);

  const displayedProducts = useMemo(() => {
    if (selectedTags.length > 0) {
      return combinedProducts;
    }
    return products;
  }, [selectedTags, combinedProducts, products]);

  // Maneja el cambio de tags seleccionados
  const handleTagsChange = async (tags: string[]) => {
    await fetchFilteredProducts(tags);
    if (tags.length === 0) {
      handleSearch();
    }
  };

  const preventInvalidKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "e") e.preventDefault();
  };

  const handleCardClick = (productId: string) => {
    router.push(`/dashboard/products/${productId}`);
  };

  const isFilteringByTags = selectedTags.length > 0;
  const currentPagination = isFilteringByTags ? tagPagination : pagination;
  const currentHandlePageChange = isFilteringByTags
    ? (page: number) => {
        handleTagPageChange(page);
        setTimeout(combineFilters, 0);
      }
    : handlePageChange;
  const loading = isLoading || isTagFiltering;

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <div className="mb-2">
        <ProductFilters
          filters={inputFilters}
          setFilters={setInputFilters}
          onSearch={() => {
            handleSearch();
            if (selectedTags.length > 0) {
              setTimeout(combineFilters, 100);
            }
          }}
          preventInvalidKeys={preventInvalidKeys}
          selectedTags={selectedTags}
          onTagsChange={handleTagsChange}
          token={token}
        />
      </div>
      <div className="mt-8 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{p("titleProducts")}</h1>
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/products/register`)}
          className="px-6"
        >
          {b("add")}
        </Button>
      </div>

      {loading ? (
        <ProductListSkeleton />
      ) : displayedProducts.length === 0 ? (
        <p className="text-center py-4">{e("notFoundField", {field: "productos"})}</p>
      ) : (
        <div className="flex flex-wrap justify-between gap-y-4">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={handleCardClick}
            />
          ))}
        </div>
      )}

      <GenericPagination
        handlePreviousPage={() =>
          currentHandlePageChange(currentPagination.currentPage - 1)
        }
        handlePageChange={currentHandlePageChange}
        handleNextPage={() =>
          currentHandlePageChange(currentPagination.currentPage + 1)
        }
        currentPage={currentPagination.currentPage}
        totalPages={currentPagination.totalPages}
      />
    </div>
  );
}