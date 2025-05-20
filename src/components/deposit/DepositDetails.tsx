"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProductFilters from "@/components/admin/product/filter/ProductFilter";
import { getStockDetailsByStock } from "@/lib/stock/getStockDetailsByStock";
import { StockData, StockDetailsResponse, StockDetailsData } from "@/lib/stock/IStock";
import { Product } from "@/lib/products/IProducts";
import { toast } from "@/lib/toast";
import { getStockById } from "@/lib/stock/getStockById";
import GenericPagination from "../global/GenericPagination";
import StockDetailCard from "./StockDetailCard";
import StockDetailCardskeleton from "./skeleton/StockDetailSkeleton";
import { useTranslations } from "next-intl";

interface DepositDetailsProps {
  token: string;
  stockId: string;
}

interface ProductWithAmount extends Product {
  amount: number;
}

export default function DepositDetails({ token, stockId }: DepositDetailsProps) {
  const router = useRouter();

  const [products, setProducts] = useState<ProductWithAmount[]>([]);
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

  const st= useTranslations("StockDetail");
  const b = useTranslations("Button");
  const e = useTranslations("Error");


  const fetchStockProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const stockDetails = await getStockDetailsByStock(stockId, token, { 
        page: currentPage,
        size: 500,
        productSearch: filters.searchTerm,
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minCost: filters.minCost,
        maxCost: filters.maxCost,
        tags: selectedTags,
      });

      const productList: ProductWithAmount[] = stockDetails.data
      .filter(detail => detail.amount > 0 && detail.product)
      .map(detail => ({
        ...detail.product,
        amount: detail.amount,
      }));

      setProducts(productList);
      setTotalPages(stockDetails.totalPages || 1);
    } catch (error: unknown) {
      toast("error", error instanceof Error ? error.message : e("notGetData"));
    } finally {
      setIsLoading(false);
    }
  }, [stockId, token, filters, selectedTags, currentPage]);


  useEffect(() => {
    fetchStockProducts();
  }, [fetchStockProducts]);

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
      <div className="mb-6 mt-6">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/stock')}
          className="border-black border-solid"
        >
          {b("toReturn")}
        </Button>
      </div>

      <div className="mb-6">
        {depositInfo ? (
          <div>
            <h2 className="text-3xl font-bold">{depositInfo.name}</h2>
            <p className="text-gray-600">{depositInfo.address}</p>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold">{st("title")}</h2>
            <p className="text-gray-400">{b("loading")}</p>
          </div>
        )}
      </div>
      <ProductFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={fetchStockProducts}
        preventInvalidKeys={preventInvalidKeys}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        token={token}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{st("productStock")}</h1>
        <div className="flex gap-4">
          <Button
            variant="default"
            onClick={() => router.push(`/dashboard/products/register`)}
            className="bg-black text-white hover:bg-gray-800"
          >
            {b("add")}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <StockDetailCardskeleton />
      ) : products.length === 0 ? (
        <p className="text-center py-4">{e("notFound")}</p>
      ) : (
        products.map((product) => (
          <StockDetailCard
            key={product.id}
            product={product}
            amount={product.amount}
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
