import { RACE_API } from "@/lib/urls";
import { PaginationResponse } from "../types";
import { Race } from "./IPet";

export const getRaces = async (token: string) => {
  try {
    const response = await fetch(`${RACE_API}?page=1`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Error al obtener razas");

    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    console.error("Error en getRaces:", error);
    throw error;
  }
};

export const getAllRaces = async (token: string, queryParams?: string) => {
  try {
    const response = await fetch(`${RACE_API}?${queryParams}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error al obtener razas");
    const data = await response.json();
    return data as PaginationResponse<Race>;
  } catch (error) {
    console.error("Error en getAllRaces:", error);
    throw error;
  }
};
