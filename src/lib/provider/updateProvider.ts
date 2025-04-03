import { PROVIDER_API } from "@/lib/urls";
import { Provider } from "@/lib/provider/IProvider";

export async function updateProvider(token: string, id: number, data: Provider) {
  const response = await fetch(`${PROVIDER_API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar proveedor");
  }

  return await response.json();
}
