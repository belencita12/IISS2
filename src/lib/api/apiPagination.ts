import { PaginationResponse } from "../types";
import { apiFetch, ApiOptions } from "./apiFetch";

// Opciones específicas para peticiones paginadas
export interface ApiPaginationOptions extends Omit<ApiOptions, 'method'> {
  page?: number;
  size?: number;
  extraParams?: Record<string, string | number | boolean | undefined>;
}

/**
 * Realiza una petición paginada y devuelve los resultados con su información de paginación
 * @param baseUrl URL base de la API
 * @param token Token de autenticación
 * @param options Opciones de la petición
 * @returns Respuesta paginada tipada
 */
export async function fetchPaginated<T =unknown>(
  baseUrl: string,
  token: string,
  options: ApiPaginationOptions = {}
): Promise<PaginationResponse<T>> {

  const { page = 1, size, extraParams = {}, ...apiOptions } = options;
  // Construir los parámetros de query
  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  
  if (size) {
    queryParams.append("size", size.toString());
  }
  
  // Añadir parámetros adicionales
  Object.entries(extraParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });
  
  // Construir la URL completa
  const url = `${baseUrl}?${queryParams.toString()}`;
  
  // Realizar la petición
  const response = await apiFetch<PaginationResponse<T>>(url, token, {
    method: "GET",
    ...apiOptions,
  });
  
  // Si hay un error, devolver una respuesta paginada vacía
  if (!response.ok || !response.data) {
    return {
      data: [] as T[],
      total: 0,
      size: size || 10,
      prev: false,
      next: false,
      currentPage: page,
      totalPages: 0,
    };
  }
  
  return response.data;
}