import { ServiceType } from "./types";
import { SERVICE_TYPE } from "@/lib/urls";

export async function getServiceTypeById(id: string, token: string): Promise<ServiceType> {
  const response = await fetch(`${SERVICE_TYPE}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener el tipo de servicio");
  }

  const data = await response.json();
  console.log('Datos del servicio:', data); // Para ver la estructura exacta
  
  // Mapear los campos según la estructura de la API
  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    description: data.description,
    duration: data.durationMin,
    price: data.price || 0,
    cost: data.cost || 0,
    iva: data.iva || 0,
    maxColabs: data.maxColabs || 0,
    isPublic: data.isPublic || false,
    imageUrl: data.img?.originalUrl || "",
    tags: data.tags || [],
  };
<<<<<<< HEAD
} 
=======
} 
>>>>>>> b8156d115233ee8ac87f3fe834f9c550e8b5c9b4
