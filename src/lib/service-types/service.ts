import { SERVICE_TYPE_API } from "@/lib/urls";

export interface ServiceType {
  id: number;
  slug: string;
  name: string;
  description: string;
  durationMin: number;
  iva: number;
  price: number;
  maxColabs?: number;
  isPublic?: boolean;
  tags?: string[];
  img?: {
    id: number;
    previewUrl: string;
    originalUrl: string;
  };
}

export const getServiceTypes = async (token: string, page: number = 1, query: string = "") => {
  const response = await fetch(
    `${SERVICE_TYPE_API}?page=${page}&query=${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) throw new Error("Error al obtener los tipos de servicio");
  return await response.json();
};

export const getServiceTypeById = async (token: string, id: number) => {
  const response = await fetch(`${SERVICE_TYPE_API}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Error al obtener el tipo de servicio");
  return await response.json();
};

export const createServiceType = async (token: string, data: FormData) => {
  const response = await fetch(SERVICE_TYPE_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  if (!response.ok) throw new Error("Error al crear el tipo de servicio");
  return await response.json();
};

export const updateServiceType = async (token: string, id: number, data: FormData) => {
  const response = await fetch(`${SERVICE_TYPE_API}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  if (!response.ok) throw new Error("Error al actualizar el tipo de servicio");
  return await response.json();
};

export const deleteServiceType = async (token: string, id: number) => {
  const response = await fetch(`${SERVICE_TYPE_API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Error al eliminar el tipo de servicio");
  return true;
}; 