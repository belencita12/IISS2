import { apiFetch } from '../apiFetch';
import { fetchPaginated } from '../apiPagination';
import { PROVIDER_API } from '@/lib/urls';
import { Provider, ProviderQueryParams } from '@/lib/provider/IProvider';
import { PaginationResponse } from '@/lib/types';

/**
 * Obtiene un listado paginado de proveedores
 */
export async function getProviders(
  token: string,
  params: ProviderQueryParams
): Promise<PaginationResponse<Provider>> {
  return fetchPaginated<Provider>(PROVIDER_API, token, {
    extraParams: params,
  });
}

/**
 * Obtiene un proveedor por su ID
 */
export async function getProviderById(
  providerId: number,
  token: string
): Promise<Provider | null> {
  const response = await apiFetch<Provider>(`${PROVIDER_API}/${providerId}`, token);
  
  return response.data;
}

/**
 * Crea un nuevo proveedor
 */
export async function createProvider(
  token: string,
  data: Provider
) {
  const response = await apiFetch<Provider>(PROVIDER_API, token, {
    method: 'POST',
    body: data,
  });
  
  return response.data;
}

/**
 * Actualiza un proveedor existente
 */
export async function updateProvider(
  token: string,
  id: number,
  data: Provider
) {
  const response = await apiFetch<Provider>(`${PROVIDER_API}/${id}`, token, {
    method: 'PATCH',
    body: data,
  });
  
  return response.data;
}

/**
 * Elimina un proveedor
 */
export async function deleteProvider(
  token: string,
  id: number
) {
  const response = await apiFetch(`${PROVIDER_API}/${id}`, token, {
    method: 'DELETE',
  });
  
  return response.ok;
}