import { VACCINE_API } from "../urls";

export const deleteVaccineById = async (id: number, token: string) => {
  const response = await fetch(`${VACCINE_API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error al eliminar la vacuna");
  }
};
