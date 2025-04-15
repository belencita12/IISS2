// src/api/getMovementDetails.ts
import MovementDetails from "@/lib/movements/IMovementDetails";
import { MOVEMENT_DETAILS_API } from "../urls";

export const getMovementDetailsByMovementId = async (
  movementId: number,
  token: string
): Promise<MovementDetails[]> => {
  const res = await fetch(`${MOVEMENT_DETAILS_API}?movementId=${movementId}&page=1`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Error al obtener los detalles del movimiento ${movementId}`);
  }

  const response = await res.json();
  console.log("DATA MOVEMENT DETAILS BY ID:", response.data);
  return response.data ?? [];
};
