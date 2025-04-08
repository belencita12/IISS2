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
    const errorData = await response.json();
    const message = errorData?.message || "Error al registrar el movimiento";
    throw new Error(message);
  }

  return response.json();
};
