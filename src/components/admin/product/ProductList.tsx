"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/admin/products/getProducts";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Product, ProductResponse } from "@/lib/admin/products/IProducts";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import ProductFilters from "@/components/admin/product/ProductFilter";

interface ProductListProps {
  token: string;
}

export default function ProductListPage({ token }: ProductListProps) {
  const router = useRouter();

  // Estado de los filtros aplicados en la búsqueda
  const [searchFilters, setSearchFilters] = useState({
    code: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minCost: "",
    maxCost: "",
  });

  const [inputFilters, setInputFilters] = useState({ ...searchFilters });
  const [products, setProducts] = useState<Product[]>([]);
  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 5,
  });

  // La consulta se basa en searchFilters
  const loadProducts = useCallback(
    async (page: number, filterParams = searchFilters) => {
      setIsLoading(true);
      try {
        const params = { ...filterParams, page, size: pagination.pageSize };
        const data: ProductResponse = await getProducts(params, token);

        setStockMap((prev) => {
          const newMap = { ...prev };
          data.data.forEach((product) => {
            if (!newMap[product.id]) {
              // Simular un stock aleatorio
              newMap[product.id] = Math.floor(Math.random() * 300) + 1;
            }
          });
          return newMap;
        });

        setProducts(data.data);
        setPagination({
          currentPage: page,
          totalPages: data.totalPages,
          totalItems: data.total,
          pageSize: data.size,
        });
      } catch (error) {
        console.error("Error al obtener productos", error);
      } finally {
        setIsLoading(false);
      }
    },
    [searchFilters, token, pagination.pageSize]
  );

  useEffect(() => {
    if (token) {
      loadProducts(1);
    }
  }, [token, loadProducts]);

  const handleSearch = (updatedFilters = inputFilters) => {
    setSearchFilters(updatedFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    loadProducts(1, updatedFilters);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: page }));
    loadProducts(page);
  };

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
        onClick={() => router.push(``)}
        className="bg-black text-white hover:bg-gray-800"
        > Crear Producto
        </Button>
      </div>

      {isLoading ? (
        <p className="text-center py-4">Cargando productos...</p>
      ) : products.length === 0 ? (
        <p className="text-center py-4">No hay productos disponibles</p>
      ) : (
        products.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden mb-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCardClick(product.id)}
          >
            <div className="flex p-4">
              <div className="w-[100px] h-[100px] mr-4 flex-shrink-0">
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
                <div
                  className="grid gap-x-2"
                  style={{ gridTemplateColumns: "auto auto auto auto" }}
                >
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500">Proveedor</p>
                    <p className="text-sm text-gray-500 mt-2">Categoría</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Precio Unitario
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm">La Mascota S.A.</p>
                    <p className="text-sm mt-2">{product.category}</p>
                    <p className="text-sm mt-2">
                      {product.price.toLocaleString()} Gs
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500">Costo</p>
                    <p className="text-sm text-gray-500 mt-2">Stock</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm">
                      {product.cost?.toLocaleString()} Gs
                    </p>
                    <p className="text-sm mt-2">
                      {stockMap[product.id] || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))
      )}

      {/* Paginación */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() =>
                handlePageChange(pagination.currentPage - 1)
              }
              className={
                pagination.currentPage <= 1
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
          {Array.from(
            { length: pagination.totalPages },
            (_, i) => i + 1
          ).map((page) => (
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
              onClick={() =>
                handlePageChange(pagination.currentPage + 1)
              }
              className={
                pagination.currentPage >= pagination.totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
