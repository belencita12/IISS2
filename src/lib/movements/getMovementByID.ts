// src/api/getMovementByID.ts
import { MOVEMENTS_API } from "../urls";
import { MovementWithDetails } from "./IMovements"; // ⬅️ nuevo tipo

export const getMovementByID = async (
  id: number,
  token: string
): Promise<MovementWithDetails> => {
  const res = await fetch(`${MOVEMENTS_API}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Error al obtener el movimiento con ID ${id}`);
  }

  const data: MovementWithDetails = await res.json();
  console.log("DATA MOVEMENT BY ID:", data);
  return data;
};
