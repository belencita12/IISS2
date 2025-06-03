import { Product } from "@/lib/products/IProducts";
import { getStockProducts } from "@/lib/stock/getStockProduct";
import { toast } from "@/lib/toast";
import { useCallback, useEffect, useState } from "react";
import useDebounce from "../useDebounce";
import { useProductSearch } from "./useProductSearch"; 

export const useProductStock = (
  token: string, 
  stockId: number | null,
  movementType?: string
) => {
  // Para movimientos INBOUND, usa el hook de búsqueda general
  const productSearchHook = useProductSearch(token);
  
  // Para movimientos que requieren stock específico
  const [searchProducts, setSearchProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 1000);

  const fetchStockProducts = useCallback(
    async (query: string) => {
      if (!stockId) return;
      setIsLoading(true);
      setHasSearched(true);
      try {
        const stockData = await getStockProducts(stockId, query, token);
        const productList = stockData
          .map((item) => item.product)
          .filter((p) => p.category !== "SERVICE");
        setSearchProducts(productList);
      } catch (error) {
        toast(
          "error",
          error instanceof Error
            ? error.message
            : "Ocurrió un error al obtener los productos"
        );
        setSearchProducts([]);
      } finally {
        setIsLoading(false);
      }
    },
    [token, stockId]
  );

  useEffect(() => {
    // Solo usa fetchStockProducts para OUTBOUND y TRANSFER
    if (movementType !== "INBOUND" && debouncedQuery) {
      fetchStockProducts(debouncedQuery);
    } else if (movementType !== "INBOUND") {
      setSearchProducts([]);
      setHasSearched(false);
    }
  }, [debouncedQuery, fetchStockProducts, movementType]);

  const handleSearchProduct = (query: string) => {
    if (movementType === "INBOUND") {
      // Para INBOUND, usa el hook de búsqueda general
      productSearchHook.handleSearchProduct(query);
    } else {
      // Para OUTBOUND y TRANSFER, usa búsqueda por stock
      setSearchQuery(query);
    }
  };

  const setProductQuantity = (productId: string, value: number) => {
    if (movementType === "INBOUND") {
      productSearchHook.setProductQuantity(productId, value);
    } else {
      setQuantities((prev) => ({
        ...prev,
        [productId]: value,
      }));
    }
  };

  const getProductQuantity = (productId: string) => {
    if (movementType === "INBOUND") {
      return productSearchHook.getProductQuantity(productId);
    }
    return quantities[productId] ?? 1;
  };

  const resetSearch = () => {
    if (movementType === "INBOUND") {
      productSearchHook.resetSearch();
    } else {
      setSearchQuery("");
      setQuantities({});
    }
  };

  // Retorna los datos apropiados según el tipo de movimiento
  return {
    searchProducts: movementType === "INBOUND" 
      ? productSearchHook.searchProducts 
      : searchProducts,
    searchQuery: movementType === "INBOUND" 
      ? productSearchHook.searchQuery 
      : searchQuery,
    hasSearched: movementType === "INBOUND" 
      ? productSearchHook.hasSearched 
      : hasSearched,
    handleSearchProduct,
    setProductQuantity,
    getProductQuantity,
    resetSearch,
    isLoading: movementType === "INBOUND" 
      ? productSearchHook.isLoading 
      : isLoading,
  };
};