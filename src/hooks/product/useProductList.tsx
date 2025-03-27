import React, { useState, useCallback, useEffect, useMemo } from "react";
import { getProducts } from "@/lib/admin/products/getProducts";
import { getStockDetails } from "@/lib/stock/getStockDetails";
import { Product, ProductResponse } from "@/lib/admin/products/IProducts";
import useDebounce from "@/lib/admin/products/useDebounceHook";

export function useProductList(token: string) {
  // Initial filters state
  const initialFilters = useMemo(() => ({
    code: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minCost: "", 
    maxCost: "",
  }), []);

  const [searchFilters, setSearchFilters] = useState(initialFilters);
  const [inputFilters, setInputFilters] = useState(initialFilters);
  
  // Debounce with a stable initial state
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

  // Memoize stock loading to prevent unnecessary recreations
  const loadProductStock = useCallback(
    async (productId: string) => {
      try {
        const stockData = await getStockDetails(productId, token);
        return stockData.data.reduce((total, detail) => total + detail.amount, 0);
      } catch (error) {
        console.error(`Error loading stock for product ${productId}:`, error);
        return 0;
      }
    },
    [token]
  );

  // Memoize product loading with stable dependencies
  const loadProducts = useCallback(
    async (page: number, filterParams = initialFilters) => {
      if (!token) return;

      setIsLoading(true);
      try {
        const preparedParams = {
          ...filterParams,
          page,
          size: pagination.pageSize,
          // Improved code filtering: trim and make case-insensitive
          code: filterParams.code ? filterParams.code.trim().toLowerCase() : undefined,
          minCost: filterParams.minCost !== "" ? parseFloat(filterParams.minCost) : undefined,
          maxCost: filterParams.maxCost !== "" ? parseFloat(filterParams.maxCost) : undefined,
          minPrice: filterParams.minPrice !== "" ? parseFloat(filterParams.minPrice) : undefined,
          maxPrice: filterParams.maxPrice !== "" ? parseFloat(filterParams.maxPrice) : undefined,
        };

        const data: ProductResponse = await getProducts(preparedParams, token);

        // Load stock for each product concurrently
        const stockPromises = data.data.map(async (product) => ({
          id: product.id,
          stock: await loadProductStock(product.id)
        }));

        const stockResults = await Promise.all(stockPromises);
        
        const newStockMap: Record<string, number> = Object.fromEntries(
          stockResults.map(result => [result.id, result.stock])
        );
        
        setStockMap(newStockMap);
        setProducts(data.data);
        setPagination({
          currentPage: page,
          totalPages: data.totalPages,
          totalItems: data.total,
          pageSize: data.size,
        });
      } catch (error) {
        console.error("Error fetching products", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    },
    [token, pagination.pageSize, loadProductStock, initialFilters]
  );

  // Simplified effect for filter changes
  useEffect(() => {
    if (token && JSON.stringify(debouncedFilters) !== JSON.stringify(searchFilters)) {
      setSearchFilters(debouncedFilters);
      loadProducts(1, debouncedFilters);
    }
  }, [debouncedFilters, token, searchFilters, loadProducts]);

  // Initial load effect
  useEffect(() => {
    if (token) {
      loadProducts(1);
    }
  }, [token]);

  const handleSearch = () => {
    setSearchFilters(inputFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    loadProducts(1, inputFilters);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, currentPage: page }));
    loadProducts(page, searchFilters);
  };

  return {
    products,
    stockMap,
    isLoading,
    pagination,
    inputFilters,
    setInputFilters,
    handleSearch,
    handlePageChange,
  };
}