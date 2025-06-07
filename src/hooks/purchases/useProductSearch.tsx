import { useState, useEffect, useCallback } from "react";
import { Product, ProductQueryParams } from "@/lib/products/IProducts";
import { getProducts } from "@/lib/products/getProducts";
import { toast } from "@/lib/toast";

interface ExtendedProductQueryParams extends ProductQueryParams {
  name?: string;
  providerId?: number;
}

export const useProductSearch = (token: string, providerId?: number) => {
  const [searchProducts, setSearchProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchProducts = useCallback(
    async (query: string) => {
      setIsLoading(true);
      setHasSearched(true);
      try {
        const params: ExtendedProductQueryParams = {
          page: 1,
          size: 10,
          name: query,
          providerId,
        };
        const res = await getProducts(params, token);
        const productList = Array.isArray(res.data) ? res.data : [];

        //excluir servicios
        const filtered = productList.filter((p) => p.category !== "SERVICE");

        setSearchProducts(filtered);
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
    [token, providerId]
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
