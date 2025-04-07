// lib/movements/registerMovement.ts

import { Movement } from "@/lib/movements/IMovements";
import { MOVEMENTS_API } from "../urls";

export const registerMovement = async (
  movementData: Movement,
  token: string
) => {
  const response = await fetch(MOVEMENTS_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(movementData),
  });

  if (!response.ok) {
    throw new Error("Error al registrar el movimiento");
  }

  return response.json();
};
