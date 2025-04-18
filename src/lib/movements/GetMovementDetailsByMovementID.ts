import MovementDetails from "@/lib/movements/IMovementDetails";
import { MOVEMENT_DETAILS_API } from "../urls";
import { PaginationResponse } from "@/lib/types";

export const getMovementDetailsByMovementId = async (
  movementId: number,
  token: string,
  queryString = ""
): Promise<PaginationResponse<MovementDetails>> => {
  const url = `${MOVEMENT_DETAILS_API}?movementId=${movementId}${queryString ? `&${queryString}` : ""}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Error al obtener los detalles del movimiento ${movementId}`);
  }

  return res.json(); 
};
