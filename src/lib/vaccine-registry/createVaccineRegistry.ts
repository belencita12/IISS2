import { VACCINE_REGISTRY_API } from "../urls";
import { VaccineRecord } from "./IVaccineRegistry";

export type VaccineRegistryCreateBody = Pick<
  VaccineRecord,
  "vaccineId" | "petId" | "dose" | "applicationDate" | "expectedDate"
>;

export const createVaccineRegistry = async (
  vaccineData: VaccineRegistryCreateBody,
  token: string
) => {
  try {
    const response = await fetch(VACCINE_REGISTRY_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(vaccineData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error al registrar la vacunación");
    }

    return result;
  } catch (error) {
    console.error("Error al registrar la vacunación:", error);
    throw error;
  }
};
