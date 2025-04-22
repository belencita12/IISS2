import { VACCINE_REGISTRY_API } from "../urls";
import { VaccineRecord } from "./IVaccineRegistry";

export const getVaccineRegistryById = async (
  token: string,
  id: number
): Promise<VaccineRecord | null> => {
  try {
    const res = await fetch(`${VACCINE_REGISTRY_API}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 404) return null;

    const data = await res.json();
    return data as VaccineRecord;
  } catch (error) {
    console.error("Error al obtener el registro de vacunación:", error);
    return null;
  }
};
