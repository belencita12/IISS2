import { useState, useEffect, useCallback } from "react";
import { fetchPaginated, ApiPaginationOptions } from "@/lib/api/apiPagination";
import { ApiError } from "@/lib/api/apiFetch";

interface UsePaginatedFetchState<T> {
  data: T[];
  loading: boolean;
  error: ApiError | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
}

interface UsePaginatedFetchOptions extends Omit<ApiPaginationOptions, "page"> {
  initialPage?: number;
  autoFetch?: boolean;
}

/**
 * Hook para realizar peticiones paginadas con gestión de estado
 * @param baseUrl URL base de la API
 * @param token Token de autenticación
 * @param options Opciones de configuración
 * @returns Estado y funciones para manejar la paginación
 */
export function usePaginatedFetch<T = unknown>(
  baseUrl: string,
  token: string,
  options: UsePaginatedFetchOptions = {}
) {
  const { initialPage = 1, autoFetch = true, ...fetchOptions } = options;

  const [state, setState] = useState<UsePaginatedFetchState<T>>({
    data: [],
    loading: autoFetch,
    error: null,
    pagination: {
      currentPage: initialPage,
      totalPages: 1,
      totalItems: 0,
      pageSize: fetchOptions.size || 10,
    },
  });

  const fetchData = useCallback(
    async (
      page: number = state.pagination.currentPage,
      extraParams?: Record<string, unknown>
    ) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const mergedParams = {
          ...fetchOptions.extraParams,
          ...extraParams,
        };

        const response = await fetchPaginated<T>(baseUrl, token, {
          ...fetchOptions,
          page,
          extraParams: mergedParams as Record<
            string,
            string | number | boolean | undefined
          >,
        });

        setState({
          data: response.data,
          loading: false,
          error: null,
          pagination: {
            currentPage: response.currentPage,
            totalPages: response.totalPages,
            totalItems: response.total,
            pageSize: response.size,
          },
        });

        return response;
      } catch (error) {
        const apiError = error as ApiError;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: apiError,
        }));
        return null;
      }
    },
    [baseUrl, token, fetchOptions, state.pagination.currentPage]
  );

  const setPage = useCallback(
    (page: number) => {
      if (page < 1) page = 1;
      if (
        state.pagination.totalPages > 0 &&
        page > state.pagination.totalPages
      ) {
        page = state.pagination.totalPages;
      }

      setState((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          currentPage: page,
        },
      }));

      return fetchData(page);
    },
    [fetchData, state.pagination.totalPages]
  );

  const search = useCallback(
    (params: Record<string, unknown>) => {
      return fetchData(1, params);
    },
    [fetchData]
  );

  // Cargar datos automáticamente si autoFetch es true
  useEffect(() => {
    if (autoFetch && token) {
      fetchData(initialPage);
    }
  }, [autoFetch, initialPage, token, fetchData]);

  return {
    ...state,
    fetchData,
    setPage,
    search,
    nextPage: () => setPage(state.pagination.currentPage + 1),
    prevPage: () => setPage(state.pagination.currentPage - 1),
    refresh: () => fetchData(state.pagination.currentPage),
  };
}
