import { VACCINE_REGISTRY_API } from "../urls";
import { VaccineRegistryCreateBody } from "./createVaccineRegistry";

export const updateVaccineRegistry = async (
  token: string,
  id: number,
  vaccineData: VaccineRegistryCreateBody
) => {
  try {
    const response = await fetch(`${VACCINE_REGISTRY_API}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(vaccineData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error al actualizar el registro");
    }

    return result;
  } catch (error) {
    console.error("Error al actualizar la vacunación:", error);
    throw error;
  }
};
