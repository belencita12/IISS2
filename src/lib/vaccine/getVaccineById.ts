// lib/vaccine/getVaccineById.ts
import { VACCINE_API } from "../urls";

export async function getVaccineById(token: string, id: number) {
  const url = `${VACCINE_API}/${id}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Error en la respuesta de la API:", response.status, response.statusText);
    throw new Error("Error al obtener la vacuna");
  }

  const data = await response.json();
  return data;
}
