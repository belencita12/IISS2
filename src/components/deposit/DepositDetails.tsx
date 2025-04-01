"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/admin/product/ProductCard";
import ProductFilters from "@/components/admin/product/filter/ProductFilter";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { getStockDetailsByStock } from "@/lib/stock/getStockDetailsByStock";
import { getProductById } from "@/lib/products/getProductById";
import { StockData, StockDetailsResponse, StockDetailsData} from "@/lib/stock/IStock";
import { Product } from "@/lib/products/IProducts";
import { toast } from "@/lib/toast";

interface DepositDetailsProps {
  token: string;
  stockId: string;
}

interface ProductWithAmount extends Product {
  amount: number;
}

interface ProductFilterState {
  code: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  minCost: string;
  maxCost: string;
}

export default function DepositDetails({ token, stockId }: DepositDetailsProps) {
  const router = useRouter();

  const [products, setProducts] = useState<ProductWithAmount[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithAmount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    code: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minCost: "",
    maxCost: "",
  });

  const preventInvalidKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "e") e.preventDefault();
  };

  const fetchStockProducts = useCallback(async () => {
    try {
      setIsLoading(true);

      const stockDetails = await getStockDetailsByStock(stockId, token);

      const productList: ProductWithAmount[] = stockDetails.data
        .filter((detail) => detail.product)
        .map((detail) => ({
          ...detail.product,
          amount: detail.amount,
        }));

      setProducts(productList);
      setFilteredProducts(productList);
      setTotalPages(1);
    } catch (error) {
      console.error("Error al obtener detalles de stock:", error);
      toast("error", "No se pudieron cargar los productos del depósito.");
    } finally {
      setIsLoading(false);
    }
  }, [stockId, token]);


  const applyFilters = useCallback(() => {
    const result = products.filter((product) => {
      const codeMatch = filters.code === "" || product.code?.toLowerCase().includes(filters.code.toLowerCase());
      const categoryMatch = filters.category === "" || product.category === filters.category;

      const price = Number(product.price ?? 0);
      const cost = Number(product.cost ?? 0);

      const minPriceMatch = filters.minPrice === "" || price >= Number(filters.minPrice);
      const maxPriceMatch = filters.maxPrice === "" || price <= Number(filters.maxPrice);
      const minCostMatch = filters.minCost === "" || cost >= Number(filters.minCost);
      const maxCostMatch = filters.maxCost === "" || cost <= Number(filters.maxCost);

      return (codeMatch && categoryMatch && minPriceMatch && maxPriceMatch && minCostMatch && maxCostMatch);
    });
      setFilteredProducts(result);
      setCurrentPage(1);
    }, [filters, products]);

  useEffect(() => {
    fetchStockProducts();
  }, [fetchStockProducts]);

  useEffect(() => {
    applyFilters();
  }, [filters, applyFilters]);

  const handleSearch = () => {
    applyFilters();
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCardClick = (productId: string) => {
    router.push(`/dashboard/products/${productId}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <ProductFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
        preventInvalidKeys={preventInvalidKeys}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Productos del Deposito</h1>
        <Button
          variant="default"
          onClick={() => router.push(`/dashboard/products/register`)}
          className="bg-black text-white hover:bg-gray-800"
        >
          Crear Producto
        </Button>
      </div>

      {isLoading ? (
        <p className="text-center py-4">Cargando detalles de stock...</p>
      ) : products.length === 0 ? (
        <p className="text-center py-4">No hay información de stock disponible</p>
      ) : (
        filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            stock={product.amount}
            onClick={handleCardClick}
          />
        ))
      )}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={currentPage === page}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
