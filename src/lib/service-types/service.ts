import { SERVICE_TYPE_API } from "@/lib/urls";
import { toast } from "@/lib/toast";
//import { ServiceTypeTableSkeleton } from "@/components/admin/settings/service-types/ServiceTypeTableSkeleton";

export interface ServiceType {
  id: number;
  slug: string;
  name: string;
  description: string;
  durationMin: number;
  iva: number;
  price: number;
  cost: number;
  maxColabs?: number;
  isPublic?: boolean;
  tags?: string[];
  img?: {
    id: number;
    previewUrl: string;
    originalUrl: string;
  };
}

/*const toServiceType = (data: FormData): ServiceType => {
  return {
    id: data.get("id") ? Number(data.get("id")) : 0,
    slug: data.get("slug") ? String(data.get("slug")) : "",
    name: data.get("name") ? String(data.get("name")) : "",
    description: data.get("description") ? String(data.get("description")) : "",
    durationMin: data.get("durationMin") ? Number(data.get("durationMin")) : 0,
    iva: data.get("iva") ? Number(data.get("iva")) : 0,
    price: data.get("price") ? Number(data.get("price")) : 0,
    cost: data.get("cost") ? Number(data.get("cost")) : 0,
    maxColabs: data.get("maxColabs") ? Number(data.get("maxColabs")) : 1,
    isPublic: data.get("isPublic") ? Boolean(data.get("isPublic")) : false,
    tags: data.get("tags") ? String(data.get("tags")).split(",") : [],
    img: data.get("img")
      ? {
          id: Number(data.get("img.id")),
          previewUrl: String(data.get("img.previewUrl")),
          originalUrl: String(data.get("img.originalUrl")),
        }
      : undefined
  }
}*/

export const getServiceTypes = async (token: string, page: number = 1, query: string = "") => {
  const response = await fetch(
    `${SERVICE_TYPE_API}?page=${page}&search=${encodeURIComponent(query)}`,
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
  try {
    const response = await fetch(SERVICE_TYPE_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear el tipo de servicio");
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast("error", error.message || "Error al crear el tipo de servicio");
    } else {
      toast("error", "Error al crear el tipo de servicio");
    }
    throw error;
  }
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