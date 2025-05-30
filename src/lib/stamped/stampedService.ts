import { Stamped } from "./IStamped";
import { BASE_API_URL } from "../env";
import { apiFetch } from "../api/apiFetch";

export const deleteStamped = async (id: number, token: string): Promise<void> => {
  await apiFetch(`${BASE_API_URL}/stamped/${id}`, token, {
    method: "DELETE",
    showToast: true,
    customErrorMessage: "Error al eliminar el timbrado"
  });
}; 