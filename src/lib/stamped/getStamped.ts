import { STAMPED_API } from "@/lib/urls";
import { PaginationResponse } from "../types";
import { Stamped } from "./IStamped";

export const getAllStamped = async (token: string, queryParams?: string) => {
  try {
    const response = await fetch(`${STAMPED_API}?${queryParams}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error al obtener timbrados");
    const data = await response.json();
    return data as PaginationResponse<Stamped>;
  } catch (error) {
    throw error;
  }
}; 