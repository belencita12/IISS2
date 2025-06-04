import { useState, useEffect } from "react";
import { StockData, StockResponse } from "@/lib/stock/IStock";
import { Stamped } from "@/lib/stamped/IStamped";
import { STOCK_API, STAMPED_API } from "@/lib/urls";
import { apiFetch } from "@/lib/api/apiFetch";
import { PaginationResponse } from "@/lib/types";

export function useStockList(token: string, currentStockId?: number) {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getStockList = async (page: number = 1, includeDeleted: boolean = false) => {
    setIsLoading(true);
    try {
      const stockData = await apiFetch<PaginationResponse<StockData>>(`${STOCK_API}?page=${page}&size=20&includeDeleted=${includeDeleted}`, token);
      
      if (!stockData.data) {
        throw new Error("No se pudo obtener la lista de depósitos");
      }

      const allStocks = stockData.data.data;

      // Ya no filtramos los depósitos, mostramos todos
      setStocks(allStocks);
      setTotalPages(stockData.data.totalPages || 1);
      setCurrentPage(page);
      setError(null);
    } catch (error) {
      console.error("Error al obtener depósitos:", error);
      setError(error instanceof Error ? error.message : "Error al obtener los depósitos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getStockList(1);
    }
  }, [token, currentStockId]);

  return {
    stocks,
    isLoading,
    error,
    getStockList,
    currentPage,
    totalPages,
  };
} 