import { MOVEMENT_API } from "../urls";
import { MovementRequest} from "./IMovement";

export const registerMovement = async (
  movementData: MovementRequest,
  token: string
) => {
  try {
    const response = await fetch(MOVEMENT_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(movementData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error al registrar el movimiento");
    }

    return result;
  } catch (error) {
    console.error("Error al registrar el movimiento:", error);
    throw error;
  }
};
