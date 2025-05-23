import { Product } from "@/lib/products/IProducts";
import { getStockProducts } from "@/lib/stock/getStockProduct";
import { toast } from "@/lib/toast";
import { useCallback, useEffect, useState } from "react";

export const useProductSearch = (token: string, stockId: number | null) => {
  const [searchProducts, setSearchProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchProducts = useCallback(
    async (query: string) => {
      if (!stockId) return;
      setIsLoading(true);
      setHasSearched(true);
      try {
        const stockData = await getStockProducts(stockId, query, token);
        const productList = stockData
          .map((item) => item.product)
          .filter((p) => p.category !== "SERVICE"); // Evitar servicios
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
    if (searchQuery) {
      fetchProducts(searchQuery);
    } else {
      setSearchProducts([]);
      setHasSearched(false);
    }
  }, [searchQuery, fetchProducts]);

  const handleSearchProduct = (query: string) => {
    setSearchQuery(query);
  };

  const setProductQuantity = (productId: string, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const getProductQuantity = (productId: string) => {
    return quantities[productId] ?? 1;
  };

  const resetSearch = () => {
    setSearchQuery("");
    setQuantities({});
  };

  return {
    searchProducts,
    searchQuery,
    hasSearched,
    handleSearchProduct,
    setProductQuantity,
    getProductQuantity,
    resetSearch,
    isLoading,
  };
};
