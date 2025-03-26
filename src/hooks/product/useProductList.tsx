import React, { useState, useCallback, useEffect } from "react";
import { getProducts } from "@/lib/admin/products/getProducts";
import { getStockDetails } from "@/lib/stock/getStockDetails";
import { Product, ProductResponse } from "@/lib/admin/products/IProducts";
import useDebounce from "@/lib/admin/products/useDebounceHook";

export function useProductList(token: string) {
  // Estado de los filtros aplicados en la búsqueda
  const [searchFilters, setSearchFilters] = useState({
    code: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minCost: "", 
    maxCost: "",
  });

  const [inputFilters, setInputFilters] = useState({ ...searchFilters });
  
  // Aplicamos debounce a los filtros de entrada (500ms de retraso)
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

  // Función para cargar el stock de un producto
  const loadProductStock = useCallback(
    async (productId: string) => {
      try {
        const stockData = await getStockDetails(productId, token);
        const totalStock = stockData.data.reduce(
          (total, detail) => total + detail.amount,
          0
        );
        return totalStock;
      } catch (error) {
        console.error(`Error al cargar el stock del producto ${productId}:`, error);
        return 0;
      }
    },
    [token]
  );

  // La consulta se basa en searchFilters
  const loadProducts = useCallback(
    async (page: number, filterParams = searchFilters) => {
      setIsLoading(true);
      try {
        const preparedParams = {
          ...filterParams,
          page,
          size: pagination.pageSize,
          minCost: filterParams.minCost !== "" ? parseFloat(filterParams.minCost) : undefined,
          maxCost: filterParams.maxCost !== "" ? parseFloat(filterParams.maxCost) : undefined,
          minPrice: filterParams.minPrice !== "" ? parseFloat(filterParams.minPrice) : undefined,
          maxPrice: filterParams.maxPrice !== "" ? parseFloat(filterParams.maxPrice) : undefined,
        };

        const data: ProductResponse = await getProducts(preparedParams, token);

        // Cargar el stock para cada producto
        const stockPromises = data.data.map(async (product) => {
          const productStock = await loadProductStock(product.id);
          return { id: product.id, stock: productStock };
        });

        const stockResults = await Promise.all(stockPromises);
        
        const newStockMap: Record<string, number> = {};
        stockResults.forEach(result => {
          newStockMap[result.id] = result.stock;
        });
        
        setStockMap(newStockMap);
        setProducts(data.data);
        setPagination({
          currentPage: page,
          totalPages: data.totalPages,
          totalItems: data.total,
          pageSize: data.size,
        });
      } catch (error) {
        console.error("Error al obtener productos", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    },
    [searchFilters, token, pagination.pageSize, loadProductStock]
  );

  // Actualizamos los filtros con debounce
  useEffect(() => {
    if (token) {
      setSearchFilters(debouncedFilters);
      loadProducts(1, debouncedFilters);
    }
  }, [debouncedFilters, token, loadProducts]);

  // Carga inicial
  useEffect(() => {
    if (token) {
      loadProducts(1);
    }
  }, [token, loadProducts]);

  const handleSearch = () => {
    setSearchFilters(inputFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    loadProducts(1, inputFilters);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: page }));
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