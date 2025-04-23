"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { getProducts } from "@/lib/products/getProducts";
import { getStockDetails } from "@/lib/stock/getStockDetails";
import { Product, ProductResponse } from "@/lib/products/IProducts";
import useDebounce from "@/hooks/useDebounce";
import { toast } from "@/lib/toast";
import { useQuery } from "@/hooks/useQuery";
import { normalizeText } from "@/lib/utils";

interface FiltersType {
  searchTerm: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  minCost: string;
  maxCost: string;
}

interface QueryParams {
  code?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minCost?: number;
  maxCost?: number;
  page: number;
  size: number;
}

export function useProductList(token: string) {
  const initialFilters = useMemo<FiltersType>(
    () => ({
      searchTerm: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      minCost: "",
      maxCost: "",
    }),
    []
  );

  const [inputFilters, setInputFilters] = useState<FiltersType>(initialFilters);
  const debouncedFilters = useDebounce(inputFilters, 600);
  const { query, setQuery, toQueryString } = useQuery<QueryParams>({
    page: 1,
    size: 16,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 16,
  });

  const loadProducts = useCallback(
    async (page: number, filterParams: FiltersType = initialFilters) => {
      if (!token) return;
      setIsLoading(true);

      // Obtenemos el término de búsqueda y preparamos parámetros de búsqueda por código si empieza con "prod-"
      const term = filterParams.searchTerm.trim();
      const searchParams: { code?: string } = {};
      if (term.toLowerCase().startsWith("prod-")) {
        searchParams.code = term;
      }

      const preparedParams: QueryParams = {
        ...searchParams,
        page,
        size: pagination.pageSize,
        category: filterParams.category || undefined,
        minCost:
          filterParams.minCost !== ""
            ? parseFloat(filterParams.minCost)
            : undefined,
        maxCost:
          filterParams.maxCost !== ""
            ? parseFloat(filterParams.maxCost)
            : undefined,
        minPrice:
          filterParams.minPrice !== ""
            ? parseFloat(filterParams.minPrice)
            : undefined,
        maxPrice:
          filterParams.maxPrice !== ""
            ? parseFloat(filterParams.maxPrice)
            : undefined,
      };

      try {
        const data: ProductResponse = await getProducts(preparedParams, token);

        let filteredProducts = data.data;
        let totalItems = data.total;
        let totalPages = data.totalPages;

        // BLOQUE DE FILTRADO LOCAL POR NOMBRE: Si existe término de búsqueda y no buscamos por código, aplico filtrado local sobre el array devuelto.
        if (term && !preparedParams.code) {
          const norm = normalizeText(term); // Normalizamos texto de búsqueda para evitar diferencias por acentos o mayúsculas
          filteredProducts = filteredProducts.filter(p => // Filtramos productos cuyo nombre normalizado incluya el término
            normalizeText(p.name).includes(norm)
          );

          totalItems = filteredProducts.length;
          totalPages =
            totalItems > 0
              ? Math.ceil(totalItems / pagination.pageSize)
              : 1;

          filteredProducts = filteredProducts.slice(
            (page - 1) * pagination.pageSize,
            page * pagination.pageSize
          );
        }

        setPagination({
          currentPage: page,
          totalPages,
          totalItems,
          pageSize: data.size,
        });
        setProducts(filteredProducts);



        setQuery({ ...preparedParams, page, size: data.size });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Error al obtener productos.";
        toast("error", message);
        setProducts([]);
        setPagination((prev) => ({ ...prev, totalItems: 0, totalPages: 1 }));
      } finally {
        setIsLoading(false);
      }
    },
    [token, pagination.pageSize, setQuery, initialFilters]
  );

  useEffect(() => {
    loadProducts(1, debouncedFilters);
  }, [debouncedFilters, token, loadProducts]);

  useEffect(() => {
    loadProducts(1, initialFilters);
  }, [token]);

  const handleSearch = () => loadProducts(1, inputFilters);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: page }));
    loadProducts(page, inputFilters);
  };

  return {
    products,
    isLoading,
    pagination,
    inputFilters,
    setInputFilters,
    handleSearch,
    handlePageChange,
    queryString: toQueryString,
  };
}