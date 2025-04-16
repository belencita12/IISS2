import { MOVEMENTS_API } from "../urls";
import { MovementData } from "./IMovements";

export const getMovementByID = async (
  id: number,
  token: string
): Promise<MovementData> => {
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

  const data: MovementData = await res.json();
  return data;
};
