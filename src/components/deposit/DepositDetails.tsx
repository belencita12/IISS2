"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/admin/product/ProductCard";
import ProductFilters from "@/components/admin/product/filter/ProductFilter";
import { getStockDetailsByStock } from "@/lib/stock/getStockDetailsByStock";
import { getProductById } from "@/lib/products/getProductById";
import { StockData, StockDetailsResponse, StockDetailsData } from "@/lib/stock/IStock";
import { Product } from "@/lib/products/IProducts";
import { toast } from "@/lib/toast";
import { getStockById } from "@/lib/stock/getStockById";
import GenericPagination from "../global/GenericPagination";
import { set } from "react-hook-form";

interface DepositDetailsProps {
  token: string;
  stockId: string;
}

interface ProductWithAmount extends Product {
  amount: number;
}

interface ProductFilterState {
  searchTerm: string;
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
    searchTerm: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minCost: "",
    maxCost: "",
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [depositInfo, setDepositInfo] = useState<{ name: string; address: string } | null>(null);

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
      const searchTermMatch =
        filters.searchTerm === "" ||
        product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const categoryMatch =
        filters.category === "" || product.category === filters.category;

      

      const price = Number(product.price ?? 0);
      const cost = Number(product.cost ?? 0);

      const minPriceMatch =
        filters.minPrice === "" || price >= Number(filters.minPrice);
      const maxPriceMatch =
        filters.maxPrice === "" || price <= Number(filters.maxPrice);
      const minCostMatch =
        filters.minCost === "" || cost >= Number(filters.minCost);
      const maxCostMatch =
        filters.maxCost === "" || cost <= Number(filters.maxCost);

      const tagsMatch =
        selectedTags.length === 0 ||
        (Array.isArray(product.tags) && selectedTags.every(tag => product.tags?.includes(tag)));

      return (
        searchTermMatch &&
        categoryMatch &&
        minPriceMatch &&
        maxPriceMatch &&
        minCostMatch &&
        maxCostMatch &&
        tagsMatch
      );
    });

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [filters, products, selectedTags]);

  useEffect(() => {
    fetchStockProducts();
  }, [fetchStockProducts]);

  useEffect(() => {
    applyFilters();
  }, [filters, applyFilters]);

  useEffect(() => {
    async function fetchDepositInfo() {
      try {
        const stock = await getStockById(stockId, token);
        setDepositInfo({
          name: stock.name,
          address: stock.address,
        });
      } catch (error) {
        setDepositInfo(null);
      }
    }
    fetchDepositInfo();
  }, [stockId, token]);

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
      <div className="mb-6">
        {depositInfo ? (
          <div>
            <h2 className="text-3xl font-bold">{depositInfo.name}</h2>
            <p className="text-gray-600">{depositInfo.address}</p>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold">Depósito</h2>
            <p className="text-gray-400">Cargando información del depósito...</p>
          </div>
        )}
      </div>
      <ProductFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
        preventInvalidKeys={preventInvalidKeys}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        token={token}
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
        <p className="text-center py-4">Cargando detalles del Depósito...</p>
      ) : products.length === 0 ? (
        <p className="text-center py-4">No hay información del Depósito disponible</p>
      ) : (
        filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={handleCardClick}
          />
        ))
      )}

      <GenericPagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={(page) => handlePageChange(page)}
        handlePreviousPage={() => {
          if (currentPage > 1) handlePageChange(currentPage - 1);
        }}
        handleNextPage={() => {
          if (currentPage < totalPages) handlePageChange(currentPage + 1);
        }}
      />
    </div>
  );
}
