"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/admin/products/getProducts";
import { getStockDetails } from "@/lib/stock/getStockDetails";
import ProductCard from "@/components/admin/product/ProductCard"; 
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
import useDebounce from "@/lib/admin/products/useDebounceHook";

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
  
  // Aplicamos debounce a los filtros de entrada (500ms de retraso)
  const debouncedFilters = useDebounce(inputFilters, 500);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 5,
  });

  // Función para cargar el stock de un producto
  const loadProductStock = useCallback(
    async (productId: string) => {
      try {
        const stockData = await getStockDetails(productId, token);
        const totalStock = stockData.data.reduce(
          (total, detail) => total + detail.amount,
          0
        );
        return totalStock;
      } catch (error) {
        console.error(`Error al cargar el stock del producto ${productId}:`, error);
        return 0;
      }
    },
    [token]
  );

  // La consulta se basa en searchFilters
  const loadProducts = useCallback(
    async (page: number, filterParams = searchFilters) => {
      setIsLoading(true);
      try {
        const params = { ...filterParams, page, size: pagination.pageSize };
        const data: ProductResponse = await getProducts(params, token);

        // Cargar el stock para cada producto
        const stockPromises = data.data.map(async (product) => {
          const productStock = await loadProductStock(product.id);
          return { id: product.id, stock: productStock };
        });

        const stockResults = await Promise.all(stockPromises);
        
        const newStockMap: Record<string, number> = {};
        stockResults.forEach(result => {
          newStockMap[result.id] = result.stock;
        });
        
        setStockMap(newStockMap);
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
    [searchFilters, token, pagination.pageSize, loadProductStock]
  );

  // Actualizamos los filtros con debounce
  useEffect(() => {
    if (token) {
      setSearchFilters(debouncedFilters);
      loadProducts(1, debouncedFilters);
    }
  }, [debouncedFilters, token, loadProducts]);

  // Carga inicial
  useEffect(() => {
    if (token) {
      loadProducts(1);
    }
  }, [token, loadProducts]);

  const handleSearch = () => {
    setSearchFilters(inputFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    loadProducts(1, inputFilters);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: page }));
    loadProducts(page, searchFilters);
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
              className={
                pagination.currentPage <= 1
                  ? "pointer-events-none opacity-50"
                  : ""
              }
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
