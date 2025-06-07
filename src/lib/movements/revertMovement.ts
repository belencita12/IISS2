import { MOVEMENTS_API } from "@/lib/urls";

export async function revertMovement(id: number, token: string): Promise<void> {
  const response = await fetch(`${MOVEMENTS_API}/${id}/revert`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al revertir el movimiento');
  }

  return response.json();
}