import { ServiceType } from "./types";
import { SERVICE_TYPE_API } from "@/lib/urls";

export async function getServiceTypeById(id: string, token: string): Promise<ServiceType> {
  const response = await fetch(`${SERVICE_TYPE_API}/${id}`, {
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
    cost: 0, // Valor por defecto ya que no viene de la API
    iva: 0, // Valor por defecto ya que no viene de la API
    maxColabs: undefined, // No viene de la API
    isPublic: data.isPublic || false,
    imageUrl: data.img?.originalUrl || "",
    tags: data.tags || [],
  };
} 