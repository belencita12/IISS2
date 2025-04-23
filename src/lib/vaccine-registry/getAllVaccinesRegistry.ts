import { VACCINE_REGISTRY_API } from "../urls";
import { VaccineRecord } from "./IVaccineRegistry";

interface ResponseData {
  data: VaccineRecord[];
  total: number;
  currentPage: number;
  totalPages: number;
  size: number;
}

export const getAllVaccineRegistries = async (
  token: string,
  page: number = 1,
  size: number = 10,
  filters: Record<string, string> = {}
): Promise<ResponseData> => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
      ...filters,
    });

    const res = await fetch(`${VACCINE_REGISTRY_API}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Error al obtener los registros de vacunación");
    }

    const data = await res.json();
    return data as ResponseData;
  } catch (error) {
    console.error("Error en getAllVaccineRegistries:", error);
    throw error;
  }
};
