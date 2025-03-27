// src/lib/api/work-position.ts

import { WORK_POSITION_API } from "@/lib/urls";


// Eliminar un puesto
export async function deleteWorkPosition(token: string, id: number) {
  const response = await fetch(`${WORK_POSITION_API}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al eliminar puesto: ${errorText}`);
  }

  const contentType = response.headers.get("content-type");
  const hasBody = contentType && contentType.includes("application/json");

  return hasBody ? await response.json() : null;
}
