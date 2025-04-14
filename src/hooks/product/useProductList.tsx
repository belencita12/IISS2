"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { getProducts } from "@/lib/products/getProducts";
import { getStockDetails } from "@/lib/stock/getStockDetails";
import { Product, ProductResponse } from "@/lib/products/IProducts";
import useDebounce from "@/hooks/useDebounce";
import { toast } from "@/lib/toast";
import { useQuery } from "@/hooks/useQuery";

interface FiltersType {
  code: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  minCost: string;
  maxCost: string;
}

// Extendemos para incluir parámetros de paginación
interface QueryParams extends FiltersType {
  page: number;
  size: number;
}

export function useProductList(token: string) {
  const initialFilters = useMemo(() => ({
    code: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minCost: "",
    maxCost: "",
  }), []);

  const [inputFilters, setInputFilters] = useState<FiltersType>(initialFilters);
  
  const debouncedFilters = useDebounce(inputFilters, 500);
  
  // Usamos useQuery para gestionar la búsqueda y paginación
  const { query, setQuery, toQueryString } = useQuery<QueryParams>({
    ...initialFilters,
    page: 1,
    size: 16
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 16,
  });

  const loadProductStock = useCallback(
    async (productId: string) => {
      try {
        const stockData = await getStockDetails(productId, token);
        return stockData.data.reduce((total, detail) => total + detail.amount, 0);
      } catch (error) {
        toast("error", `Error al cargar el stock del producto ${productId}`);
        return 0;
      }      
    },
    [token]
  );

  const loadProducts = useCallback(
    async (page: number, filterParams = initialFilters) => {
      if (!token) return;

      setIsLoading(true);
      try {
        const preparedParams = {
          ...filterParams,
          page,
          size: pagination.pageSize,
          code: filterParams.code ? filterParams.code.trim().toLowerCase() : undefined,
          minCost: filterParams.minCost !== "" ? parseFloat(filterParams.minCost) : undefined,
          maxCost: filterParams.maxCost !== "" ? parseFloat(filterParams.maxCost) : undefined,
          minPrice: filterParams.minPrice !== "" ? parseFloat(filterParams.minPrice) : undefined,
          maxPrice: filterParams.maxPrice !== "" ? parseFloat(filterParams.maxPrice) : undefined,
        };

        const data: ProductResponse = await getProducts(preparedParams, token);

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
        
        // Actualizamos el query para mantener sincronizado el estado
        setQuery({
          ...filterParams,
          page,
          size: data.size
        });
      }  catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al obtener productos.";
      toast("error", errorMessage);
      setProducts([]);
      } finally {
        setIsLoading(false);
      }
    },
    [token, pagination.pageSize, loadProductStock, initialFilters, setQuery]
  );

  useEffect(() => {
    if (token) {
      loadProducts(1, debouncedFilters);
    }
  }, [debouncedFilters, token, loadProducts]);

  useEffect(() => {
    if (token) {
      loadProducts(1);
    }
  }, [token]);

  const handleSearch = () => {
    loadProducts(1, inputFilters);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, currentPage: page }));
    loadProducts(page, inputFilters);
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
    queryString: toQueryString 
  };
}