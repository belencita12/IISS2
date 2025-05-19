import { PET_API } from "@/lib/urls";
import { PetDataResponse } from "./IPet";

export const getPetsByUserId = async (
  clientId: number | undefined,
  token: string
) => {
  try {
    const response = await fetch(
      `${PET_API}?page=1&size=5${clientId ? `&clientId=${clientId}` : ""}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) throw new Error("Error al obtener las mascotas");

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    throw error;
  }
};

export const getPetsByUserIdFull = async (
  clientId: number,
  token: string,
  page = 1
) => {
  try {
    const response = await fetch(
      `${PET_API}?page=${page}&clientId=${clientId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) throw new Error("Error al obtener las mascotas");

    const data = await response.json();
    return data as PetDataResponse;
  } catch (error) {
    throw error;
  }
};

export const getPetsByNameAndUserIdFull = async (
  clientId: number | undefined,
  token: string,
  page = 1,
  name?: string
) => {
  try {
    const nameQuery = name ? `&name=${name}` : "";
    const response = await fetch(
      `${PET_API}?page=${page}${
        clientId ? `&clientId=${clientId}` : ""
      }${nameQuery}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) throw new Error("Error al obtener las mascotas");

    const data = await response.json();
    return data as PetDataResponse;
  } catch (error) {
    console.error("Error en obtener mascotas por nombre y usuario", error);
    throw error;
  }
};
