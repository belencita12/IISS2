import { useState, useCallback } from 'react';
import { apiFetch, ApiError, ApiMethod, ApiOptions } from '@/lib/api/apiFetch';

interface UseFetchState<T> {
  data: T | null;
  error: ApiError | null;
  loading: boolean;
}

interface UseFetchOptions extends Omit<ApiOptions, 'body'> {
  immediate?: boolean; // Si es true, realiza la petición inmediatamente
}

/**
 * Hook para realizar peticiones HTTP con gestión de estado
 * @param url URL de la petición
 * @param token Token de autenticación
 * @param options Opciones adicionales
 * @returns Estado de la petición y función para ejecutarla
 */
export function useFetch<T = unknown, P = unknown>(
  url: string,
  token?: string | null,
  options: UseFetchOptions = {}
) {
  const { immediate = false, ...fetchOptions } = options;
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    error: null,
    loading: immediate,
  });

  const execute = useCallback(
    async (
      body?: P,
      dynamicUrl: string = url,
      dynamicMethod?: ApiMethod
    ) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const method = dynamicMethod || options.method;
        const response = await apiFetch<T>(
          dynamicUrl,
          token,
          {
            ...fetchOptions,
            method,
            body,
            throwErrors: false,
          }
        );

        setState({
          data: response.data,
          error: response.error,
          loading: false,
        });

        return response;
      } catch (error) {
        const apiError = error as ApiError;
        setState({
          data: null,
          error: apiError,
          loading: false,
        });
        return { data: null, error: apiError, ok: false, status: apiError.status || 0 };
      }
    },
    [url, token, options.method, fetchOptions]
  );

  // Si immediate es true, ejecutar la petición inmediatamente
  useState(() => {
    if (immediate) {
      execute();
    }
  });

  return {
    ...state,
    execute,
    // Métodos auxiliares para diferentes tipos de peticiones
    get: useCallback((params?: P, dynamicUrl?: string) => execute(params, dynamicUrl, 'GET'), [execute]),
    post: useCallback((body?: P, dynamicUrl?: string) => execute(body, dynamicUrl, 'POST'), [execute]),
    put: useCallback((body?: P, dynamicUrl?: string) => execute(body, dynamicUrl, 'PUT'), [execute]),
    patch: useCallback((body?: P, dynamicUrl?: string) => execute(body, dynamicUrl, 'PATCH'), [execute]),
    delete: useCallback((params?: P, dynamicUrl?: string) => execute(params, dynamicUrl, 'DELETE'), [execute]),
  };
}