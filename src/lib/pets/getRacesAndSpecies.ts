import { SPECIES_API, RACE_API } from "@/lib/urls";
import { PaginationResponse } from "../types";
import { Species } from "./IPet";

export const getSpecies = async (token: string) => {
  try {
    const response = await fetch(`${SPECIES_API}?page=1`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Error al obtener especies");

    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    console.error("Error en getSpecies:", error);
    throw error;
  }
};

export const getAllSpecies = async (token: string, queryParams?: string) => {
  try {
    const response = await fetch(`${SPECIES_API}?${queryParams}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error al obtener especies");
    const data = await response.json();
    return data as PaginationResponse<Species>;
  } catch (error) {
    console.error("Error en getAllSpecies:", error);
    throw error;
  }
};

export const getRacesBySpecies = async (speciesId: number, token: string, includeDeleted?: boolean, pageSize?: number) => {
  try {
    const response = await fetch(`${RACE_API}?page=1&size=${pageSize ?? 16}&speciesId=${speciesId}&includeDeleted=${includeDeleted?.toString() ?? 'false'}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Error al obtener razas");

    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    console.error("Error en getRacesBySpecies:", error);
    throw error;
  }
};
