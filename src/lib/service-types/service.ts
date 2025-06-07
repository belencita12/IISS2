import { useFetch } from "@/hooks/api/useFetch";
import { SERVICE_TYPE } from "@/lib/urls";

export const useServiceTypeApi = (token: string) => {
  const {
    get,
    post,
    patch,
    delete: del,
    loading,
  } = useFetch(SERVICE_TYPE, token);

  /**
   * Obtener lista de tipos de servicio con paginación y búsqueda
   * @param page Número de página
   * @param query Cadena de búsqueda
   * @returns Lista de tipos de servicio
   */
  const getServiceTypes = async (page: number = 1, query: string = "") => {
    const dynamicUrl = `${SERVICE_TYPE}?page=${page}&search=${encodeURIComponent(query)}`;
    const response = await get(undefined, dynamicUrl);

    if (!response.ok) {
      throw new Error("Error al obtener los tipos de servicio");
    }

    return response.data;
  };

  /**
   * Obtener un tipo de servicio por ID
   * @param id ID del tipo de servicio
   * @returns Datos del tipo de servicio
   */
  const getServiceTypeById = async (id: number) => {
    const dynamicUrl = `${SERVICE_TYPE}/${id}`;
    const response = await get(undefined, dynamicUrl);

    if (!response.ok) {
      throw new Error("Error al obtener el tipo de servicio");
    }

    return response.data;
  };

  /**
   * Crear un nuevo tipo de servicio
   * @param data Datos del formulario
   * @returns Datos del tipo de servicio creado
   */
  const createServiceType = async (data: FormData) => {
    const response = await post(data);
    return response.data;
  };

  /**
   * Actualizar un tipo de servicio existente
   * @param id ID del tipo de servicio
   * @param data Datos del formulario
   * @returns Datos del tipo de servicio actualizado
   */
  const updateServiceType = async (id: number, data: FormData) => {
    const dynamicUrl = `${SERVICE_TYPE}/${id}`;
    const response = await patch(data, dynamicUrl);

    if (!response.ok) {
      throw new Error(response.error?.message || "Error al actualizar el tipo de servicio");
    }

    return response.data;
  };

  /**
   * Eliminar un tipo de servicio por ID
   * @param id ID del tipo de servicio
   * @returns `true` si la eliminación fue exitosa
   */
  const deleteServiceType = async (id: number) => {
    const dynamicUrl = `${SERVICE_TYPE}/${id}`;
    const response = await del(undefined, dynamicUrl);

    if (!response.ok) {
      throw new Error("Error al eliminar el tipo de servicio");
    }
    return true;
  };

  return {
    getServiceTypes,
    getServiceTypeById,
    createServiceType,
    updateServiceType,
    deleteServiceType,
    loading,
  };
};