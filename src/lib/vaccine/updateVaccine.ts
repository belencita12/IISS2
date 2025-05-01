import { toast } from "../toast";
import { VACCINE_API } from "../urls";

interface UpdateVaccineData {
  name?: string;
  manufacturerId?: number;
  speciesId?: number;
  cost?: number;
  iva?: number;
  price?: number;
  productImg?: File | null;
}

export async function updateVaccineById(token: string, id: number, data: UpdateVaccineData) {
  const url = `${VACCINE_API}/${id}`;
  
  const formData = new FormData();

  if (data.name) formData.append("name", data.name);
  if (data.manufacturerId) formData.append("manufacturerId", data.manufacturerId.toString());
  if (data.speciesId) formData.append("speciesId", data.speciesId.toString());
  if (data.cost !== undefined) formData.append("cost", data.cost.toString());
  if (data.iva !== undefined) formData.append("iva", data.iva.toString());
  if (data.price !== undefined) formData.append("price", data.price.toString());
  if (data.productImg instanceof File) formData.append("productImg", data.productImg);

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    toast("error", `Error en la respuesta de la API: ${response.status} | ${response.statusText}`);
    throw new Error("Error al actualizar la vacuna");
  }

  const updatedData = await response.json();
  return updatedData;
}
