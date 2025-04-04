import { PROVIDER_API } from "@/lib/urls";

export async function deleteProviderById(token: string, id: number) {
  const response = await fetch(`${PROVIDER_API}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al eliminar proveedor: ${errorText}`);
  }

  const contentType = response.headers.get("content-type");
  const hasBody = contentType && contentType.includes("application/json");

  return hasBody ? await response.json() : null;
}
