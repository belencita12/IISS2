import { Stamped } from "./IStamped";
import { BASE_API_URL } from "../env";
import { apiFetch } from "../api/apiFetch";

export const deleteStamped = async (id: number, token: string): Promise<void> => {
  const response = await apiFetch(`${BASE_API_URL}/stamped/${id}`, token, {
    method: "DELETE",
    showToast: true,
    customErrorMessage: "Error al eliminar el timbrado",
    throwErrors: true
  });

  if (!response.ok) {
    throw new Error(response.error?.message || "Error al eliminar el timbrado");
  }
}; 