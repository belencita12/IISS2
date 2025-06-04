import { useState, useEffect } from "react";
import { StockData, StockResponse } from "@/lib/stock/IStock";
import { Stamped } from "@/lib/stamped/IStamped";
import { STOCK_API, STAMPED_API } from "@/lib/urls";

export function useStockList(token: string, currentStockId?: number) {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getStockList = async (page: number = 1, includeDeleted: boolean = false) => {
    setIsLoading(true);
    try {
      // Primero obtenemos todos los depósitos
      const stockResponse = await fetch(`${STOCK_API}?page=${page}&size=10&includeDeleted=${includeDeleted}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!stockResponse.ok) {
        const errorData = await stockResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al obtener los depósitos");
      }

      const stockData: StockResponse = await stockResponse.json();
      const allStocks = stockData.data || [];

      // Luego obtenemos los timbrados activos
      const stampedResponse = await fetch(`${STAMPED_API}?page=${page}&size=10&includeDeleted=${includeDeleted}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!stampedResponse.ok) {
        const errorData = await stampedResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al obtener los timbrados");
      }

      const stampedData = await stampedResponse.json();
      const activeStamped = Array.isArray(stampedData) ? stampedData : stampedData.data || [];

      // Filtramos los depósitos que ya tienen timbrados activos, pero incluimos el depósito actual si se está editando
      const availableStocks = allStocks.filter((stock: StockData) => 
        !activeStamped.some((stamped: Stamped) => 
          stamped.stock.id === stock.id && (!currentStockId || stamped.stock.id !== currentStockId)
        )
      );

      setStocks(availableStocks);
      setTotalPages(stockData.totalPages || 1);
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